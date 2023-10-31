import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SmartBed } from "@/models/smartBed";
import { fetchVitalByVitalId } from "./api/vitals_api";
import { fetchWardsByVirtualNurse } from "./api/nurse_api";
import { fetchBedByBedId } from "./api/smartbed_api";
import autoAnimate from "@formkit/auto-animate";
import profilePic from "../../public/profilepic.jpg";
import VitalTiles from "@/components/VitalTiles";

export default function Wards() {
  const router = useRouter();
  const [data, setData] = useState<SmartBed[]>([]);
  const [vitals, setVitals] = useState<any[]>([]);
  const { data: sessionData } = useSession();

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
      <div className="gap-x-3 flex justify-start items-center">
        <label
          htmlFor="ward-select"
          className="text-sm font-medium text-gray-900"
        >
          Card View
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4 flex" ref={parent}>
        {data.map((pd, index) => (
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            {/* <div className="flex items-center">
              <img width={40} src={profilePic.src} />
              <div className="text-left p-4">
                <h3>{pd.patient?.name}</h3>
                <p>
                  Ward: {pd.ward.wardNum} Bed: {pd.bedNum}
                </p>
              </div>
              <img
                src="https://healthjade.net/wp-content/uploads/2020/02/Low-Fowler%E2%80%99s-position.jpg"
                alt="Patient on bed raised 15-30 degrees"
                className="object-contain w-96 h-48"
              />
            </div>
            <div className="text-left">
              <p>Condition: {pd.patient?.condition}</p>
              <p>Acuity Level: {pd.patient?.acuityLevel}</p>
              <p>Fall Risk Score: {pd.patient?.fallRiskScore}</p>
            </div> */}
            <div className="flex items-start">
              <img width={40} src={profilePic.src} />
              <div className="text-left px-4">
                <h3>{pd.patient?.name}</h3>
                <p>
                  Ward: {pd.ward.wardNum} Bed: {pd.bedNum}
                </p>
              </div>
            </div>
            <img
              src="https://healthjade.net/wp-content/uploads/2020/02/Low-Fowler%E2%80%99s-position.jpg"
              alt="Patient on bed raised 15-30 degrees"
              className="object-contain w-96 h-48"
            />
            <div className="text-left">
              <p>Condition: {pd.patient?.condition}</p>
              <p>Acuity Level: {pd.patient?.acuityLevel}</p>
              <p>Fall Risk Score: {pd.patient?.fallRiskScore}</p>
            </div>
            <VitalTiles data={vitals[index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
