import DashboardSideBar from "@/components/DashboardSideBar";
import Header from "@/components/Header";
import { Box, Button, Grid, Paper, Typography, styled } from "@mui/material";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import styles from "@/styles/Dashboard.module.css";
import Image from "next/image";
import profilePic from "../../public/doctor.png";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import AirIcon from "@mui/icons-material/Air";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";
import { Patient } from "@/models/patient";
import axios from "axios";
import { DataGrid, GridRowModel } from "@mui/x-data-grid";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

const inter = Inter({ subsets: ["latin"] });

const patientVisualisationPage = () => {
  const router = useRouter();
  const { patientId, wardNum, roomNum, bedNum } = router.query;

  const handleSideBarTabClick = (key: string) => {
    router.push(
      { pathname: "/dashboard", query: { state: key } },
      "/dashboard"
    );
  };

  const [selectedPatient, setSelectedPatient] = useState<Patient>();

  useEffect(() => {
    const selectPatientById = async () => {
      try {
        await axios
          .get("http://localhost:3001/patient/" + patientId)
          .then((res) => {
            setSelectedPatient(res.data);
          });
      } catch (e) {
        console.error(e);
      }
    };
    selectPatientById();
  }, [patientId]);

  const vitals = {
    heartRate: 60,
    respiratoryRate: 60,
    bloodPressure: "80/120",
    temperature: 36.7,
    spo2: 80,
  };

  const alertColumns = [
    { field: "id", headerName: "ID" },
    { field: "status", headerName: "Status" },
    { field: "description", headerName: "Description" },
    { field: "notes", headerName: "Notes" },
  ];

  function getAlerts() {
    const listOfAlerts: GridRowModel[] = [];
    if (selectedPatient?.alerts !== undefined) {
      for (let i = 0; i < selectedPatient.alerts.length; i++) {
        console.log(selectedPatient.alerts[i].status);
        console.log(selectedPatient.alerts[i].description);
        console.log(selectedPatient.alerts[i].notes);
        listOfAlerts.push({
          status: selectedPatient.alerts[i].status,
          description: selectedPatient.alerts[i].description,
          notes: selectedPatient.alerts[i].notes,
        });
      }
    }
    return listOfAlerts.map((alert, index) => ({
      id: index + 1,
      ...alert,
    }));
  }

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const labels = ["9/9", "10/9", "11/9", "12/9", "13/9", "14/9", "15/9"];

  const respData = {
    labels,
    datasets: [
      {
        label: "Respiratory Rate",
        data: [61, 73, 89, 75, 61, 53, 99],
        borderColor: "rgb(255, 102, 102)",
        backgroundColor: "rgba(255, 102, 102, 0.5)",
      },
    ],
  };

  const heartData = {
    labels,
    datasets: [
      {
        label: "Heart Rate",
        data: [86, 94, 105, 91, 72, 95, 80],
        borderColor: "rgb(255, 178, 102)",
        backgroundColor: "rgba(255, 178, 102, 0.5)",
      },
    ],
  };

  const bpData = {
    labels,
    datasets: [
      {
        label: "Systolic",
        data: [121, 115, 102, 98, 130, 128, 86],
        borderColor: "rgb(178, 255, 102)",
        backgroundColor: "rgba(178, 255, 102, 0.5)",
      },
      {
        label: "Diastolic",
        data: [61, 73, 89, 75, 61, 53, 99],
        borderColor: "rgb(76, 153, 0)",
        backgroundColor: "rgba(76, 153, 0, 0.5)",
      },
    ],
  };

  const tempData = {
    labels,
    datasets: [
      {
        label: "Temperature",
        data: [36.7, 35.9, 38.9, 39.9, 40.0, 37.8, 36.5],
        borderColor: "rgb(102, 178, 255)",
        backgroundColor: "rgba(102, 178, 255, 0.5)",
      },
    ],
  };

  const spo2Data = {
    labels,
    datasets: [
      {
        label: "SpO2",
        data: [80, 90, 85, 80, 50, 40, 30],
        borderColor: "rgb(255, 102, 178)",
        backgroundColor: "rgba(255, 102, 178, 0.5)",
      },
    ],
  };

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .alert-open": {
      backgroundColor: "pink",
      "&:hover": {
        cursor: "pointer",
        backgroundColor: "pink",
      },
    },
    "& .alert-handling": {
      backgroundColor: "#FFA829",
      "&:hover": {
        cursor: "pointer",
        backgroundColor: "#FFA829",
      },
    },
    "& .alert-complete": {
      backgroundColor: "lightgreen",
      "&:hover": {
        cursor: "pointer",
        backgroundColor: "lightgreen",
      },
    },
  }));

  function updateSelectedPatient() {
    router.push("/updatePatient?patientId=" + selectedPatient?._id);
  }

  return (
    <main className={`${styles.main} ${inter.className}`}>
      <Header />
      <Box sx={{ display: "flex" }}>
        <DashboardSideBar handleSideBarTabClick={handleSideBarTabClick} />
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Box>
            <Box
              sx={{
                backgroundColor: "lightblue",
                display: "flex",
                border: 1,
                borderRadius: 3,
              }}
            >
              <Box>
                <Image
                  style={{
                    width: "50%",
                    height: "auto",
                    borderRadius: "50%",
                  }}
                  src={profilePic}
                  alt="Picture of Patient"
                />
                <h3>
                  {selectedPatient?.name} ({selectedPatient?.nric})
                </h3>
              </Box>
              <Box>
                <Box display={"flex"} sx={{ paddingTop: "20px" }}>
                  <p>
                    Ward: {wardNum}, Room: {roomNum}, Bed: {bedNum}
                  </p>
                </Box>
                <Box textAlign={"left"}>
                  <p>Condition: {selectedPatient?.condition} </p>
                  <p>Additional Info: {selectedPatient?.addInfo} </p>
                </Box>
                <Box textAlign={"right"} marginRight={2}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={updateSelectedPatient}
                  >
                    Update Details
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box>
              {/* <Box>
                <Grid container spacing={2} justifyContent="space-evenly">
                  <Grid item>
                    <Box className={styles.vitalBox}>
                      <p>Respiratory Rate: </p>
                      <AirIcon />
                      <Typography variant="h6" fontWeight="bold">
                        {vitals.respiratoryRate} breaths/min
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box className={styles.vitalBox}>
                      <p>Heart Rate: </p>
                      <MonitorHeartIcon />
                      <Typography variant="h6" fontWeight="bold">
                        {vitals.heartRate} beats/min
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box className={styles.vitalBox}>
                      <p>Blood Pressure: </p>
                      <BloodtypeIcon />
                      <Typography variant="h6" fontWeight="bold">
                        {vitals.bloodPressure} mm/HG
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box className={styles.vitalBox}>
                      <p>Temperature: </p>
                      <ThermostatIcon />
                      <Typography variant="h6" fontWeight="bold">
                        {vitals.temperature}&#176;C
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box className={styles.vitalBox}>
                      <p>SPo2: </p>
                      <FavoriteIcon />
                      <Typography variant="h6" fontWeight="bold">
                        {vitals.spo2}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box> */}
              <Box
                sx={{
                  marginTop: 2,
                  border: 1,
                  borderRadius: 3,
                }}
              >
                <Box display={"flex"} style={{ width: "33%" }}>
                  <Line data={respData} />
                  <Line data={heartData} />
                  <Line data={spo2Data} />
                </Box>
                <Box display={"flex"}>
                  <Box style={{ width: "33%" }}>
                    <Line data={bpData} />
                  </Box>
                  <Box style={{ width: "33%" }}>
                    <Line data={tempData} />
                  </Box>
                  <Grid item xs={6} style={{ flex: 1 }}>
                    {selectedPatient?.alerts?.length != undefined &&
                    selectedPatient.alerts.length > 0 ? (
                      <Box>
                        <h3>Alerts</h3>
                        <StyledDataGrid
                          aria-label="Alerts"
                          columns={alertColumns}
                          rows={getAlerts()}
                          autoHeight
                          rowHeight={100}
                          getRowClassName={(params) =>
                            `alert-${params.row.status}`
                          }
                          sx={{
                            "& .MuiDataGrid-cellContent": {
                              whiteSpace: "normal !important",
                              wordWrap: "break-word !important",
                            },
                          }}
                        />
                      </Box>
                    ) : (
                      <div>
                        <h3>Alerts</h3>
                        <p>No alerts have been set</p>
                      </div>
                    )}
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Box>
          <Button
            sx={{ marginTop: "20px" }}
            variant="contained"
            onClick={() => router.back()}
          >
            BACK
          </Button>
        </Box>
      </Box>
    </main>
  );
};

export default patientVisualisationPage;
