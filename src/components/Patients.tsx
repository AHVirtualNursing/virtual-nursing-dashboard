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
import { io } from "socket.io-client";
import { Patient } from "@/types/patient";
import { SocketContext } from "@/pages/layout";

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
  const [vitals, setVitals] = useState<any[]>([]);
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
    for (const bedData of data) {
      let patientVitals = bedData.patient?.vital;
      if (patientVitals) {
        const res = await fetchVitalByVitalId(patientVitals);
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
    const handleAlertIncoming = (data: any) => {
      setSocketAlertList(data.alertList);
      setSocketPatient(data.patient);
    };
    const handleDeleteAlert = (data: any) => {
      setSocketAlertList(data.alertList);
      setSocketPatient(data.patient);
    };
    socket.on("patientAlertAdded", handleAlertIncoming);
    socket.on("patientAlertDeleted", handleDeleteAlert);
    return () => {
      socket.off("patientAlertAdded", handleAlertIncoming);
      socket.off("patientAlertDeleted", handleDeleteAlert);
    };
  }, [socket]);

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

  // fetching vitals immediately after beds are populated
  useEffect(() => {
    console.log("first");
    if (data.length > 0) {
      fetchPatientVitals();
    }
  }, [data]);

  useEffect(() => {
    console.log("fetch vitals interval use effect");
    if (data.length > 0) {
      const interval = setInterval(() => {
        fetchPatientVitals();
      }, 60000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [vitals, data]);

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
            <TableSubHeader subheaderText="" />
            <TableSubHeader subheaderText="" />
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
              bed.patient?.name.toLowerCase().includes(searchPatient)
            )
            .filter((bed) =>
              bed.patient?.condition.toLowerCase().includes(searchCondition)
            )
            .map((pd, index) => (
              <tr className="text-left" key={pd._id}>
                <td className="w-1/12 text-center">
                  <Link
                    href={`/patientVisualisation?patientId=${pd.patient?._id}&bedId=${pd._id}&viewAlerts=true`}
                    as={`/patientVisualisation?patientId=${pd.patient?._id}&bedId=${pd._id}`}
                  >
                    <DashboardAlertIcon
                      patientId={pd.patient?._id}
                      socketData={
                        socketPatient?._id === pd.patient?._id
                          ? socketAlertList
                          : null
                      }
                    />
                  </Link>
                </td>
                <td
                  id="patientName"
                  className="text-sm p-2 w-1/8 border-solid border-0 border-l border-slate-400 hover:cursor-pointer hover:bg-blue-100 hover:rounded-lg"
                  onClick={() =>
                    viewPatientVisualisation(pd.patient?._id, pd._id)
                  }
                >
                  {pd.patient?.name}
                </td>
                <TableDataRow
                  id="patientCondition"
                  width="1/8"
                  data={pd.patient?.condition}
                />
                <TableDataRow
                  id="acuity"
                  width="1/12"
                  data={pd.patient?.acuityLevel}
                />
                <TableDataRow
                  id="fall-risk"
                  width="1/12"
                  data={pd.patient?.fallRisk}
                />
                <TableDataRow id="bedNum" width="1/12" data={pd.bedNum} />
                <TableDataRow
                  id="wardNum"
                  width="1/12"
                  data={pd.ward.wardNum}
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
