import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Dashboard.module.css";
import { Button, Grid } from "@mui/material";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { useState } from "react";
import BedIcon from '@mui/icons-material/Bed';
import ApartmentIcon from '@mui/icons-material/Apartment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardSideBar from "@/components/DashboardSideBar";
import {
  Paper,
  Box,
  Typography,
} from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export interface ISideBarTab {
  text: string;
  key: string;
  icon: JSX.Element;
}

export default function Dashboard() {
  const router = useRouter();

  const handleBackButton = () => {
    router.back();
  };

  const [currentPage, setCurrentPage] = useState("patients");

  const handleSideBarTabClick = (key: string) => {
    setCurrentPage(key);
  };

  const beds = [
    { Ward: 1, Room: 1, Bed: 1 },
    { Ward: 1, Room: 2, Bed: 2 },
    { Ward: 1, Room: 3, Bed: 3 },
    { Ward: 1, Room: 4, Bed: 4 },
    { Ward: 1, Room: 5, Bed: 5 },
    { Ward: 1, Room: 6, Bed: 6 },
    { Ward: 1, Room: 7, Bed: 7 },
    { Ward: 1, Room: 8, Bed: 8 },
    { Ward: 2, Room: 1, Bed: 1 },
    { Ward: 2, Room: 1, Bed: 2 },
    { Ward: 2, Room: 1, Bed: 3 },
    { Ward: 2, Room: 1, Bed: 4 },
    { Ward: 2, Room: 1, Bed: 5 },
    { Ward: 2, Room: 1, Bed: 6 },
    { Ward: 2, Room: 1, Bed: 7 },
    { Ward: 2, Room: 1, Bed: 8 },
    { Ward: 2, Room: 2, Bed: 1 },
    { Ward: 2, Room: 2, Bed: 2 },
    { Ward: 2, Room: 2, Bed: 3 },
    { Ward: 2, Room: 2, Bed: 4 },
    { Ward: 2, Room: 2, Bed: 5 },
    { Ward: 2, Room: 2, Bed: 6 },
    { Ward: 2, Room: 2, Bed: 7 },
    { Ward: 2, Room: 2, Bed: 8 }
  ];

  function groupBedsIntoWards(beds: any) {
    const wardsHashMap = new Map()
    for (let i=0; i<beds.length; i++) {
      const bed = beds[i]
      const ward = bed['Ward']
      if (wardsHashMap.has(ward)) {
        wardsHashMap.get(ward).push(bed);
      } else {
        wardsHashMap.set(ward, [bed]);
      }
    }
    return wardsHashMap;
  }

  const patientsTab: ISideBarTab = {
    text: "Patients Visualisation",
    key: "patients",
    icon: <ApartmentIcon />,
  };

  const wardsTab: ISideBarTab = {
    text: "Wards",
    key: "wards",
    icon: <BedIcon />,
  };

  const alertsTab: ISideBarTab = {
    text: "Alerts",
    key: "alerts",
    icon: <NotificationsIcon />,
  };

  const drawerTabs: ISideBarTab[] = [
    patientsTab,
    wardsTab,
    alertsTab,
  ];
  
  return (
    <>
      <Head>
        <title>Virtual Nursing Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Header />
          <Box sx={{ display: "flex" }}>
          <DashboardSideBar
            drawerTabs={drawerTabs}
            handleSideBarTabClick={handleSideBarTabClick}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: "background.default",
              p: 3,
            }}
          >
            <Box>
              {currentPage === patientsTab.key && (
                <>
                  <Typography sx = {{marginBottom: '20px'}} variant="h3">Patient Visualisation</Typography>
                    <Grid container spacing={3}>
                      {beds.map((bed, index) =>(
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                          <Paper elevation={3} style={{ padding: '16px', backgroundColor: bed.Bed == 8 ? "red" : 'lightGreen' }}>
                            <Typography variant="h6">
                              Ward: {bed.Ward}, Room: {bed.Room}, Bed: {bed.Bed}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                    <Button sx = {{marginTop: '20px'}}variant="contained" onClick={handleBackButton}>
                      Back
                    </Button>
                  
                </>
              )}
              {currentPage === wardsTab.key && (
                <>
                  <Typography sx = {{marginBottom: '20px'}} variant="h3">Wards Page</Typography>
                  <Grid container spacing={3}>
                      {Array.from(groupBedsIntoWards(beds).keys()).map((ward, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                          <Paper elevation={3} style={{ padding: '16px', backgroundColor: 'lightGreen' }}>
                            <Typography variant="h6">
                              Ward: {ward}, Count: {groupBedsIntoWards(beds).get(ward).length} 
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                    <Button sx = {{marginTop: '20px'}}variant="contained" onClick={handleBackButton}>
                      Back
                    </Button>
                </>
              )}
              {currentPage === alertsTab.key && (
                <>
                  <Typography variant="h3">Alerts Page</Typography>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </main>
    </>
  );
}