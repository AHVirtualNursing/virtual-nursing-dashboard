import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SmartBed } from "@/models/smartBed";
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
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import { VirtualNurse } from "@/models/virtualNurse";
import { Tooltip } from "@mui/material";

export default function Wards() {
  const router = useRouter();
  const [data, setData] = useState<SmartBed[]>([]);
  const [vitals, setVitals] = useState<any[]>([]);
  const [nurse, setNurse] = useState<VirtualNurse>();
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
    fetchVirtualNurseByNurseId(sessionData?.user.id).then((res) => {
      setNurse(res.data);
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
      <div className="gap-x-3 flex justify-between items-center">
        <label
          htmlFor="ward-select"
          className="text-sm font-medium text-gray-900"
        >
          Card View
        </label>
        <TileCustomisationModal cardLayout={nurse?.cardLayout} />
      </div>
      <div className="grid grid-cols-2 gap-4 flex" ref={parent}>
        {data.map((pd, index) => (
          <div
            className="bg-white rounded-2xl p-4 shadow-lg hover:cursor-pointer hover:bg-blue-100"
            onClick={() => viewPatientVisualisation(pd.patient?._id, pd._id)}
          >
            <div className="flex items-start justify-start">
              <div className="w-1/2 flex items-start justify-start">
                <img width={40} src={profilePic.src} />
                <div className="text-left px-4">
                  <h3>{pd.patient?.name}</h3>
                  <p>
                    Ward: {pd.ward.wardNum} Bed: {pd.bedNum}
                  </p>
                </div>
              </div>
              <div className="w-1/2 flex items-start justify-around">
                {nurse?.cardLayout.fallRisk ? (
                  <div>
                    <p>Fall Risk</p>
                    <div className="flex items-center justify-center">
                      <p>High</p>
                      <Tooltip
                        title={<p style={{ fontSize: "16px" }}>REASON</p>}
                        placement="top"
                      >
                        <NotificationImportantIcon className="fill-red-500" />
                      </Tooltip>
                    </div>
                  </div>
                ) : null}
                {nurse?.cardLayout.news2 ? (
                  <div>
                    <p>NEWS2</p>
                    <p>2</p>
                  </div>
                ) : null}
              </div>
            </div>
            <BedTiles cardLayout={nurse?.cardLayout} />
            <VitalTiles cardLayout={nurse?.cardLayout} data={vitals[index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
