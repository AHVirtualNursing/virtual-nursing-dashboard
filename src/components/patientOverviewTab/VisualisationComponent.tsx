import React, { useContext, useEffect, useState } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Patient } from "@/models/patient";
import { updatePatientLayoutByPatientId } from "@/pages/api/patients_api";
import { useRouter } from "next/router";
import { Vital } from "@/models/vital";
import { fetchVitalByVitalId } from "@/pages/api/vitals_api";
import LastUpdatedVital from "./LastUpdatedVital";
import {
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
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

  console.log(order);
  console.log(drawerOrder);

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

  function Charts({ order }: { order: string[] }) {
    return (
      <ul>
        {order.map((chartType, index) => (
          <div>
            <li className="flex items-center justify-start">
              <div className="w-1/5">
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
              <div className="w-4/5">
                <ResponsiveContainer aspect={7}>
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
                    <XAxis dataKey="datetime"></XAxis>
                    <YAxis />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
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
            </li>
          </div>
        ))}
      </ul>
    );
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
      fetchVitalByVitalId(patient.vital).then((res) => setPatientVitals(res));
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
    const updateCharts = (data: any) => {
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
          ].slice(-7);
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
          ].slice(-7);
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
          ].slice(-7);
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
          ].slice(-7);
          return newData;
        });
      }
    };

    const patientId = router.query.patientId;
    socket.emit("connectDashboard", patientId);
    socket.on("updateVitals", updateCharts);

    return () => {
      socket.off("updateVitals", updateCharts);
      socket.emit("disconnectDashboard", patientId);
    };
  }, []);

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const drawerWidth = 240;
  const theme = useTheme();

  const ChartsContainer = styled("main", {
    shouldForwardProp: (prop) => prop !== "open",
  })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: `${drawerWidth}px`,
    }),
  }));

  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginRight: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  return (
    <div className="relative overflow-hidden">
      <AppBar position="static" color="inherit" elevation={0} open={open}>
        <Toolbar className="flex justify-end">
          <Button disabled={!changesMade} onClick={saveLayout}>
            Save Layout
          </Button>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            onClick={handleDrawerOpen}
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            position: "absolute",
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <div className="flex items-center">
          <IconButton size="small" onClick={handleDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
          <p>Graphs</p>
        </div>
        <Divider />
        {drawerOrder.map((chartType, index) => (
          <div>
            <List className="flex justify-center items-center">
              <p>{chartType}</p>
              <IconButton size="small" onClick={() => addChartType(chartType)}>
                <AddIcon />
              </IconButton>
            </List>
            <Divider />
          </div>
        ))}
      </Drawer>
      <ChartsContainer open={open}>
        <Charts order={order} />
      </ChartsContainer>
    </div>
  );
}
