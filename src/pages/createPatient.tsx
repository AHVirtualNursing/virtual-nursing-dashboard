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
import router from "next/router";
import React, { useEffect, useState } from "react";
import { SmartBed } from "@/models/smartBed";
import axios from "axios";
import { Patient } from "@/models/patient";

const inter = Inter({ subsets: ["latin"] });
const handleSideBarTabClick = (key: string) => {
  router.push({ pathname: "/dashboard", query: { state: key } }, "/dashboard");
};

function createPatient() {
  const [bedAssigned, setAssignedBed] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAssignedBed(event.target.value);
  };

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const patientName = data.get("patientName") as string;
    const condition = data.get("condition") as string;
    const patientNric = data.get("patientNric") as string;
    // update smart bed status to occupied, require ObjectId of newly created patient

    try {
      const res = await axios.post("http://localhost:3001/patient", {
        name: patientName,
        nric: patientNric,
        condition: condition,
      });
      console.log(res);
      if (res.status === 200) {
        const updateBedRes = await axios.put(
          "http://localhost:3001/smartbed/" + bedAssigned,
          {
            patient: res.data.data._id,
          }
        );
        console.log(updateBedRes);
        if (updateBedRes.status == 200) {
          setShowSuccessMessage(true);
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [vacantBeds, setVacantBeds] = useState<SmartBed[]>([]);

  // fetch all beds and store vacant beds for selection
  useEffect(() => {
    const fetchAllBeds = async () => {
      try {
        await axios.get("http://localhost:3001/smartbed").then((res) => {
          const bedData = res.data.data;
          let vacant = bedData.filter(
            (bed: { bedStatus: string; patient: Patient }) =>
              bed.bedStatus === "vacant" && bed.patient === undefined
          );
          console.log(vacant);
          setVacantBeds(vacant);
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchAllBeds();
  }, []);

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
            Create New Patient/Assign To Bed
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
              name="patientName"
              autoFocus
            ></TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              id="patientNric"
              label="NRIC of Patient"
              name="patientNric"
              autoFocus
            ></TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              id="condition"
              label="Any conditions to take note of"
              name="condition"
              autoFocus
              sx={{ paddingBottom: "10px" }}
            ></TextField>
            <InputLabel sx={{ textAlign: "left" }} id="wardRoomBedLabel">
              Selected Bed
            </InputLabel>
            <Select
              fullWidth
              value={bedAssigned}
              label="Available Beds"
              onChange={handleChange}
            >
              {vacantBeds.map((bed) => (
                <MenuItem key={bed._id} value={bed._id}>
                  Ward: {bed.ward.num}, Room: {bed.roomNum}, Bed: {bed.bedNum}
                </MenuItem>
              ))}
            </Select>
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              Assign Patient
            </Button>
            {showSuccessMessage ? (
              <Grid>
                <p className="text-green-600">New patient created.</p>
              </Grid>
            ) : null}
          </Box>
        </Box>
      </Box>
    </main>
  );
}

export default createPatient;