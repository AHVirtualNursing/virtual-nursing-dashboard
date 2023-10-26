import React, { useEffect, useRef, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Patient } from "@/models/patient";
import { updatePatientLayoutByPatientId } from "@/pages/api/patients_api";
import { Layouts } from "react-grid-layout";
import { Layout } from "react-grid-layout";
import { io } from "socket.io-client";
import { useRouter } from "next/router";
import { Vital } from "@/models/vital";
import { fetchVitalByVitalId } from "@/pages/api/vitals_api";
import LineChartComponent from "@/components/patientOverviewTab/LineChart";
import LastUpdatedVital from "./LastUpdatedVital";
import OverviewSelection from "./OverviewSelection";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface ComponentProp {
  patient: Patient | undefined;
}

export default function VisualisationComponent(prop: ComponentProp) {
  const [retrieveLayout, setLayouts] = useState(prop.patient?.layout);

  const onLayoutChange = (_: Layout[], allLayouts: Layouts) => {
    updatePatientLayoutByPatientId(prop?.patient?._id, allLayouts);
  };

  const placeholder_data = [
    { datetime: "t1", reading: 61 },
    { datetime: "t2", reading: 73 },
    { datetime: "t3", reading: 89 },
    { datetime: "t4", reading: 75 },
    { datetime: "t5", reading: 61 },
    { datetime: "t6", reading: 53 },
    { datetime: "t7", reading: 99 },
  ];

  const [rrData, setRRData] = useState(placeholder_data);
  const [hrData, setHRData] = useState(placeholder_data);
  const [bpSysData, setBpSysData] = useState(placeholder_data);
  const [bpDiaData, setBpDiaData] = useState(placeholder_data);
  const [tempData, setTempData] = useState(placeholder_data);
  const [spO2Data, setSpO2Data] = useState(placeholder_data);

  useEffect(() => {
    setLayouts(prop.patient?.layout);
  }, [prop.patient?.layout]);

  const [patientVitals, setPatientVitals] = useState<Vital>();

  useEffect(() => {
    fetchVitalByVitalId(prop?.patient?.vital).then((res) =>
      setPatientVitals(res)
    );
  }, [prop?.patient?.vital]);

  useEffect(() => {
    if (patientVitals) {
      if (patientVitals.spO2.length > 0) {
        setSpO2Data(patientVitals.spO2);
      }
      if (patientVitals.heartRate.length > 0) {
        setHRData(patientVitals.heartRate);
      }
      if (patientVitals.bloodPressureDia.length > 0) {
        setBpDiaData(patientVitals.bloodPressureDia);
      }
      if (patientVitals.bloodPressureSys.length > 0) {
        setBpSysData(patientVitals.bloodPressureSys);
      }
      if (patientVitals.temperature.length > 0) {
        setTempData(patientVitals.temperature);
      }
      if (patientVitals.respRate.length > 0) {
        setRRData(patientVitals.respRate);
      }
    }
  }, [patientVitals]);

  // ============================================================== SET INTERVAL
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setData((previousData) => {
  //       const newData = previousData?.slice(1);
  //       const currDate = new Date();
  //       const hours = currDate.getHours().toString().padStart(2, "0");
  //       const minutes = currDate.getMinutes().toString().padStart(2, "0");
  //       const seconds = currDate.getSeconds().toString().padStart(2, "0");
  //       const random = Math.floor(60 + Math.random() * (160 - 60 + 1));
  //       return [
  //         ...newData!,
  //         {
  //           datetime: `${hours}:${minutes}:${seconds}`,
  //           reading: random,
  //         },
  //       ];
  //     });
  //   }, 2000);

  //   return () => clearInterval(interval);
  // });

  // ============================================================== SOCKET IMPLEMENTATION
  interface SocketData {
    datetime: string;
    patientId: string;
    heartRate?: number;
    bloodPressureSys?: number;
    bloodPressureDia?: number;
    spO2?: number;
  }

  const router = useRouter();

  useEffect(() => {
    const socket = io("http://localhost:3001");
    const patientId = router.query.patientId;
    socket.emit("connectDashboard", patientId);
    socket.on("updateVitals", (data: SocketData) => {
      console.log(data);
      const datetime = new Date(data.datetime);
      const hours = datetime.getHours().toString().padStart(2, "0");
      const minutes = datetime.getMinutes().toString().padStart(2, "0");
      const seconds = datetime.getSeconds().toString().padStart(2, "0");
      const formattedDateTime = `${hours}:${minutes}:${seconds}`;
      if (data.heartRate) {
        setHRData((previousData) => {
          const newData = [
            ...previousData,
            {
              datetime: formattedDateTime,
              reading: Math.floor(data.heartRate!),
            },
          ];
          if (newData.length > 7) {
            return newData.slice(newData.length - 7);
          }
          return newData;
        });
      }
      if (data.bloodPressureDia) {
        setBpDiaData((previousData) => {
          const newData = [
            ...previousData,
            {
              datetime: formattedDateTime,
              reading: Math.floor(data.bloodPressureDia!),
            },
          ];
          if (newData.length > 7) {
            return newData.slice(newData.length - 7);
          }
          return newData;
        });
      }
      if (data.bloodPressureSys) {
        setBpSysData((previousData) => {
          const newData = [
            ...previousData,
            {
              datetime: formattedDateTime,
              reading: Math.floor(data.bloodPressureSys!),
            },
          ];
          if (newData.length > 7) {
            return newData.slice(newData.length - 7);
          }
          return newData;
        });
      }
      if (data.spO2) {
        setSpO2Data((previousData) => {
          const newData = [
            ...previousData,
            {
              datetime: formattedDateTime,
              reading: Math.floor(data.spO2!),
            },
          ];
          if (newData.length > 7) {
            return newData.slice(newData.length - 7);
          }
          return newData;
        });
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <OverviewSelection />
      <ResponsiveGridLayout
        className="layout"
        layouts={retrieveLayout}
        onLayoutChange={onLayoutChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
      >
        {/* graphs cannot render when divs are added in the ResponsiveContainer in LineChartComponent */}
        <div key="rr" className="flex items-center justify-between">
          <LastUpdatedVital data={rrData!} vital="rr" />
          <LineChartComponent data={rrData!} vital="rr" />
        </div>
        <div key="hr" className="flex items-center justify-between">
          <LastUpdatedVital data={hrData!} vital="hr" />
          <LineChartComponent data={hrData!} vital="hr" />
        </div>
        <div key="o2" className="flex items-center justify-between">
          <LastUpdatedVital data={spO2Data!} vital="o2" />
          <LineChartComponent data={spO2Data!} vital="o2" />
        </div>
        <div key="bpDia" className="flex items-center justify-between">
          <LastUpdatedVital data={bpDiaData!} vital="bpDia" />
          <LineChartComponent data={bpDiaData!} vital="bpDia" />
        </div>
        <div key="bpSys" className="flex items-center justify-between">
          <LastUpdatedVital data={bpSysData!} vital="bpSys" />
          <LineChartComponent data={bpSysData!} vital="bpSys" />
        </div>
        <div key="tp" className="flex">
          <LastUpdatedVital data={tempData!} vital="tp" />
          <LineChartComponent data={tempData!} vital="tp" />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}
