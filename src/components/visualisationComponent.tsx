import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Box, Grid, Tab, Tabs, Typography, styled } from "@mui/material";
import { DataGrid, GridRowModel } from "@mui/x-data-grid";
import { Patient } from "@/models/patient";
import { updatePatientLayoutByPatientId } from "@/pages/api/patients_api";
import { Layouts } from "react-grid-layout";
import { Layout } from "react-grid-layout";
import LineChartComponent from "./lineChart";

const ResponsiveGridLayout = WidthProvider(Responsive);

const alertColumns = [
  { field: "id", headerName: "ID" },
  { field: "status", headerName: "Status" },
  { field: "description", headerName: "Description" },
  { field: "notes", headerName: "Notes" },
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

interface TabPanelProps {
  status: string;
  index: number;
  value: number;
}

interface ComponentProp {
  patient: Patient | undefined;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function VisualisationComponent(prop: ComponentProp) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function getAlerts(status: string) {
    const listOfAlerts: GridRowModel[] = [];
    if (prop.patient?.alerts !== undefined) {
      for (let i = 0; i < prop.patient.alerts.length; i++) {
        if (prop.patient.alerts[i].status == status) {
          listOfAlerts.push({
            status: prop.patient.alerts[i].status,
            description: prop.patient.alerts[i].description,
            notes: prop.patient.alerts[i].notes,
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
              {prop.patient?.alerts?.length != undefined &&
              getAlerts(status).length > 0 ? (
                <Box>
                  <StyledDataGrid
                    aria-label="Alerts"
                    columns={alertColumns}
                    rows={getAlerts(status)}
                    autoHeight
                    rowHeight={100}
                    getRowClassName={(params) => `alert-${params.row.status}`}
                    sx={{
                      "& .MuiDataGrid-cellContent": {
                        whiteSpace: "normal !important",
                        wordWrap: "break-word !important",
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

  const [retrieveLayout, setLayouts] = useState(prop.patient?.layout);

  const onLayoutChange = (_: Layout[], allLayouts: Layouts) => {
    updatePatientLayoutByPatientId(prop?.patient?._id, allLayouts);
  };

  useEffect(() => {
    setLayouts(prop.patient?.layout);
  }, [prop.patient?.layout]);

  const [data, setData] = useState([
    { timestamp: "t1", reading: 61 },
    { timestamp: "t2", reading: 73 },
    { timestamp: "t3", reading: 89 },
    { timestamp: "t4", reading: 75 },
    { timestamp: "t5", reading: 61 },
    { timestamp: "t6", reading: 53 },
    { timestamp: "t7", reading: 99 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((previousData) => {
        const newData = previousData.slice(1);
        const currDate = new Date();
        const hours = currDate.getHours().toString().padStart(2, "0");
        const minutes = currDate.getMinutes().toString().padStart(2, "0");
        const seconds = currDate.getSeconds().toString().padStart(2, "0");
        const random = Math.floor(60 + Math.random() * (160 - 60 + 1));
        return [
          ...newData,
          {
            timestamp: `${hours}:${minutes}:${seconds}`,
            reading: random,
          },
        ];
      });
    }, 5000);

    return () => clearInterval(interval);
  });

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={retrieveLayout}
      onLayoutChange={onLayoutChange}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={60}
    >
      <div key="rr">
        <LineChartComponent data={data} vital="rr" />
      </div>
      <div key="hr">
        <LineChartComponent data={data} vital="hr" />
      </div>
      <div key="o2">
        <LineChartComponent data={data} vital="o2" />
      </div>
      <div key="bp">
        <LineChartComponent data={data} vital="bp" />
      </div>
      <div key="tp">
        <LineChartComponent data={data} vital="tp" />
      </div>
      <div key="alerts">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <h3>Alerts</h3>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Open" {...a11yProps(0)} />
            <Tab label="Handling" {...a11yProps(1)} />
            <Tab label="Completed" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} status="open"></CustomTabPanel>
        <CustomTabPanel
          value={value}
          index={1}
          status="handling"
        ></CustomTabPanel>
        <CustomTabPanel
          value={value}
          index={2}
          status="complete"
        ></CustomTabPanel>
      </div>
    </ResponsiveGridLayout>
  );
}
