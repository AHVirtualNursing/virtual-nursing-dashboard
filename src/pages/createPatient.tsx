import DashboardSideBar from "@/components/DashboardSideBar"
import Header from "@/components/Header"
import { Box, Button, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material"
import styles from "@/styles/Dashboard.module.css";
import { Inter } from "next/font/google";
import router from "next/router";
import React from "react";


const inter = Inter({ subsets: ["latin"] });
const handleSideBarTabClick = (key: string) => {
    router.push({pathname: "/dashboard", query: {state : key}}, '/dashboard' );
};


function createPatient() {
    const [bedAssigned, setAssignedBed] = React.useState("");

    const handleChange = (event: SelectChangeEvent) => {
        setAssignedBed(event.target.value);
    }
  return (
    <main className={`${styles.main} ${inter.className}`}>
      <Header />
      <Box sx={{ display: "flex" }}>
        <DashboardSideBar handleSideBarTabClick={handleSideBarTabClick}/>
          <Box component="main" sx={{flexGrow: 1, bgcolor: "background.default", p:3}}>
            <Typography sx= {{marginBottom: '20px'}} variant="h6">Create New Patient/Assign To Bed</Typography>
            <TextField
                margin='normal'
                required
                fullWidth
                id='patientName'
                label='Name of Patient'
                name='patientName'
                autoFocus>
            </TextField>
            <TextField
                margin='normal'
                required
                fullWidth
                id='condition'
                label='Any conditions to take note of'
                name='condition'
                autoFocus
                sx={{paddingBottom: "10px"}}>
            </TextField>
            <InputLabel sx={{textAlign: "left"}} id="wardRoomBedLabel">Available Beds</InputLabel>
            <Select
                fullWidth
                value={bedAssigned}
                label="Available Beds"
                onChange={handleChange}
                >
                <MenuItem value={1}>Ward:1 Room:1 Bed:1</MenuItem>
                <MenuItem value={2}>Ward:1 Room:2 Bed:1</MenuItem>
                <MenuItem value={3}>Ward:1 Room:3 Bed:1</MenuItem>
                <MenuItem value={4}>Ward:2 Room:1 Bed:1</MenuItem>
                <MenuItem value={5}>Ward:2 Room:1 Bed:2</MenuItem>
            </Select>
            <Button
              type='submit'
              variant='contained'
              sx={{ mt: 3, mb: 2 }}>
              Assign Patient
            </Button>
          </Box>
      </Box>
    </main>
  )
}

export default createPatient