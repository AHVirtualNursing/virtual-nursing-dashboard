import DashboardSideBar from '@/components/DashboardSideBar';
import Header from '@/components/Header';
import { Box, Button, Typography } from '@mui/material';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import styles from "@/styles/Dashboard.module.css";
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';

const inter = Inter({ subsets: ["latin"] });

const wardVisualisationPage = () => {
  const router = useRouter();
  const { ward } = router.query;
  
  const handleSideBarTabClick = (key: string) => {
    router.push({pathname: "/dashboard", query: {state : key}}, '/dashboard' );
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

  const columns: GridColDef[] = [
    { field: "id",
      headerName: "ID",
      width: 90
    },
    {
      field: "Ward",
      headerName: "Ward",
      width: 90,
      editable: false
    },
    {
      field: "Room",
      headerName: "Room",
      width: 90,
      editable: false
    },
    {
      field: "Bed",
      headerName: "Bed",
      width: 90,
      editable: false
    },
    {
      field: "heartRate",
      headerName: "Heart Rate",
      width: 150,
      editable: false
    },
    {
      field: "respiratoryRate",
      headerName: "Respiratory Rate",
      width: 150,
      editable: false
    },
    {
      field: "bloodPressure",
      headerName: "Blood Pressure",
      width: 150,
      editable: false
    },
    {
      field: "temperature",
      headerName: "Temperature",
      width: 150,
      editable: false
    },
    {
      field: "spo2",
      headerName: "SPo2",
      width: 150,
      editable: false
    }
  ];

  function getBedsInWard(ward: number | string | string[] | undefined) {
    const vitals = {
        heartRate: 60,
        respiratoryRate: 60,
        bloodPressure: '80/120',
        temperature: 36.7,
        spo2: 80
      }
    const listOfBeds: GridRowModel[] = [];
    for (let i=0; i<beds.length; i++) {
        if (beds[i]['Ward'] == ward) {
            listOfBeds.push(beds[i])
        }
    }
    return listOfBeds.map((bed, index) => ({id: index+1, ...bed, ...vitals}));
  }


  // You can now use the ward, room, and bed values to render your page content
  return (
    <main className={`${styles.main} ${inter.className}`}>
      <Header />
      <Box sx={{ display: "flex" }}>
        <DashboardSideBar handleSideBarTabClick={handleSideBarTabClick}/>
          <Box component="main" sx={{flexGrow: 1, bgcolor: "background.default", p:3}}>
            <Box>
              <Typography sx= {{marginBottom: '20px'}} variant="h6">Ward {ward} Visualisation</Typography>
              <DataGrid
                rows={getBedsInWard(ward)}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 10,
                    },
                },
                }}
                pageSizeOptions={[10]}
                onRowDoubleClick={() => alert("You clicked me")}
                sx={{
                '& .MuiDataGrid-row:hover': {
                    cursor: 'pointer'
                }
                }}
            />
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

export default wardVisualisationPage;