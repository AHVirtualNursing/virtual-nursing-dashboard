import React, { useEffect, useRef, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import { patientData } from "@/mockData";
import { fetchVitalByVitalId } from "@/pages/api/vitals_api";
import { fetchAllSmartBeds } from "@/pages/api/smartbed_api";
import { SmartBed } from "@/models/smartBed";
import { useRouter } from "next/navigation";
import TableSubHeader from "./TableSubHeader";
import autoAnimate from "@formkit/auto-animate";

export default function Patients() {
  const router = useRouter();
  const [data, setData] = useState<SmartBed[]>([]);
  const [searchPatient, setSearchPatient] = useState<string>("");
  const [searchCondition, setSearchCondition] = useState<string>("");
  const [vitals, setVitals] = useState<any[]>([]);
  // const [loadingState, setLoadingState] = useState(true);

  const handlePatientSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPatient(event.target.value);
    // const filteredList = data.filter((bed) =>
    //   bed.patient?.name.toLowerCase().includes(event.target.value)
    // );
    // console.log(filteredList);
    // setData(filteredList);
  };
  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

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
      console.log(bedData);
      let patientVitals = bedData.patient?.vital;
      console.log(patientVitals);
      if (patientVitals) {
        const res = await fetchVitalByVitalId(patientVitals);
        patientVitalsArr.push(res);
        console.log(patientVitalsArr);
      } else {
        patientVitalsArr.push(undefined);
      }
    }
    const combined = data.map((bedData, index) => ({
      bed: bedData,
      vital: patientVitalsArr[index],
    }));
    console.log(combined);
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
          console.log(vital1);
          console.log(vital1.vital);
          console.log(vital1.vital.heartRate);
          console.log(vital1.vital.heartRate[1].reading);
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
    console.log(combined);
    const sortedBeds = combined.map((x) => x.bed);
    const sortedVitals = combined.map((x) => x.vital);
    console.log(sortedBeds);
    console.log(sortedVitals);
    setData(sortedBeds);
    setVitals(sortedVitals);
  };

  /* this useEffect calls the above method fetchPatientVitals() at 10 second intervals, and re-renders the vitals dynamically in the frontend */
  useEffect(() => {
    console.log("fetch beds use effect");
    fetchAllSmartBeds().then((res) => {
      console.log(res.data);
      setData(
        res.data.filter(
          (smartbed: SmartBed) => smartbed.ward && smartbed.patient
        )
      );
    });
  }, []);

  useEffect(() => {
    console.log("fetch vitals interval use effect");
    if (data.length > 0) {
      const interval = setInterval(() => {
        fetchPatientVitals();
      }, 10000);
      return () => {
        clearInterval(interval);
      };
    }
    // setLoadingState(false);
  }, [vitals, data]);

  return (
    <>
      {/* {loadingState ? (
        <p>Loading...</p>
      ) : ( */}
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
              <tr className="text-left" key={pd._id}>
                <td className="w-1/12 text-center">
                  <CampaignIcon style={{ color: "red" }} />
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
                <td
                  id="patientCondition"
                  className="text-sm p-2 w-1/8 border-solid border-0 border-l border-slate-400"
                >
                  {pd.patient?.condition}
                </td>
                <td
                  id="bedNum"
                  className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400"
                >
                  {pd.bedNum}
                </td>
                <td
                  id="wardNum"
                  className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400"
                >
                  {pd.ward.wardNum}
                </td>
                <td
                  id="bpReading"
                  className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400"
                >
                  {vitals[index] === undefined
                    ? "-"
                    : vitals[index].bloodPressureSys === undefined ||
                      vitals[index].bloodPressureSys.length == 0
                    ? "-"
                    : vitals[index]?.bloodPressureSys[
                        vitals[index]?.bloodPressureSys.length - 1
                      ]?.reading}
                  /
                  {vitals[index] === undefined
                    ? "-"
                    : vitals[index].bloodPressureDia === undefined ||
                      vitals[index].bloodPressureDia.length == 0
                    ? "-"
                    : vitals[index]?.bloodPressureDia[
                        vitals[index]?.bloodPressureDia.length - 1
                      ]?.reading}
                </td>
                <td
                  id="bpDateTime"
                  className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400"
                >
                  {vitals[index] === undefined
                    ? "-"
                    : vitals[index].bloodPressureDia === undefined ||
                      vitals[index].bloodPressureDia.length == 0
                    ? "-"
                    : vitals[index]?.bloodPressureDia[
                        vitals[index]?.bloodPressureDia.length - 1
                      ]?.datetime.split(" ")[1]}
                </td>
                <td
                  id="hrReading"
                  className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400"
                >
                  {vitals[index] === undefined
                    ? "-"
                    : vitals[index].heartRate === undefined ||
                      vitals[index].heartRate.length == 0
                    ? "-"
                    : Math.round(
                        vitals[index]?.heartRate[
                          vitals[index]?.heartRate.length - 1
                        ]?.reading
                      )}
                </td>
                <td
                  id="hrDateTime"
                  className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400"
                >
                  {vitals[index] === undefined
                    ? "-"
                    : vitals[index].heartRate === undefined ||
                      vitals[index].heartRate.length == 0
                    ? "-"
                    : vitals[index]?.heartRate[
                        vitals[index]?.heartRate.length - 1
                      ]?.datetime.split(" ")[1]}
                </td>
                <td
                  id="spo2"
                  className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400"
                >
                  {vitals[index] === undefined
                    ? "-"
                    : vitals[index].spO2 === undefined ||
                      vitals[index].spO2.length == 0
                    ? "-"
                    : vitals[index]?.spO2[vitals[index]?.spO2.length - 1]
                        ?.reading}
                </td>
                <td
                  id="spo2Datetime"
                  className="text-sm p-2 w-1/12 border-solid border-0 border-l border-slate-400"
                >
                  {vitals[index] === undefined
                    ? "-"
                    : vitals[index].spO2 === undefined ||
                      vitals[index].spO2.length == 0
                    ? "-"
                    : vitals[index]?.spO2[
                        vitals[index]?.spO2.length - 1
                      ]?.datetime.split(" ")[1]}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* )} */}
    </>
  );
}
