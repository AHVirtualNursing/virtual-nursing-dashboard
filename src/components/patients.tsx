import React, { useEffect, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import { patientData } from "@/mockData";
import { fetchAllPatients } from "@/pages/api/patients_api";
import { fetchVitalByVitalId } from "@/pages/api/vitals_api";
import { fetchAllSmartBeds } from "@/pages/api/smartbed_api";

export default function Patients() {
  const [number, setNumber] = useState(0);
  const [data, setData] = useState(patientData);
  const [searchPatient, setSearchPatient] = useState<string>("");
  const [searchCondition, setSearchCondition] = useState<string>("");

  const handlePatientSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPatient(event.target.value);
    const filteredList = patientData.filter((patient) =>
      patient.name.toLowerCase().includes(event.target.value)
    );
    setData(filteredList);
  };

  const handleConditionSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchCondition(event.target.value);
    const filteredList = patientData.filter((patient) =>
      patient.condition.toLowerCase().includes(event.target.value)
    );
    setData(filteredList);
  };

  useEffect(() => {
    fetchAllSmartBeds().then((res) => {
      setData(res.data);
    });
  }, []);

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
      {console.log(data)}
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
            <th colSpan={2}>Glucose</th>
            <th>HR</th>
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
            <td></td>
            <td></td>
            <td className="text-sm">Result</td>
            <td className="text-sm">Adh</td>
            <td className="text-sm">Level</td>
            <td className="text-sm">Updated:</td>
            <td className="text-sm">HR</td>
          </tr>

          {/* ------ data rows ------ */}
          {data.map((pd) => (
            <tr className="border-b border-black" key={pd._id}>
              <td className="w-1/16">
                <CampaignIcon style={{ color: "red" }} />
              </td>
              <td className="text-sm py-2 w-1/6">{pd.patient.name}</td>
              <td className="text-sm py-2 w-1/6">{pd.patient.condition}</td>
              <td className="text-sm py-2 w-1/12">{pd.name}</td>
              <td className="text-sm py-2 w-1/12">{pd.ward.wardNum}</td>
              {/* <td className="text-sm py-2 w-1/12">{pd.bp}</td>
              <td className="text-sm py-2 w-1/12">{pd.adh}</td>
              <td className="text-sm py-2 w-1/12">{pd.glucose}</td>
              <td className="text-sm py-2 w-1/12">1 day ago</td>
              <td className="text-sm py-2 w-1/12">{pd.hr}</td>
              <td className="text-sm py-2 w-1/12">{number}</td>  */}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
