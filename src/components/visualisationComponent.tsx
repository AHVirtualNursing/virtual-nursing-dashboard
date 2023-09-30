import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box, Grid, Tab, Tabs, Typography, styled } from "@mui/material";
import { DataGrid, GridRowModel } from "@mui/x-data-grid";
import { Patient } from "@/models/patient";

const ResponsiveGridLayout = WidthProvider(Responsive);
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const labels = ["9/9", "10/9", "11/9", "12/9", "13/9", "14/9", "15/9"];
const options = { maintainAspectRatio: false };
const respData = {
  labels,
  datasets: [
    {
      label: "Respiratory Rate",
      data: [61, 73, 89, 75, 61, 53, 99],
      borderColor: "rgb(255, 102, 102)",
      backgroundColor: "rgba(255, 102, 102, 0.5)",
    },
  ],
};

const heartData = {
  labels,
  datasets: [
    {
      label: "Heart Rate",
      data: [86, 94, 105, 91, 72, 95, 80],
      borderColor: "rgb(255, 178, 102)",
      backgroundColor: "rgba(255, 178, 102, 0.5)",
    },
  ],
};

const bpData = {
  labels,
  datasets: [
    {
      label: "Systolic",
      data: [121, 115, 102, 98, 130, 128, 86],
      borderColor: "rgb(178, 255, 102)",
      backgroundColor: "rgba(178, 255, 102, 0.5)",
    },
    {
      label: "Diastolic",
      data: [61, 73, 89, 75, 61, 53, 99],
      borderColor: "rgb(76, 153, 0)",
      backgroundColor: "rgba(76, 153, 0, 0.5)",
    },
  ],
};

const tempData = {
  labels,
  datasets: [
    {
      label: "Temperature",
      data: [36.7, 35.9, 38.9, 39.9, 40.0, 37.8, 36.5],
      borderColor: "rgb(102, 178, 255)",
      backgroundColor: "rgba(102, 178, 255, 0.5)",
    },
  ],
};

const spo2Data = {
  labels,
  datasets: [
    {
      label: "SpO2",
      data: [80, 90, 85, 80, 50, 40, 30],
      borderColor: "rgb(255, 102, 178)",
      backgroundColor: "rgba(255, 102, 178, 0.5)",
    },
  ],
};

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

  const defaultLayout = {
    lg: [
      { i: "rr", x: 0, y: 0, w: 4, h: 4, minW: 2, minH: 2 },
      { i: "hr", x: 4, y: 0, w: 4, h: 4, minW: 2, minH: 2 },
      { i: "o2", x: 8, y: 0, w: 4, h: 4, minW: 2, minH: 2 },
      { i: "bp", x: 0, y: 1, w: 4, h: 4, minW: 2, minH: 2 },
      { i: "tp", x: 4, y: 1, w: 4, h: 4, minW: 2, minH: 2 },
      { i: "alerts", x: 8, y: 1, w: 4, h: 4, minW: 3, minH: 3 },
    ],
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

  // const [savedLayout, setSavedLayout] = useState(defaultLayout);
  // const [currentLayout, setCurrentLayout] = useState(savedLayout);
  // const onLayoutChange = (newLayout) => {
  //   console.log("CHANGING LAYOUT, this is the current savedlayout");
  //   console.log(savedLayout);
  //   setSavedLayout(newLayout);
  //   console.log("new layout should match saved layout");
  //   console.log(newLayout);
  //   console.log(savedLayout);
  // };

  // useEffect(() => {
  //   console.log("TRIGGER USE EFFECT");
  //   setCurrentLayout(savedLayout);
  //   console.log(savedLayout);
  // }, [savedLayout]);

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={defaultLayout}
      // onLayoutChange={onLayoutChange}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={60}
    >
      <div key="rr">
        <Line options={options} data={respData} />
      </div>
      <div key="hr">
        <Line options={options} data={heartData} />
      </div>
      <div key="o2">
        <Line options={options} data={spo2Data} />
      </div>
      <div key="bp">
        <Line options={options} data={bpData} />
      </div>
      <div key="tp">
        <Line options={options} data={tempData} />
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
