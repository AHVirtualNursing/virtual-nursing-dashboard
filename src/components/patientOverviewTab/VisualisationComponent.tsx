/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Patient } from "@/types/patient";
import { updatePatientLayoutByPatientId } from "@/pages/api/patients_api";
import { useRouter } from "next/router";
import { Vital } from "@/types/vital";
import { fetchVitalByVitalId } from "@/pages/api/vitals_api";
import LastUpdatedVital from "./LastUpdatedVital";
import { Button, Divider, IconButton, List } from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddIcon from "@mui/icons-material/Add";
import { SocketContext } from "@/pages/layout";

interface ComponentProp {
  patient: Patient | undefined;
}

export default function VisualisationComponent({ patient }: ComponentProp) {
  const [order, setOrder] = useState<string[]>([]);
  const [drawerOrder, setDrawerOrder] = useState<string[]>([]);
  const [changesMade, setChangeMade] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (patient !== undefined) {
      setOrder(patient.order!);
      console.log(order);
      const l = ["bpSys", "bpDia", "hr", "rr", "temp", "spo2"].filter(
        (item) => !patient.order?.includes(item)
      );
      console.log(l);
      setDrawerOrder(l);
    }
  }, [patient]);

  const colours: { [key: string]: string } = {
    rr: "rgb(255, 102, 102)",
    hr: "rgb(255, 178, 102)",
    bpSys: "rgb(76, 153, 0)",
    bpDia: "rgb(76, 153, 0)",
    temp: "rgb(102, 178, 255)",
    spo2: "rgb(255, 102, 178)",
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

  const addChartType = (chartType: string) => {
    setDrawerOrder(drawerOrder.filter((type) => type !== chartType));
    setOrder([chartType, ...order]);
    setChangeMade(true);
  };

  const removeChartType = (chartType: string) => {
    setOrder(order.filter((type) => type !== chartType));
    setDrawerOrder([...drawerOrder, chartType]);
    setChangeMade(true);
  };

  const moveChartUp = (chartType: string) => {
    const currentIndex = order.indexOf(chartType);
    const updatedOrder = [...order];
    const temp = updatedOrder[currentIndex];
    updatedOrder[currentIndex] = updatedOrder[currentIndex - 1];
    updatedOrder[currentIndex - 1] = temp;
    setOrder(updatedOrder);
    setChangeMade(true);
  };

  const moveChartDown = (chartType: string) => {
    const currentIndex = order.indexOf(chartType);
    const updatedOrder = [...order];
    const temp = updatedOrder[currentIndex];
    updatedOrder[currentIndex] = updatedOrder[currentIndex + 1];
    updatedOrder[currentIndex + 1] = temp;
    setOrder(updatedOrder);
    setChangeMade(true);
  };

  function saveLayout() {
    updatePatientLayoutByPatientId(patient?._id, order).then((res) =>
      console.log(res)
    );
    setChangeMade(false);
  }

  const [rrData, setRRData] = useState(placeholder_data);
  const [hrData, setHRData] = useState(placeholder_data);
  const [bpSysData, setBpSysData] = useState(placeholder_data);
  const [bpDiaData, setBpDiaData] = useState(placeholder_data);
  const [tempData, setTempData] = useState(placeholder_data);
  const [spO2Data, setSpO2Data] = useState(placeholder_data);

  const [patientVitals, setPatientVitals] = useState<Vital>();

  useEffect(() => {
    if (patient !== undefined) {
      const vitalId =
        typeof patient?.vital === "string"
          ? patient?.vital
          : patient?.vital?._id;
      fetchVitalByVitalId(vitalId).then((res) => setPatientVitals(res));
    }
  }, [patient?.vital]);

  useEffect(() => {
    if (patientVitals) {
      if (patientVitals.spO2.length > 0) {
        setSpO2Data(patientVitals.spO2.slice(-7));
      }
      if (patientVitals.heartRate.length > 0) {
        setHRData(patientVitals.heartRate.slice(-7));
      }
      if (patientVitals.bloodPressureDia.length > 0) {
        setBpDiaData(patientVitals.bloodPressureDia.slice(-7));
      }
      if (patientVitals.bloodPressureSys.length > 0) {
        setBpSysData(patientVitals.bloodPressureSys.slice(-7));
      }
      if (patientVitals.temperature.length > 0) {
        setTempData(patientVitals.temperature.slice(-7));
      }
      if (patientVitals.respRate.length > 0) {
        setRRData(patientVitals.respRate.slice(-7));
      }
    }
  }, [patientVitals]);

  const router = useRouter();

  useEffect(() => {
    const updateCharts = (vitalAndPatientId: any) => {
      console.log("ENTER");
      const data = vitalAndPatientId.vital;
      const patientId = router.query.patientId;
      const patientIdFromSocket = vitalAndPatientId.patient;
      if (patientId === patientIdFromSocket) {
        if (data.heartRate) {
          setHRData(data.heartRate.slice(-7));
        }
        if (data.bloodPressureDia) {
          setBpDiaData(data.bloodPressureDia.slice(-7));
        }
        if (data.bloodPressureSys) {
          setBpSysData(data.bloodPressureSys.slice(-7));
        }
        if (data.spO2) {
          setSpO2Data(data.spO2.slice(-7));
        }
        if (data.respRate) {
          setRRData(data.respRate.slice(-7));
        }
        if (data.temperature) {
          setTempData(data.temperature.slice(-7));
        }
      }
    };

    socket.on("updatedVitals", updateCharts);
    return () => {
      socket.off("updatedVitals", updateCharts);
    };
  }, []);

  return (
    <div className="flex">
      <ul className="w-11/12">
        {order.map((chartType, index) => (
          <div key={index}>
            <li className="flex items-center justify-start">
              <div className="w-2/12">
                <LastUpdatedVital
                  data={
                    chartType == "rr"
                      ? rrData
                      : chartType == "hr"
                      ? hrData
                      : chartType == "bpSys"
                      ? bpSysData
                      : chartType == "bpDia"
                      ? bpDiaData
                      : chartType == "temp"
                      ? tempData
                      : chartType == "spo2"
                      ? spO2Data
                      : placeholder_data
                  }
                  vital={chartType}
                />
              </div>
              <div className="w-10/12">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={
                      chartType == "rr"
                        ? rrData
                        : chartType == "hr"
                        ? hrData
                        : chartType == "bpSys"
                        ? bpSysData
                        : chartType == "bpDia"
                        ? bpDiaData
                        : chartType == "temp"
                        ? tempData
                        : chartType == "spo2"
                        ? spO2Data
                        : placeholder_data
                    }
                  >
                    <Line
                      type="monotone"
                      dataKey="reading"
                      stroke={colours[chartType]}
                      strokeWidth={3}
                    />
                    <CartesianGrid stroke="#ccc" strokeDasharray="1" />
                    <XAxis dataKey="datetime" minTickGap={80}></XAxis>
                    <YAxis />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/12">
                <IconButton
                  size="small"
                  onClick={() => moveChartUp(chartType)}
                  disabled={index === 0}
                >
                  <ArrowDropUpIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveChartDown(chartType)}
                  disabled={index === order.length - 1}
                >
                  <ArrowDropDownIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => removeChartType(chartType)}
                >
                  <ClearIcon />
                </IconButton>
              </div>
            </li>
          </div>
        ))}
      </ul>
      <div className="w-1/12 border-0 border-l-2 border-slate-200 border-solid">
        <p className="text-slate-500">Graphs to show</p>
        {drawerOrder.map((chartType, index) => (
          <div key={index}>
            <List className="flex justify-center items-center">
              <p>{chartType}</p>
              <IconButton size="small" onClick={() => addChartType(chartType)}>
                <AddIcon />
              </IconButton>
            </List>
            <Divider />
          </div>
        ))}
        <Button disabled={!changesMade} onClick={saveLayout}>
          Save Layout
        </Button>
      </div>
    </div>
  );
}
