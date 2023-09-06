import DashboardSideBar from '@/components/DashboardSideBar';
import Header from '@/components/Header';
import { Box, Button, Typography } from '@mui/material';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import styles from "@/styles/Dashboard.module.css";

const inter = Inter({ subsets: ["latin"] });

const patientVisualisationPage = () => {
  const router = useRouter();
  const { ward, room, bed } = router.query;
  
  const handleSideBarTabClick = (key: string) => {
    router.push({pathname: "/dashboard", query: {state : key}}, '/dashboard' );
  };

  const vitals = {
    heartRate: 60,
    respiratoryRate: 60,
    bloodPressure: '80/120',
    temperature: 36.7,
    spo2: 80
  }

  // You can now use the ward, room, and bed values to render your page content
  return (
    <main className={`${styles.main} ${inter.className}`}>
      <Header />
      <Box sx={{ display: "flex" }}>
        <DashboardSideBar handleSideBarTabClick={handleSideBarTabClick}/>
          <Box component="main" sx={{flexGrow: 1, bgcolor: "background.default", p:3}}>
            <Box>
              <Typography sx= {{marginBottom: '20px'}} variant="h6">Patient Visualisation</Typography>
              <p>Ward: {ward}, Room: {room}, Bed: {bed} </p>
              <p>Heart Rate: {vitals.heartRate} beats/min</p>
              <p>Respiratory Rate: {vitals.respiratoryRate} breaths/min</p>
              <p>Blood Pressure: {vitals.bloodPressure} mm/Hg</p>
              <p>Heart Rate: {vitals.temperature}&#176;C</p>
              <p>Heart Rate: {vitals.spo2}%</p>
            </Box>
            <Button sx = {{marginTop: '20px'}}variant="contained" onClick={() => router.back}>
              BACK
            </Button>
          </Box>
        {/* Add your visualization components here */}
      </Box>
    </main>
  );
};

export default patientVisualisationPage;