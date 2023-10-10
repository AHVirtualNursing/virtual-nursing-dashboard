import React, { useEffect, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import { patientData } from "@/mockData";
import { fetchAllPatients } from "@/pages/api/patients_api";
import { fetchVitalByVitalId } from "@/pages/api/vitals_api";
import { fetchAllSmartBeds } from "@/pages/api/smartbed_api";
import { SmartBed } from "@/models/smartBed";
import { useRouter } from "next/navigation";

export default function Patients() {
  const router = useRouter();
  const [number, setNumber] = useState(0);
  const [data, setData] = useState<SmartBed[]>([]);
  const [searchPatient, setSearchPatient] = useState<string>("");
  const [searchCondition, setSearchCondition] = useState<string>("");
  const [vitals, setVitals] = useState<any[]>([]);

  const handlePatientSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPatient(event.target.value);
    const filteredList = data.filter((bed) =>
      bed.patient?.name.toLowerCase().includes(event.target.value)
    );
    setData(filteredList);
  };

  const handleConditionSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchCondition(event.target.value);
    const filteredList = data.filter((bed) =>
      bed.patient?.condition.toLowerCase().includes(event.target.value)
    );
    setData(filteredList);
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
      console.log(patientVitals);
      const res = await fetchVitalByVitalId(patientVitals);
      console.log(res);
      patientVitalsArr.push(res);
    }
    setVitals(patientVitalsArr);
  };

  useEffect(() => {
    fetchAllSmartBeds().then((res) => {
      setData(res.data);
    });

    fetchPatientVitals();
    console.log(vitals);
  }, [data.length]);

  /* The code chunk below is for testing purposes where we mock values that change every 5 seconds. This is done by generating a random integer in 5 second intervals, then re-rendering the component with useEffect

  useEffect(() => {
    function getRandomInteger(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const interval = setInterval(() => {
      const num = getRandomInteger(0, 100);
      setNumber(num);
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [number]);

  */

  return (
    <>
      <table className="table-auto w-full border-collapse">
        <thead className="text-sm bg-sky-200">
          {/* ------ column headers ------ */}
          <tr>
            <th>Alerts</th>
            <th className="p-2">Patient</th>
            <th>Condition</th>
            <th>Bed</th>
            <th>Ward</th>
            <th colSpan={2}>Blood Pressure</th>
            <th colSpan={2}>HR</th>
            <th className="pr-2">Saturation</th>
          </tr>
        </thead>
        <tbody>
          {/* ------ sub-headers ------ */}
          <tr>
            <td></td>
            <td className="p-2">
              <input
                className="placeholder:italic placeholder:text-slate-400 w-2/3 rounded-md placeholder:text-sm px-2 focus:outline-none focus:border-sky-500 border boder-slate-300"
                placeholder="Search"
                type="text"
                name="search"
                value={searchPatient}
                onChange={handlePatientSearch}
              />
            </td>
            <td>
              <input
                className="placeholder:italic placeholder:text-slate-400 w-2/3 rounded-md placeholder:text-sm px-2 focus:outline-none focus:border-sky-500 border boder-slate-300"
                placeholder="Search"
                type="text"
                name="search"
                value={searchCondition}
                onChange={handleConditionSearch}
              />
            </td>
            <td className="text-xs">Bed No.</td>
            <td className="text-xs">Ward Number</td>
            <td className="text-xs">Result</td>
            <td className="text-xs">Updated</td>
            <td className="text-xs">Reading</td>
            <td className="text-xs">Updated</td>
          </tr>

          {/* ------ data rows ------ */}
          {data.map((pd, index) => (
            <tr
              className="border-b border-black"
              key={pd._id}
              onClick={() => viewPatientVisualisation(pd.patient?._id, pd._id)}
            >
              <td className="w-1/16">
                <CampaignIcon style={{ color: "red" }} />
              </td>
              <td id="patientName" className="text-sm py-2 w-1/6">
                {pd.patient?.name}
              </td>
              <td id="patientCondition" className="text-sm py-2 w-1/6">
                {pd.patient?.condition}
              </td>
              <td id="bedNum" className="text-sm py-2 w-1/12">
                {pd.name}
              </td>
              <td id="wardNum" className="text-sm py-2 w-1/12">
                {pd.ward.wardNum}
              </td>
              <td id="bpReading" className="text-sm py-2 w-1/12">
                {vitals[index]?.bloodPressureDia[index]?.reading}/
                {vitals[index]?.bloodPressureSys[index]?.reading}
              </td>
              <td id="bpDateTime" className="text-sm py-2 w-1/12">
                {vitals[index]?.bloodPressureDia[index]?.datetime.split(" ")[1]}
              </td>
              <td id="hrReading" className="text-sm py-2 w-1/12">
                {Math.round(
                  vitals[index]?.heartRate[vitals[index]?.heartRate.length - 1]
                    .reading
                )}
              </td>
              <td id="hrDateTime" className="text-sm py-2 w-1/12">
                {
                  vitals[index]?.heartRate[
                    vitals[index]?.heartRate.length - 1
                  ].datetime.split(" ")[1]
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
