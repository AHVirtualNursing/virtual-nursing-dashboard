import React, { useContext, useEffect, useRef, useState } from "react";
import { fetchVitalByVitalId } from "@/pages/api/vitals_api";
import { fetchBedByBedId } from "@/pages/api/smartbed_api";
import { SmartBed } from "@/types/smartbed";
import { useRouter } from "next/navigation";
import TableSubHeader from "./TableSubHeader";
import autoAnimate from "@formkit/auto-animate";
import { useSession } from "next-auth/react";
import { fetchWardsByVirtualNurse } from "@/pages/api/nurse_api";
import TableDataRow from "./TableDataRow";
import { Ward } from "@/types/ward";
import Link from "next/link";
import DashboardAlertIcon from "./DashboardAlertIcon";
import { Alert } from "@/types/alert";
import { Patient } from "@/types/patient";
import HotelIcon from "@mui/icons-material/Hotel";
import { fetchAlertsByPatientId } from "@/pages/api/patients_api";
import { SocketContext } from "@/pages/layout";
import SelectFilter from "../SelectFilter";

type PatientListProps = {
  /**
   * ward/wards selected by virtual nurse to view in overview page
   * ward/wards must be assigned to virtual nurse
   * */
  selectedWard: string | string[];
};

export default function Patients({ selectedWard }: PatientListProps) {
  const router = useRouter();
  const [data, setData] = useState<SmartBed[]>([]);
  const [searchPatient, setSearchPatient] = useState<string>("");
  const [searchCondition, setSearchCondition] = useState<string>("");
  const [selectedAcuity, setSelectedAcuity] = useState<string>("");
  const [selectedFallRisk, setSelectedFallRisk] = useState<string>("");
  const [vitals, setVitals] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const { data: sessionData } = useSession();
  const socket = useContext(SocketContext);
  const [socketAlertList, setSocketAlertList] = useState<Alert[]>();
  const [socketPatient, setSocketPatient] = useState<Patient>();

  const handlePatientSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPatient(event.target.value);
  };

  const handleConditionSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchCondition(event.target.value);
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
      console.log("ENTER");
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

  useEffect(() => {
    fetchWardsByVirtualNurse(sessionData?.user.id).then((wards) => {
      let promises: Promise<SmartBed>[] = [];
      let wardsToView = [];
      let smartBedIds = [];
      if (selectedWard === "") {
        wardsToView = wards;
      } else {
        wardsToView = wards.filter(
          (ward: Ward) => ward.wardNum === selectedWard
        );
      }
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
  }, [selectedWard, sessionData?.user.id]);

  useEffect(() => {
    if (data.length > 0) {
      fetchPatientVitals();
    }
  }, [data]);

  return (
    <div className="h-full overflow-auto scrollbar w-full">
      <table className="table-fixed border-collapse border-spacing-3">
        <thead className="text-sm text-left">
          {/* ------ column headers ------ */}
          <tr>
            <th></th>
            <th className="px-2">Patient</th>
            <th>Condition</th>
            <th className="px-2">Acuity Level</th>
            <th>Fall Risk</th>
            <th>Bed</th>
            <th>Ward</th>
            <th colSpan={4}>Bed Rails</th>
            <th className="px-1">Bed Brakes</th>
            <th className="px-1">Bed Lowest</th>
            <th>Blood Pressure</th>
            <th>Heart Rate</th>
            <th className="px-1">Respiratory Rate</th>
            <th className="px-1">Saturation</th>
            <th>Temperature</th>
          </tr>
        </thead>
        <tbody ref={parent}>
          {/* ------ sub-headers ------ */}
          <tr className="text-left">
            <td className="text-xs underline text-center">ALERTS</td>
            <td className="p-2">
              <input
                className="placeholder:italic placeholder:text-slate-400 w-2/3 rounded-md placeholder:text-sm p-2 focus:outline-none focus:border-sky-500 border boder-slate-300"
                placeholder="Search"
                type="text"
                name="search"
                value={searchPatient}
                onChange={handlePatientSearch}
              />
            </td>
            <td>
              <input
                className="placeholder:italic placeholder:text-slate-400 w-2/3 rounded-md placeholder:text-sm p-2 focus:outline-none focus:border-sky-500 border boder-slate-300"
                placeholder="Search"
                type="text"
                name="search"
                value={searchCondition}
                onChange={handleConditionSearch}
              />
            </td>
            <td className="px-1">
              <SelectFilter
                name="acuitySelect"
                inTable={true}
                options={["all", "l1", "l2", "l3"]}
                changeSelectedOption={setSelectedAcuity}
                customStyle="w-full mt-0"
              />
            </td>
            <td>
              <SelectFilter
                name="fallRiskSelect"
                inTable={true}
                options={["all", "low", "medium", "high"]}
                changeSelectedOption={setSelectedFallRisk}
                customStyle="mt-0"
              />
            </td>
            <TableSubHeader subheaderText="Bed No." />
            <TableSubHeader subheaderText="Ward No." />
            <TableSubHeader subheaderText="Right Upper" />
            <TableSubHeader subheaderText="Right Lower" />
            <TableSubHeader subheaderText="Left Upper" />
            <TableSubHeader subheaderText="Left Lower" />
            <TableSubHeader subheaderText="" />
            <TableSubHeader subheaderText="" />
            <TableSubHeader subheaderText="Result" />
            <TableSubHeader subheaderText="Reading" />
            <TableSubHeader subheaderText="Reading" />
            <TableSubHeader subheaderText="Reading" />
            <TableSubHeader subheaderText="Reading" />
          </tr>

          {/* ------ data rows ------*/}
          {data
            .filter((bed) =>
              (bed.patient as Patient).name
                .toLowerCase()
                .includes(searchPatient)
            )
            .filter((bed) =>
              (bed.patient as Patient).condition
                .toLowerCase()
                .includes(searchCondition)
            )
            .filter((bed) => {
              return selectedFallRisk === ""
                ? true
                : (bed.patient as Patient).fallRisk
                    ?.toLowerCase()
                    .includes(selectedFallRisk);
            })
            .filter((bed) => {
              return selectedAcuity === ""
                ? true
                : (bed.patient as Patient).acuityLevel
                    ?.toLowerCase()
                    .includes(selectedAcuity);
            })
            .map((pd, index) => (
              <tr className="text-left" key={pd._id}>
                <td className="w-1/12 text-center">
                  <div className="flex items-center justify-center">
                    <Link
                      href={`/patientVisualisation?patientId=${
                        (pd.patient as Patient)?._id
                      }&bedId=${pd._id}&viewAlerts=true`}
                      as={`/patientVisualisation?patientId=${
                        (pd.patient as Patient)?._id
                      }&bedId=${pd._id}`}
                    >
                      <DashboardAlertIcon
                        patientId={(pd.patient as Patient)?._id}
                        socketData={
                          socketPatient?._id === (pd.patient as Patient)?._id
                            ? socketAlertList
                            : null
                        }
                      />
                    </Link>
                  </div>
                </td>
                <td
                  id="patientName"
                  className="text-sm p-2 w-1/8 border-solid border-0 border-l border-slate-400 hover:cursor-pointer hover:bg-blue-100 hover:rounded-lg"
                  onClick={() =>
                    viewPatientVisualisation(
                      (pd.patient as Patient)?._id,
                      pd._id
                    )
                  }
                >
                  {(pd.patient as Patient)?.name}
                </td>
                <TableDataRow
                  id="patientCondition"
                  width="1/8"
                  data={(pd.patient as Patient)?.condition}
                />
                <TableDataRow
                  id="acuity"
                  width="1/12"
                  data={(pd.patient as Patient)?.acuityLevel}
                />
                <TableDataRow
                  id="fall-risk"
                  width="1/12"
                  data={(pd.patient as Patient)?.fallRisk}
                />
                <TableDataRow id="bedNum" width="1/12" data={pd.bedNum} />
                <TableDataRow
                  id="wardNum"
                  width="1/12"
                  data={(pd.ward as Ward)?.wardNum}
                />
                <TableDataRow
                  id="right-upper-rail"
                  width="1/12"
                  data={pd.isRightUpperRail ? "Up" : "Down"}
                />
                <TableDataRow
                  id="right-lower-rail"
                  width="1/12"
                  data={pd.isRightLowerRail ? "Up" : "Down"}
                />
                <TableDataRow
                  id="left-upper-rail"
                  width="1/12"
                  data={pd.isLeftUpperRail ? "Up" : "Down"}
                />
                <TableDataRow
                  id="left-lower-rail"
                  width="1/12"
                  data={pd.isLeftLowerRail ? "Up" : "Down"}
                />
                <TableDataRow
                  id="bed-brakes"
                  width="1/12"
                  data={pd.isBrakeSet ? "Set" : "Not Set"}
                />
                <TableDataRow
                  id="lowest-position"
                  width="1/12"
                  data={pd.isLowestPosition ? "Yes" : "No"}
                />
                <TableDataRow
                  id="bp-reading"
                  width="1/12"
                  data={[
                    vitals[index]?.bloodPressureSys[
                      vitals[index]?.bloodPressureSys.length - 1
                    ]?.reading,
                    vitals[index]?.bloodPressureDia[
                      vitals[index]?.bloodPressureDia.length - 1
                    ]?.reading,
                  ]}
                />

                <TableDataRow
                  id="hr-reading"
                  width="1/12"
                  data={Math.round(
                    vitals[index]?.heartRate[
                      vitals[index]?.heartRate.length - 1
                    ]?.reading
                  )}
                />
                <TableDataRow
                  id="resp-reading"
                  width="1/5"
                  data={
                    vitals[index]?.respRate[vitals[index]?.respRate.length - 1]
                      ?.reading
                  }
                />

                <TableDataRow
                  id="spo2-reading"
                  data={
                    vitals[index]?.spO2[vitals[index]?.spO2.length - 1]?.reading
                  }
                />

                <TableDataRow
                  id="temp-reading"
                  data={
                    vitals[index]?.temperature[
                      vitals[index]?.temperature.length - 1
                    ]?.reading
                  }
                />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
