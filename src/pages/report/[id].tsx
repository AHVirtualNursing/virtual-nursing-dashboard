import React, { useEffect, useState } from "react";
import router from "next/router";
import { Container, Typography, Paper, Grid } from "@mui/material";
import { fetchPatientByPatientId } from "../api/patients_api";
import { Patient } from "@/models/patient";

export default function ReportPage() {
  const id = router.query.id;

  const [patient, setPatient] = useState<Patient>();

  useEffect(() => {
    fetchPatient();
  }, []);

  const fetchPatient = async () => {
    const patient = await fetchPatientByPatientId(id);
    console.log(patient);
    if (patient) {
      setPatient(patient);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: 16, marginTop: 20 }}>
        <Typography variant="h4" gutterBottom>
          Smart Report for Patient {patient?.name}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Average Heart Rate: bpm
            </Typography>
            <Typography variant="h6" gutterBottom>
              Maximum Heart Rate: bpm
            </Typography>
            <Typography variant="h6" gutterBottom>
              Minimum Heart Rate: bpm
            </Typography>
            <Typography variant="h6" gutterBottom>
              Average SpO2: %
            </Typography>
            <Typography variant="h6" gutterBottom>
              Time Spent in Critical Range (SpO2):
            </Typography>
            <Typography variant="h6" gutterBottom>
              Average Blood Pressure: averageBloodPressureSys/
              averageBloodPressureDia mmHg
            </Typography>
            <Typography variant="h6" gutterBottom>
              Hypertension Episodes:
            </Typography>
            <Typography variant="h6" gutterBottom>
              Hypotension Episodes:
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
