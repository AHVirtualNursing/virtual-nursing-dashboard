import React, {useEffect, useState} from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import {patientData} from "@/mockData";
import {fetchVitalByVitalId} from "@/pages/api/vitals_api";
import {fetchAllSmartBeds} from "@/pages/api/smartbed_api";
import {SmartBed} from "@/models/smartBed";
import {useRouter} from "next/navigation";
import TableSubHeader from "./TableSubHeader";

export default function Patients() {
  const router = useRouter();
  const [data, setData] = useState<SmartBed[]>([]);
  const [searchPatient, setSearchPatient] = useState<string>("");
  const [searchCondition, setSearchCondition] = useState<string>("");
  const [vitals, setVitals] = useState<any[]>([]);

  const handlePatientSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPatient(event.target.value);
  };

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
      }
    }
    setVitals(patientVitalsArr);
  };

  useEffect(() => {
    fetchAllSmartBeds().then((res) => {
      setData(
        res.data.filter(
          (smartbed: SmartBed) => smartbed.ward && smartbed.patient
        )
      );
    });
    const interval = setInterval(() => {
      fetchPatientVitals();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [vitals]);
  return (
    <>
      <table className="table-auto w-full border-collapse">
        <thead className="text-sm text-left">
        {/* ------ column headers ------ */}
        <tr>
          <th></th>
          <th className="p-2">Patient</th>
          <th>Condition</th>
          <th>Bed</th>
          <th>Ward</th>
          <th colSpan={2}>Blood Pressure</th>
          <th colSpan={2}>Heart Rate</th>
          <th colSpan={2}>Saturation</th>
        </tr>
        </thead>
        <tbody>
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
          <TableSubHeader subheaderText="Bed No."/>
          <TableSubHeader subheaderText="Ward No."/>
          <TableSubHeader subheaderText="Result"/>
          <TableSubHeader subheaderText="Updated"/>
          <TableSubHeader subheaderText="Reading"/>
          <TableSubHeader subheaderText="Updated"/>
          <TableSubHeader subheaderText="Reading"/>
          <TableSubHeader subheaderText="Updated"/>
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
                <CampaignIcon style={{color: "red"}}/>
              </td>
              <td
                id="patientName"
                className="text-sm p-2 w-1/8 border-solid border-0 border-l border-slate-400 hover:cursor-pointer"
                onClick={() =>
                  viewPatientVisualisation(pd.patient?._id, pd._id)
                }
              >
                {pd.patient?.name}
              </td>
              <td id="patientCondition" className="text-sm p-2 w-1/8 border-solid border-0 border-l border-slate-400">
                {pd.patient?.condition}
              </td>
              <td id="bedNum" className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400">
                {pd.bedNum}
              </td>
              <td id="wardNum" className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400">
                {pd.ward.wardNum}
              </td>
              <td id="bpReading" className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400">
                {
                  vitals[index]?.bloodPressureSys[
                  vitals[index]?.bloodPressureSys.length - 1
                    ]?.reading
                }
                /
                {
                  vitals[index]?.bloodPressureDia[
                  vitals[index]?.bloodPressureDia.length - 1
                    ]?.reading
                }
              </td>
              <td id="bpDateTime" className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400">
                {
                  vitals[index]?.bloodPressureDia[
                  vitals[index]?.bloodPressureDia.length - 1
                    ]?.datetime.split(" ")[1]
                }
              </td>
              <td id="hrReading"
                  className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400">
                {Math.round(
                  vitals[index]?.heartRate[
                  vitals[index]?.heartRate.length - 1
                    ]?.reading
                )}
              </td>
              <td id="hrDateTime" className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400">
                {
                  vitals[index]?.heartRate[
                  vitals[index]?.heartRate.length - 1
                    ]?.datetime.split(" ")[1]
                }
              </td>
              <td id="spo2" className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400">
                {vitals[index]?.spO2[vitals[index]?.spO2.length - 1]?.reading}
              </td>
              <td id="spo2Datetime" className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400">
                {vitals[index]?.spO2[
                vitals[index]?.spO2.length - 1
                  ]?.datetime.substring(11, 23)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
