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
import profilePic from "../../public/profilepic.jpg";
import VitalTiles from "@/components/VitalTiles";
import TileCustomisationModal from "@/components/TileCustomisationModal";
import BedTiles from "@/components/BedTiles";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { VirtualNurse } from "@/types/virtualNurse";
import { Tooltip } from "@mui/material";
import { Ward } from "@/types/ward";
import { SocketContext } from "@/pages/layout";
import { Alert } from "@/types/alert";
import { Patient } from "@/types/patient";
import DashboardAlertIcon from "@/components/DashboardAlertIcon";
import HotelIcon from "@mui/icons-material/Hotel";

export default function Wards() {
  const router = useRouter();
  const [data, setData] = useState<SmartBed[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [vitals, setVitals] = useState<any[]>([]);
  const [nurse, setNurse] = useState<VirtualNurse>();
  const [searchPatient, setSearchPatient] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState("assigned-wards");
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
    }
    const combined = data.map((bedData, index) => ({
      bed: bedData,
      vital: patientVitalsArr[index],
    }));
    combined.sort((vital1, vital2) => {
      if (vital1.vital === undefined && vital2.vital === undefined) {
        return 0;
      } else if (vital1.vital === undefined) {
        return 1;
      } else if (vital2.vital === undefined) {
        return -1;
      } else {
        if (
          (vital1.vital.heartRate === undefined ||
            vital1.vital.heartRate.length == 0) &&
          (vital2.vital.heartRate === undefined ||
            vital2.vital.heartRate.length == 0)
        ) {
          return 0;
        } else if (
          vital1.vital.heartRate === undefined ||
          vital1.vital.heartRate.length == 0
        ) {
          return 1;
        } else if (
          vital2.vital.heartRate === undefined ||
          vital2.vital.heartRate.length == 0
        ) {
          return -1;
        } else {
          return (
            Math.round(
              vital2.vital.heartRate[vital2.vital.heartRate.length - 1].reading
            ) -
            Math.round(
              vital1.vital.heartRate[vital1.vital.heartRate.length - 1].reading
            )
          );
        }
      }
    });
    const sortedBeds = combined.map((x) => x.bed);
    const sortedVitals = combined.map((x) => x.vital);
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
        // console.log("Smart Beds assigned to VN", res);
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

  // fetching vitals immediately after beds are populated
  useEffect(() => {
    // console.log("first");
    if (data.length > 0) {
      fetchPatientVitals();
    }
  }, [data]);

  useEffect(() => {
    // console.log("fetch vitals interval use effect");
    if (data.length > 0) {
      const interval = setInterval(() => {
        fetchPatientVitals();
      }, 60000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [vitals, data]);

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
        <div>
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
                  <img width={60} src={profilePic.src} />
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
                  {!pd.isBedExitAlarmOn && !pd.isPatientOnBed ? (
                    <HotelIcon style={{ color: "red" }} />
                  ) : null}
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
                          ].reading
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
