import React, { useEffect, useRef, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import { patientData } from "@/mockData";
import { fetchVitalByVitalId } from "@/pages/api/vitals_api";
import { fetchAllSmartBeds, fetchBedByBedId } from "@/pages/api/smartbed_api";
import { SmartBed } from "@/models/smartBed";
import { useRouter } from "next/navigation";
import TableSubHeader from "./TableSubHeader";
import autoAnimate from "@formkit/auto-animate";
import { useSession } from "next-auth/react";
import { fetchWardsByVirtualNurse } from "@/pages/api/nurse_api";
import TableDataRow from "./TableDataRow";

export default function Patients() {
  const router = useRouter();
  const [data, setData] = useState<SmartBed[]>([]);
  const [searchPatient, setSearchPatient] = useState<string>("");
  const [searchCondition, setSearchCondition] = useState<string>("");
  const [vitals, setVitals] = useState<any[]>([]);
  const { data: sessionData } = useSession();

  const handlePatientSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPatient(event.target.value);
  };
  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const handleConditionSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchCondition(event.target.value);
  };

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
    setData(sortedBeds);
    setVitals(sortedVitals);
  };

  useEffect(() => {
    // fetchAllSmartBeds().then((res) => {
    //   setData(
    //     res.data.filter(
    //       (smartbed: SmartBed) => smartbed.ward && smartbed.patient
    //     )
    //   );
    // });
    fetchWardsByVirtualNurse(sessionData?.user.id).then((wards) => {
      let promises: Promise<SmartBed>[] = [];
      let smartBedIds = [];
      for (const ward of wards) {
        const bedArray = ward.smartBeds;
        smartBedIds.push(...bedArray);
      }
      smartBedIds.map((id) => promises.push(fetchBedByBedId(id)));
      Promise.all(promises).then((res) => {
        console.log("Smart Beds assigned to VN", res);
        setData(res.filter((sb) => sb.ward && sb.patient));
      });
    });
  }, []);

  // fetching vitals immediately after beds are populated
  useEffect(() => {
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
    <div className="h-full overflow-auto scrollbar">
      <table className="table-auto w-full border-collapse">
        <thead className="text-sm text-left">
          {/* ------ column headers ------ */}
          <tr>
            <th></th>
            <th className="p-2">Patient</th>
            <th>Condition</th>
            <th>Bed</th>
            <th>Ward</th>
            <th>Blood Pressure</th>
            <th>Heart Rate</th>
            <th>Saturation</th>
          </tr>
        </thead>
        <tbody ref={parent}>
          {/* ------ sub-headers ------ */}
          <tr className="text-left">
            <td></td>
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
            <TableSubHeader subheaderText="Bed No." />
            <TableSubHeader subheaderText="Ward No." />
            <TableSubHeader subheaderText="Result" />
            <TableSubHeader subheaderText="Reading" />
            <TableSubHeader subheaderText="Reading" />
          </tr>

          {/* ------ data rows ------*/}
          {data
            .filter((bed) =>
              bed.patient?.name
                .toLowerCase()
                .includes(searchPatient || searchCondition)
            )
            .map((pd, index) => (
              <tr className="text-left" key={pd._id}>
                <td className="w-1/12 text-center">
                  <CampaignIcon style={{ color: "red" }} />
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
                <TableDataRow id="bedNum" width="1/12" data={pd.bedNum} />
                <TableDataRow
                  id="wardNum"
                  width="1/12"
                  data={pd.ward.wardNum}
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
                  id="spo2-reading"
                  width="1/12"
                  data={
                    vitals[index]?.spO2[vitals[index]?.spO2.length - 1]?.reading
                  }
                />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
