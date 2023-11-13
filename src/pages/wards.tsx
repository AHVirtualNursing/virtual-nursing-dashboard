import React, { useState, useEffect, useRef, useContext } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SmartBed } from "@/types/smartbed";
import { fetchVitalByVitalId } from "./api/vitals_api";
import {
  fetchVirtualNurseByNurseId,
  fetchWardsByVirtualNurse,
} from "./api/nurse_api";
import { fetchBedByBedId } from "./api/smartbed_api";
import autoAnimate from "@formkit/auto-animate";
import profilePic from "../../public/profilepic.png";
import VitalTiles from "@/components/VitalTiles";
import TileCustomisationModal from "@/components/TileCustomisationModal";
import BedTiles from "@/components/BedTiles";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { VirtualNurse } from "@/types/virtualNurse";
import { Link, Tooltip } from "@mui/material";
import { Ward } from "@/types/ward";
import { SocketContext } from "@/pages/layout";
import { Alert } from "@/types/alert";
import { Patient } from "@/types/patient";
import DashboardAlertIcon from "@/components/DashboardAlertIcon";
import { fetchAlertsByPatientId } from "./api/patients_api";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";

export default function Wards() {
  const router = useRouter();
  const [data, setData] = useState<SmartBed[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [vitals, setVitals] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [nurse, setNurse] = useState<VirtualNurse>();
  const [searchPatient, setSearchPatient] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState("assigned-wards");
  const [showVitalAlerts, setShowVitalAlerts] = useState("all-status");
  const [showBedAlerts, setShowBedAlerts] = useState("all-status");
  const { data: sessionData } = useSession();
  const socket = useContext(SocketContext);
  const [socketAlertList, setSocketAlertList] = useState<Alert[]>();
  const [socketPatient, setSocketPatient] = useState<Patient>();

  const handlePatientSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPatient(event.target.value);
  };

  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const viewPatientVisualisation = (
    patientId: string | undefined,
    bedId: string
  ) => {
    if (patientId != undefined) {
      router.push(
        `/patientVisualisation?patientId=${patientId}&bedId=${bedId}`
      );
    }
  };

  const fetchPatientVitals = async () => {
    let patientVitalsArr: any[] = [];
    let patientAlertsArr: any[] = [];
    for (const bedData of data) {
      let patientVitals = (bedData.patient as Patient)?.vital;
      if (patientVitals) {
        const vitalId =
          typeof patientVitals === "string" ? patientVitals : patientVitals._id;
        const res = await fetchVitalByVitalId(vitalId);
        patientVitalsArr.push(res);
      } else {
        patientVitalsArr.push(undefined);
      }
      const res = await fetchAlertsByPatientId(
        (bedData.patient as Patient)._id
      );
      const vitalAlerts = res.filter(
        (alert: Alert) => alert.alertType === "Vital"
      );
      const bedAlerts = res.filter(
        (alert: Alert) => alert.alertType === "SmartBed"
      );
      const lastVitalEntryStatus =
        vitalAlerts[vitalAlerts.length - 1]?.status || "none";
      const lastBedEntryStatus =
        bedAlerts[bedAlerts.length - 1]?.status || "none";
      patientAlertsArr.push([lastVitalEntryStatus, lastBedEntryStatus]);
    }

    const combined = data.map((bedData, index) => ({
      bed: bedData,
      vital: patientVitalsArr[index],
      alerts: patientAlertsArr[index],
    }));

    combined.sort((bed1, bed2) => {
      const countOpenBed1 =
        bed1.alerts?.filter((x: string) => x === "open").length || 0;
      const countOpenBed2 =
        bed2.alerts?.filter((x: string) => x === "open").length || 0;
      const countHandlingBed1 =
        bed1.alerts?.filter((x: string) => x === "handling").length || 0;
      const countHandlingBed2 =
        bed2.alerts?.filter((x: string) => x === "handling").length || 0;

      if (countOpenBed1 > countOpenBed2) {
        return -1;
      } else if (countOpenBed1 < countOpenBed2) {
        return 1;
      } else if (countHandlingBed1 > countHandlingBed2) {
        return -1;
      } else if (countHandlingBed1 < countHandlingBed2) {
        return 1;
      } else {
        return 0;
      }
    });
    const sortedBeds = combined.map((x) => x.bed);
    const sortedVitals = combined.map((x) => x.vital);
    const sortedAlerts = combined.map((x) => x.alerts);
    if (
      sortedBeds.length !== data.length ||
      !sortedBeds.every((element, index) => element === data[index])
    ) {
      setData(sortedBeds);
    }
    if (
      sortedVitals.length !== vitals.length ||
      !sortedVitals.every((element, index) => element === vitals[index])
    ) {
      setVitals(sortedVitals);
    }
    if (
      sortedAlerts.length !== alerts.length ||
      !sortedAlerts.every((element, index) => element === alerts[index])
    ) {
      setAlerts(sortedAlerts);
    }
  };

  useEffect(() => {
    fetchWardsByVirtualNurse(sessionData?.user.id).then((wards) => {
      let promises: Promise<SmartBed>[] = [];
      let wardsToView = [];
      let smartBedIds = [];
      if (selectedWard === "assigned-wards") {
        wardsToView = wards;
      } else {
        wardsToView = wards.filter(
          (ward: Ward) => ward.wardNum === selectedWard
        );
      }
      setWards(wards);
      for (const ward of wardsToView) {
        const bedArray = ward.smartBeds;
        smartBedIds.push(...bedArray);
      }
      smartBedIds.map((id) => promises.push(fetchBedByBedId(id)));
      Promise.all(promises).then((res) => {
        setData(
          res.filter(
            (sb) => sb.ward && sb.patient && sb.bedStatus === "occupied"
          )
        );
      });
    });
    fetchVirtualNurseByNurseId(sessionData?.user.id).then((res) => {
      setNurse(res.data);
    });
  }, [selectedWard]);

  useEffect(() => {}, [showVitalAlerts, showBedAlerts]);

  useEffect(() => {
    if (data.length > 0) {
      fetchPatientVitals();
    }
  }, [data]);

  useEffect(() => {
    const refreshContent = (updatedBed: any) => {
      console.log("enter");
      setData((prevData) => {
        console.log(prevData);
        const index = prevData.findIndex((bed) => bed._id === updatedBed._id);
        if (index !== -1) {
          const updatedBeds = [...prevData];
          updatedBeds[index] = updatedBed;
          console.log(updatedBeds);
          return updatedBeds;
        }
        return prevData;
      });
    };

    const refreshPatientInfo = (updatedPatient: any) => {
      console.log("enter");
      setData((prevData) => {
        const updatedData = prevData.map((bed) => {
          if (
            bed.patient &&
            (bed.patient as Patient)?._id === updatedPatient._id
          ) {
            return { ...bed, patient: updatedPatient };
          }
          return bed;
        });
        return updatedData;
      });
    };

    const refreshPatientVitals = (updatedVitals: any) => {
      const vitalObj = updatedVitals.vital;
      const patientId = updatedVitals.patient;
      setData((prevData) => {
        const updatedData = prevData.map((bed) => {
          if (bed.patient && (bed.patient as Patient)?._id === patientId) {
            return { ...bed, vital: vitalObj };
          }
          return bed;
        });
        return updatedData;
      });
    };

    const discharge = (patient: any) => {
      setData((prevData) => {
        const updatedData = prevData.map((bed) => {
          if (bed.patient && (bed.patient as Patient)?._id === patient._id) {
            return { ...bed, bedStatus: "vacant", patient: undefined };
          }
          return bed;
        });
        return updatedData;
      });
    };

    const handleAlertIncoming = (data: any) => {
      setSocketAlertList(data.alertList);
      setSocketPatient(data.patient);
    };

    const handleDeleteAlert = (data: any) => {
      setSocketAlertList(data.alertList);
      setSocketPatient(data.patient);
    };

    socket.on("updatedSmartbed", refreshContent);
    socket.on("updatedPatient", refreshPatientInfo);
    socket.on("updatedVitals", refreshPatientVitals);
    socket.on("dischargePatient", discharge);
    socket.on("patientAlertAdded", handleAlertIncoming);
    socket.on("patientAlertDeleted", handleDeleteAlert);
    return () => {
      socket.off("updatedSmartbed", refreshContent);
      socket.off("updatedPatient", refreshPatientInfo);
      socket.off("updatedVitals", refreshPatientVitals);
      socket.off("dischargePatient", discharge);
      socket.off("patientAlertAdded", handleAlertIncoming);
      socket.off("patientAlertDeleted", handleDeleteAlert);
    };
  }, []);

  return (
    <div className="flex flex-col p-8 gap-6 w-full shadow-lg bg-slate-100">
      <div className="flex justify-between">
        <h4>Virtual Nurse Dashboard</h4>
        <button
          className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border-none"
          onClick={() => router.push("/createPatient")}
        >
          Create Patient
        </button>
      </div>
      <div className="gap-x-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="pr-5">
            <Link href="/dashboard">
              <button className="p-0 m-0 cursor-pointer">
                <ListIcon />
              </button>
            </Link>
            <button disabled className="m-0 p-0">
              <GridViewIcon />
            </button>
          </div>
          <label
            htmlFor="ward-select"
            className="text-sm font-medium text-gray-900"
          >
            Search Patient:
          </label>
          <input
            className="bg-gray-50 border-gray-300 text-center border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 py-1 mx-2"
            placeholder="Enter Patient Name"
            type="text"
            name="search"
            value={searchPatient}
            onChange={handlePatientSearch}
          ></input>
          <label
            htmlFor="ward-select"
            className="text-sm font-medium text-gray-900"
          >
            Beds
          </label>
          <select
            name="wardSelect"
            id="ward-select"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 py-1 mx-2"
            value={selectedWard}
            onChange={(e) => {
              console.log("selected option", e.target.value);
              setSelectedWard(e.target.value);
            }}
          >
            <option value="assigned-wards">Assigned Wards</option>
            {wards.map((ward) => (
              <option value={`${ward.wardNum}`}>Ward {ward.wardNum}</option>
            ))}
          </select>
          <label
            htmlFor="vital-alerts-select"
            className="text-sm font-medium text-gray-900"
          >
            Vital Alerts
          </label>
          <select
            name="vitalAlertsSelect"
            id="vital-alerts-select"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 py-1 mx-2"
            value={showVitalAlerts}
            onChange={(e) => {
              console.log("selected option", e.target.value);
              setShowVitalAlerts(e.target.value);
            }}
          >
            <option value="all-status">All</option>
            <option value="open">Open</option>
            <option value="handling">Handling</option>
          </select>
          <label
            htmlFor="bed-alerts-select"
            className="text-sm font-medium text-gray-900"
          >
            Bed Alerts
          </label>
          <select
            name="bedAlertsSelect"
            id="bed-alerts-select"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 py-1 mx-2"
            value={showBedAlerts}
            onChange={(e) => {
              console.log("selected option", e.target.value);
              setShowBedAlerts(e.target.value);
            }}
          >
            <option value="all-status">All</option>
            <option value="open">Open</option>
            <option value="handling">Handling</option>
          </select>
        </div>
        <TileCustomisationModal
          cardLayout={nurse?.cardLayout}
          setNurse={setNurse}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 flex" ref={parent}>
        {data
          .filter((bed) =>
            (bed.patient as Patient)?.name.toLowerCase().includes(searchPatient)
          )
          .map((pd, index) => (
            <div
              className="bg-white rounded-2xl p-4 shadow-lg hover:cursor-pointer hover:bg-blue-100"
              onClick={() =>
                viewPatientVisualisation((pd.patient as Patient)?._id, pd._id)
              }
              key={pd._id}
            >
              <div className="flex items-start justify-start">
                <div className="w-1/2 flex items-start justify-start">
                  <img
                    style={{ borderRadius: "50%" }}
                    width={60}
                    src={profilePic.src}
                  />

                  <div className="text-left px-4">
                    <h3>{(pd.patient as Patient)?.name}</h3>
                    <p>
                      Ward: {(pd.ward as Ward)?.wardNum} Bed: {pd.bedNum}
                    </p>
                    {nurse?.cardLayout.weight ? <p>Weight: 69kg</p> : null}
                  </div>
                </div>
                <div className="w-1/2 flex items-start justify-around">
                  <DashboardAlertIcon
                    patientId={(pd.patient as Patient)?._id}
                    socketData={
                      socketPatient?._id === (pd.patient as Patient)?._id
                        ? socketAlertList
                        : null
                    }
                  />
                  {nurse?.cardLayout.fallRisk ? (
                    <div>
                      <p>Fall Risk</p>
                      <div className="flex items-center justify-center">
                        <p>{(pd.patient as Patient)?.fallRisk}</p>
                        {(pd.patient as Patient)?.fallRisk === "High" &&
                        !pd.isBedExitAlarmOn ? (
                          <Tooltip
                            title={
                              <p style={{ fontSize: "16px" }}>
                                {pd.bedAlarmProtocolBreachReason}
                              </p>
                            }
                            placement="top"
                          >
                            <ReportProblemIcon className="fill-red-500" />
                          </Tooltip>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                  {nurse?.cardLayout.news2 ? (
                    <div>
                      <p>NEWS2</p>
                      <p>
                        {
                          vitals[index]?.news2Score[
                            vitals[index]?.news2Score.length - 1
                          ]?.reading
                        }
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
              <BedTiles cardLayout={nurse?.cardLayout} smartbed={pd} />
              <VitalTiles cardLayout={nurse?.cardLayout} data={vitals[index]} />
            </div>
          ))}
      </div>
    </div>
  );
}
