import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Dashboard.module.css";
import { Button, Grid } from "@mui/material";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import DashboardSideBar from "@/components/DashboardSideBar";
import { Paper, Box, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Dashboard() {
  const router = useRouter();

  const handleLogoutButton = () => {
    router.push("/");
  };

  console.log(router.query);
  console.log(router.query["state"]);
  const [currentPage, setCurrentPage] =
    router.query["state"] === undefined
      ? useState("patients")
      : useState(router.query["state"]);

  // define typing for smartbed object
  type Smartbed = {
    bedNum: number;
    roomNum: number;
    wardNum: number;
    patientName: string;
    occupied: boolean;
    heartRate: Object[];
    respiratoryRate: Object[];
    bloodPressure: Object[];
    spo2: Object[];
    temperature: Object[];
    railsStatus: boolean;
    note: string;
    alerts: Object[];
    alertConfig: undefined;
    reminders: Object[];
    reports: Object[];
  };

  const [allBeds, setAllBeds] = useState<Smartbed[]>([]);

  // fetch smartbed data from mongo here
  useEffect(() => {
    const fetchAllBeds = async () => {
      try {
        await axios.get("http://localhost:3001/smartbeds").then((res) => {
          setAllBeds(res.data.data);
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchAllBeds();
  }, []);

  const handleSideBarTabClick = (key: string) => {
    setCurrentPage(key);
  };

  const viewPatientVisualisation = (
    ward: number,
    room: number,
    bed: number
  ) => {
    router.push(`/patientVisualisation?ward=${ward}&room=${room}&bed=${bed}`);
  };

  const viewWardVisualisation = (ward: number) => {
    router.push(`/wardVisualisation?ward=${ward}`);
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
    { Ward: 2, Room: 2, Bed: 8 },
  ];

  function groupBedsIntoWards(beds: string | any[]) {
    const wardsHashMap = new Map();
    for (let i = 0; i < beds.length; i++) {
      const bed = beds[i];
      const ward = bed["Ward"];
      if (wardsHashMap.has(ward)) {
        wardsHashMap.get(ward).push(bed);
      } else {
        wardsHashMap.set(ward, [bed]);
      }
    }
    return wardsHashMap;
  }

  const rows: GridRowModel[] = [
    { id: 1, Ward: 1, Room: 1, Bed: 1, Status: "HANDLING" },
    { id: 2, Ward: 2, Room: 1, Bed: 1, Status: "HANDLING" },
    { id: 3, Ward: 1, Room: 1, Bed: 1, Status: "COMPLETED" },
    { id: 4, Ward: 1, Room: 8, Bed: 8, Status: "OPEN" },
    { id: 5, Ward: 2, Room: 1, Bed: 8, Status: "OPEN" },
    { id: 6, Ward: 2, Room: 2, Bed: 1, Status: "HANDLING" },
    { id: 7, Ward: 2, Room: 2, Bed: 8, Status: "OPEN" },
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "Ward",
      headerName: "Ward",
      width: 90,
      editable: false,
    },
    {
      field: "Room",
      headerName: "Room",
      width: 90,
      editable: false,
    },
    {
      field: "Bed",
      headerName: "Bed",
      width: 90,
      editable: false,
    },
    {
      field: "Status",
      headerName: "Status",
      width: 150,
      editable: false,
    },
  ];

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .alert-OPEN": {
      backgroundColor: "#FF5151",
      "&:hover": {
        cursor: "pointer",
        backgroundColor: "#FF5151",
      },
    },
    "& .alert-HANDLING": {
      backgroundColor: "#FFA829",
      "&:hover": {
        cursor: "pointer",
        backgroundColor: "#FFA829",
      },
    },
    "& .alert-COMPLETED": {
      backgroundColor: "#52F374",
      "&:hover": {
        cursor: "pointer",
        backgroundColor: "#52F374",
      },
    },
  }));

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
          <DashboardSideBar handleSideBarTabClick={handleSideBarTabClick} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: "background.default",
              p: 3,
            }}
          >
            <Box>
              {currentPage === "patients" && (
                <>
                  <Box sx={{ display:"flex"}}>
                    <Typography sx={{ marginBottom: "20px", flex: "1" }} variant="h6">
                      General Patients Visualisation
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    {allBeds.map((bed, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Paper
                          sx={{ ":hover": { cursor: "pointer" } }}
                          onClick={() =>
                            viewPatientVisualisation(
                              bed.wardNum,
                              bed.roomNum,
                              bed.bedNum
                            )
                          }
                          elevation={3}
                          style={{
                            padding: "16px",
                            backgroundColor:
                              bed.bedNum == 1
                                ? "#FFA829"
                                : bed.bedNum == 8
                                ? "#FF5151"
                                : "#52F374",
                          }}
                        >
                          <Typography variant="h6">
                            Ward: {bed.wardNum}, Room: {bed.roomNum}, Bed:{""}
                            {bed.bedNum}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  <Button 
                    variant="contained" 
                    sx={{marginTop: "20px"}} 
                    href="/createPatient">
                      Assign New Patient
                    </Button>
                </>
              )}
              {currentPage === "wards" && (
                <>
                  <Typography sx={{ marginBottom: "20px" }} variant="h6">
                    Wards Page
                  </Typography>
                  <Grid container spacing={3}>
                    {Array.from(groupBedsIntoWards(beds).keys()).map(
                      (ward, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                          <Paper
                            sx={{ ":hover": { cursor: "pointer" } }}
                            onClick={() => viewWardVisualisation(ward)}
                            elevation={3}
                            style={{ padding: "16px" }}
                          >
                            <Typography variant="h6">
                              Ward: {ward}, Count:{" "}
                              {groupBedsIntoWards(beds).get(ward).length}
                            </Typography>
                          </Paper>
                        </Grid>
                      )
                    )}
                  </Grid>
                  <Button
                    sx={{ marginTop: "20px" }}
                    variant="contained"
                    onClick={handleLogoutButton}
                  >
                    Temporary Logout
                  </Button>
                </>
              )}
              {currentPage === "alerts" && (
                <>
                  <Typography sx={{ marginBottom: "20px" }} variant="h6">
                    View List of Alerts
                  </Typography>
                  <Box
                    sx={{
                      height: "70%",
                      width: "100%",
                    }}
                  >
                    <StyledDataGrid
                      rows={rows}
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
                      getRowClassName={(params) => `alert-${params.row.Status}`}
                    />
                  </Box>
                  <Button
                    sx={{ marginTop: "20px" }}
                    variant="contained"
                    onClick={handleLogoutButton}
                  >
                    Temporary Logout
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </main>
    </>
  );
}
