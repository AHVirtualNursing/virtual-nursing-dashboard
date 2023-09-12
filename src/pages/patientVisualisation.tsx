import DashboardSideBar from "@/components/DashboardSideBar";
import Header from "@/components/Header";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
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
            <Typography sx={{ marginBottom: "20px" }} variant="h6">
              Patient Visualisation
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <Box>
                <Box>
                  <Image src={profilePic} alt="Picture of Patient" />
                </Box>
                <Box sx={{ paddingTop: "20px", textAlign: "left" }}>
                  <h3>{selectedPatient?.name}</h3>
                  <p>Ward: {wardNum}</p>
                  <p>Room: {roomNum}</p>
                  <p>Bed: {bedNum} </p>
                  <p>Nurse in charge: HARDCODED</p>
                </Box>
              </Box>
              <Box>
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
