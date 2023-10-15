import DashboardSideBar from "@/components/DashboardSideBar";
import Header from "@/components/Header";
import {
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import styles from "@/styles/Dashboard.module.css";
import { Inter } from "next/font/google";
import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { SmartBed } from "@/models/smartBed";
import axios from "axios";
import { Patient } from "@/models/patient";
import {
  fetchPatientByPatientId,
  updatePatientConditionByPatientId,
} from "./api/patients_api";

const inter = Inter({ subsets: ["latin"] });
const handleSideBarTabClick = (key: string) => {
  router.push({ pathname: "/dashboard", query: { state: key } }, "/dashboard");
};

function updatePatient() {
  const router = useRouter();
  const patientId = router.query["patientId"];
  const [patientSelected, setSelectedPatient] = useState<Patient>();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showConditionErrorMessage, setShowConditionErrorMessage] =
    useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const condition = data.get("condition") as string;
    console.log(condition);
    if (!condition || condition === "") {
      console.log("set to true");
      setShowConditionErrorMessage(true);
      return;
    } else {
      setShowConditionErrorMessage(false);
    }
    console.log(showConditionErrorMessage);
    console.log("running");
    const res = await updatePatientConditionByPatientId(patientId, condition);
    if (res?.status === 200) {
      setShowSuccessMessage(true);
      setShowConditionErrorMessage(false);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  };

  useEffect(() => {
    fetchPatientByPatientId(patientId).then((res) => setSelectedPatient(res));
  }, [patientId]);

  if (patientSelected === undefined) {
    return <p>Loading</p>;
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
          <Typography
            sx={{ marginBottom: "20px", textAlign: "left" }}
            variant="h6"
          >
            Update Patient Details
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="patientName"
              label="Name of Patient"
              defaultValue={patientSelected?.name}
              name="patientName"
              autoFocus
              disabled
            ></TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              id="patientNric"
              label="NRIC of Patient"
              defaultValue={patientSelected?.nric}
              name="patientNric"
              autoFocus
              disabled
            ></TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              id="condition"
              label="Patient Condition"
              defaultValue={patientSelected?.condition}
              name="condition"
              autoFocus
              sx={{ paddingBottom: "10px" }}
            ></TextField>
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              Update Patient
            </Button>
            {showSuccessMessage ? (
              <Grid>
                <p className="text-green-600">Patient Updated.</p>
              </Grid>
            ) : null}
            {showConditionErrorMessage ? (
              <Grid>
                <p className="text-red-600">
                  Please ensure that condition is filled in.
                </p>
              </Grid>
            ) : null}
          </Box>
        </Box>
      </Box>
    </main>
  );
}
export default updatePatient;
