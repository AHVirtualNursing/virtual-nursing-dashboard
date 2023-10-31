import DashboardSideBar from "@/components/DashboardSideBar";
import Header from "@/components/Header";
import { Box, Button, Typography } from "@mui/material";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import styles from "@/styles/Dashboard.module.css";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import { Ward } from "@/models/ward";
import { SmartBed } from "@/models/smartBed";
import { fetchBedsByWardId } from "./api/wards_api";

const wardVisualisationPage = () => {
  const router = useRouter();
  const { wardId, wardNum } = router.query;
  const [bedsInWards, setBeds] = useState<SmartBed[]>();

  // fetch ward given Id
  useEffect(() => {
    fetchBedsByWardId(wardId).then((res) => setBeds(res));
  }, [wardId]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "Room",
      headerName: "Room",
      editable: false,
      flex: 1,
    },
    {
      field: "Bed",
      headerName: "Bed",
      editable: false,
      flex: 1,
    },
    {
      field: "Patient",
      headerName: "Patient",
      editable: false,
      flex: 1,
    },
    {
      field: "heartRate",
      headerName: "Heart Rate",
      editable: false,
      flex: 1,
    },
    {
      field: "respiratoryRate",
      headerName: "Respiratory Rate",
      editable: false,
      flex: 1,
    },
    {
      field: "bloodPressure",
      headerName: "Blood Pressure",
      editable: false,
      flex: 1,
    },
    {
      field: "temperature",
      headerName: "Temperature",
      editable: false,
      flex: 1,
    },
    {
      field: "spo2",
      headerName: "SPo2",
      editable: false,
      flex: 1,
    },
  ];

  function getBedsInWard(beds: SmartBed[] | undefined) {
    const vitals = {
      heartRate: 60,
      respiratoryRate: 60,
      bloodPressure: "80/120",
      temperature: 36.7,
      spo2: 80,
    };
    const listOfBeds: GridRowModel[] = [];
    if (beds?.length !== undefined) {
      for (let i = 0; i < beds!.length; i++) {
        listOfBeds.push({
          Room: beds![i].roomNum,
          Bed: beds![i].bedNum,
          Patient: beds![i].patient?.name,
        });
      }
    }
    return listOfBeds.map((bed, index) => ({
      id: index + 1,
      ...bed,
      ...vitals,
    }));
  }

  return (
    <div className="flex flex-col p-8 gap-8 bg-slate-100 w-full shadow-lg">
      <Box>
        <Typography sx={{ marginBottom: "20px" }} variant="h6">
          Ward {wardNum} Visualisation
        </Typography>
        <DataGrid
          rows={getBedsInWard(bedsInWards)}
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
            "& .MuiDataGrid-row:hover": {
              cursor: "pointer",
            },
          }}
        />
      </Box>
      <Button
        sx={{ marginTop: "20px" }}
        variant="contained"
        onClick={() => router.back()}
      >
        BACK
      </Button>
    </div>
  );
};

export default wardVisualisationPage;
