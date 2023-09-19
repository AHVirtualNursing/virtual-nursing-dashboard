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
import { signOut } from "next-auth/react";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { SmartBed } from "@/models/smartBed";
import { Ward } from "@/models/ward";

const inter = Inter({ subsets: ["latin"] });

export default function Dashboard() {
  const router = useRouter();

  const handleLogoutButton = () => {
    signOut();
  };

  console.log(router.query);
  console.log(router.query["state"]);
  const [currentPage, setCurrentPage] =
    router.query["state"] === undefined
      ? useState("patients")
      : useState(router.query["state"]);

  const [allBeds, setAllBeds] = useState<SmartBed[]>([]);
  const [allWards, setAllWards] = useState<Ward[]>([]);

  // fetch all beds and store occupied beds for display
  useEffect(() => {
    const fetchAllBeds = async () => {
      try {
        await axios.get("http://localhost:3001/smartbed").then((res) => {
          const bedData = res.data.data;
          bedData.sort((bedA: SmartBed, bedB: SmartBed) => {
            if (bedA.bedStatus === "occupied" && bedB.bedStatus === "vacant") {
              return -1;
            }
            if (bedA.bedStatus === "vacant" && bedB.bedStatus === "occupied") {
              return 1;
            }
            if (
              bedA.bedStatus === "vacant" &&
              bedA.patient === undefined &&
              bedB.bedStatus === "vacant" &&
              bedB.patient
            ) {
              return 1;
            }
            if (
              bedA.bedStatus === "vacant" &&
              bedA.patient &&
              bedB.bedStatus === "vacant" &&
              bedB.patient === undefined
            ) {
              return -1;
            }
            return 0;
          });
          setAllBeds(bedData);
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchAllBeds();
  }, []);

  // fetch all wards
  useEffect(() => {
    const fetchAllWards = async () => {
      try {
        await axios.get("http://localhost:3001/ward").then((res) => {
          setAllWards(res.data.data);
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchAllWards();
  }, []);

  const handleSideBarTabClick = (key: string) => {
    setCurrentPage(key);
  };

  const viewPatientVisualisation = (
    patientId: string | undefined,
    wardNum: string,
    roomNum: number,
    bedNum: number
  ) => {
    router.push(
      `/patientVisualisation?patientId=${patientId}&wardNum=${wardNum}&roomNum=${roomNum}&bedNum=${bedNum}`
    );
  };

  const viewWardVisualisation = (wardId: string, wardNum: string) => {
    router.push({
      pathname: "/wardVisualisation",
      query: { wardId: wardId, wardNum: wardNum },
    });
  };

  const rows: GridRowModel[] = [
    { id: 1, Ward: 1, Room: 1, Bed: 1, Status: "HANDLING" },
    { id: 2, Ward: 2, Room: 1, Bed: 1, Status: "HANDLING" },
    { id: 3, Ward: 1, Room: 1, Bed: 1, Status: "COMPLETED" },
    { id: 4, Ward: 1, Room: 8, Bed: 8, Status: "OPEN" },
    { id: 5, Ward: 2, Room: 1, Bed: 8, Status: "OPEN" },
    { id: 6, Ward: 2, Room: 2, Bed: 1, Status: "HANDLING" },
    { id: 7, Ward: 2, Room: 2, Bed: 8, Status: "OPEN" },
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
      backgroundColor: "lightgreen",
      "&:hover": {
        cursor: "pointer",
        backgroundColor: "lightgreen",
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
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      textAlign="left"
                      sx={{ marginBottom: "20px", flex: "1" }}
                      variant="h6"
                    >
                      General Patients Visualisation
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ margin: "10px" }}
                      href="/createPatient"
                    >
                      Assign New Patient
                    </Button>
                  </Box>
                  <Grid container spacing={3}>
                    {allBeds.map((bed) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={bed._id}>
                        <Paper
                          sx={{ ":hover": { cursor: "pointer" } }}
                          onClick={() =>
                            viewPatientVisualisation(
                              bed.patient?._id,
                              bed.ward.num,
                              bed.roomNum,
                              bed.bedNum
                            )
                          }
                          elevation={3}
                          style={{
                            padding: "16px",
                            backgroundColor:
                              bed.bedStatus == "occupied"
                                ? "lightgreen"
                                : bed.patient
                                ? "orange"
                                : "pink",
                          }}
                        >
                          <p>{bed.patient ? bed.patient.name : "Vacant Bed"}</p>
                          <Typography variant="h6">
                            Ward: {bed.ward.num}, Room: {bed.roomNum}, Bed:{" "}
                            {bed.bedNum}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
              {currentPage === "wards" && (
                <>
                  <Typography
                    textAlign="left"
                    sx={{ marginBottom: "20px" }}
                    variant="h6"
                  >
                    Wards Page
                  </Typography>
                  <Grid container spacing={3}>
                    {allWards.map((ward) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={ward._id}>
                        <Paper
                          sx={{ ":hover": { cursor: "pointer" } }}
                          onClick={() =>
                            viewWardVisualisation(ward._id, ward.num)
                          }
                          elevation={3}
                          style={{
                            padding: "16px",
                          }}
                        >
                          <Typography variant="h6">
                            Ward: {ward.num}, Bed Count :{" "}
                            {ward.smartBeds?.length}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
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
                  <Typography
                    textAlign="left"
                    sx={{ marginBottom: "20px" }}
                    variant="h6"
                  >
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
Dashboard.requireAuth = true;
