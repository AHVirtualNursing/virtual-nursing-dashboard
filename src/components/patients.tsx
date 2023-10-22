import React, { useEffect, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import { patientData } from "@/mockData";
import { fetchVitalByVitalId } from "@/pages/api/vitals_api";
import { fetchAllSmartBeds } from "@/pages/api/smartbed_api";
import { SmartBed } from "@/models/smartBed";
import { useRouter } from "next/navigation";
import TableSubHeader from "./TableSubHeader";

export default function Patients() {
  const router = useRouter();
  const [data, setData] = useState<SmartBed[]>([]);
  const [searchPatient, setSearchPatient] = useState<string>("");
  const [searchCondition, setSearchCondition] = useState<string>("");
  const [vitals, setVitals] = useState<any[]>([]);

  const handlePatientSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPatient(event.target.value);
    // const filteredList = data.filter((bed) =>
    //   bed.patient?.name.toLowerCase().includes(event.target.value)
    // );
    // console.log(filteredList);
    // setData(filteredList);
  };

  const handleConditionSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchCondition(event.target.value);
    // const filteredList = data.filter((bed) =>
    //   bed.patient?.condition.toLowerCase().includes(event.target.value)
    // );
    // setData(filteredList);
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

  /* this function iterates all patients, extracts the vital id of each patient, and fetches the vital object by vital id.
   Vital object is then pushed into a vitals array and set in the state (vitals variable in component state)
   This function is invoked every 10 seconds. */

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

  /* this useEffect calls the above method fetchPatientVitals() at 10 second intervals, and re-renders the vitals dynamically in the frontend */
  useEffect(() => {
    fetchAllSmartBeds().then((res) => {
      console.log(res.data);
      setData(
        res.data.filter(
          (smartbed: SmartBed) => smartbed.ward && smartbed.patient
        )
      );
    });
    const interval = setInterval(() => {
      fetchPatientVitals();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [vitals]);

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
            <th colSpan={2}>HR</th>
            <th colSpan={2}>Saturation</th>
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
            <TableSubHeader subheaderText="Bed No." />
            <TableSubHeader subheaderText="Ward No." />
            <TableSubHeader subheaderText="Result" />
            <TableSubHeader subheaderText="Updated" />
            <TableSubHeader subheaderText="Reading" />
            <TableSubHeader subheaderText="Updated" />
            <TableSubHeader subheaderText="Reading" />
            <TableSubHeader subheaderText="Updated" />
          </tr>

          {/* ------ data rows ------ 
            The vitals are displayed based on the latest vitals data/numbers updated into the db. For blood pressure (both DIA and SYS) and Heart Rate, the number displayed is the latest value (value at the last index) of the bloodPressureDia, bloodPressureSys and heartRate arrays.
            
            For eg, to display the heart rate reading, 

            {Math.round(vitals[index]?.heartRate[vitals[index]?.heartRate. length - 1].reading)}

            This code extracts the vitals object matching the patient index, to ensure the correct vitals object of the patient. Then the last element of the heartRate array (latest value) is extracted and rounded to nearest whole number to display the heart rate value (This changes every 10 seconds since we update the latest value of the heartRate array)
          */}
          {data
            .filter((bed) =>
              bed.patient?.name
                .toLowerCase()
                .includes(searchPatient || searchCondition)
            )
            .map((pd, index) => (
              <tr className="border-b border-black" key={pd._id}>
                <td className="w-1/16">
                  <CampaignIcon style={{ color: "red" }} />
                </td>
                <td
                  id="patientName"
                  className="text-sm py-2 w-1/6"
                  onClick={() =>
                    viewPatientVisualisation(pd.patient?._id, pd._id)
                  }
                >
                  {pd.patient?.name}
                </td>
                <td id="patientCondition" className="text-sm py-2 w-1/6">
                  {pd.patient?.condition}
                </td>
                <td id="bedNum" className="text-sm py-2 w-1/12">
                  {pd.bedNum}
                </td>
                <td id="wardNum" className="text-sm py-2 w-1/12">
                  {pd.ward.wardNum}
                </td>
                <td id="bpReading" className="text-sm py-2 w-1/12">
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
                <td id="bpDateTime" className="text-sm py-2 w-1/12">
                  {
                    vitals[index]?.bloodPressureDia[
                      vitals[index]?.bloodPressureDia.length - 1
                    ]?.datetime.split(" ")[1]
                  }
                </td>
                <td id="hrReading" className="text-sm py-2 w-1/12">
                  {Math.round(
                    vitals[index]?.heartRate[
                      vitals[index]?.heartRate.length - 1
                    ]?.reading
                  )}
                </td>
                <td id="hrDateTime" className="text-sm py-2 w-1/12">
                  {
                    vitals[index]?.heartRate[
                      vitals[index]?.heartRate.length - 1
                    ]?.datetime.split(" ")[1]
                  }
                </td>
                <td id="spo2" className="text-sm py-2 w-1/12">
                  {vitals[index]?.spO2[vitals[index]?.spO2.length - 1]?.reading}
                </td>
                <td id="spo2Datetime" className="text-sm py-2 w-1/12">
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
