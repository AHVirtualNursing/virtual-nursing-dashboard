import { Alert } from "@/models/alert";
import { Patient } from "@/models/patient";
import { fetchAlertsByPatientId } from "@/pages/api/patients_api";
import { Box, Grid, Tab, Tabs, Typography, styled } from "@mui/material";
import { DataGrid, GridRowModel } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";

interface PatientProp {
  patient: Patient | undefined;
  forDischargeReport?: boolean;
}

interface TabPanelProps {
  status: string;
  index: number;
  value: number;
}

function PatientAlerts(patientProp: PatientProp) {
  const [patientAlerts, setPatientAlerts] = useState<Alert[]>();

  useEffect(() => {
    fetchAlertsByPatientId(patientProp.patient?._id).then((res) =>
      setPatientAlerts(res)
    );
  }, [patientProp.patient?._id]);

  const alertColumns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "description", headerName: "Description", flex: 8 },
    { field: "notes", headerName: "Notes", flex: 8 },
  ];

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .alert-open": {
      backgroundColor: "pink",
      "&:hover": {
        cursor: "pointer",
        backgroundColor: "pink",
      },
    },
    "& .alert-handling": {
      backgroundColor: "#FFA829",
      "&:hover": {
        cursor: "pointer",
        backgroundColor: "#FFA829",
      },
    },
    "& .alert-complete": {
      backgroundColor: "lightgreen",
      "&:hover": {
        cursor: "pointer",
        backgroundColor: "lightgreen",
      },
    },
  }));

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const [currentTab, setCurrentTab] = useState(
    patientProp.forDischargeReport ? 0 : 0
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  function getAlerts(status: string) {
    const listOfAlerts: GridRowModel[] = [];
    if (patientAlerts !== undefined) {
      for (let i = 0; i < patientAlerts.length; i++) {
        if (patientAlerts[i].status == status) {
          listOfAlerts.push({
            status: patientAlerts[i].status,
            description: patientAlerts[i].description,
            notes: patientAlerts[i].notes,
          });
        }
      }
    }
    return listOfAlerts.map((alert, index) => ({
      id: index + 1,
      ...alert,
    }));
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { status, value, index, ...other } = props;

    return (
      <Box>
        {value === index && (
          <Box>
            <Grid item xs={6} style={{ flex: 1 }}>
              {patientAlerts?.length != undefined &&
              getAlerts(status).length > 0 ? (
                <Box>
                  <StyledDataGrid
                    aria-label="Alerts"
                    columns={alertColumns}
                    rows={getAlerts(status)}
                    hideFooter
                    disableRowSelectionOnClick
                    getRowClassName={(params) => `alert-${params.row.status}`}
                    sx={{
                      "& .MuiDataGrid-cellContent": {
                        whiteSpace: "normal !important",
                        wordWrap: "break-word !important",
                      },
                      "& .MuiDataGrid-cell:focus": {
                        outline: "none",
                      },
                    }}
                  />
                </Box>
              ) : (
                <div>
                  <Typography marginTop={2} variant="body1">
                    No {status} alerts
                  </Typography>
                </div>
              )}
            </Grid>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <div>
      {!patientProp.forDischargeReport && (
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={currentTab}
            onChange={handleChange}
            aria-label="basic tabs example">
            <Tab label="Open" {...a11yProps(0)} />
            <Tab label="Handling" {...a11yProps(1)} />
            <Tab label="Completed" {...a11yProps(2)} />
          </Tabs>
        </Box>
      )}
      <>
        <CustomTabPanel
          value={currentTab}
          index={0}
          status="open"></CustomTabPanel>
        <CustomTabPanel
          value={currentTab}
          index={1}
          status="handling"></CustomTabPanel>
      </>
      <CustomTabPanel
        value={currentTab}
        index={2}
        status="complete"></CustomTabPanel>
    </div>
  );
}

export default PatientAlerts;
