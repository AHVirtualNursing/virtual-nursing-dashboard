import { Patient } from "@/types/patient";
import { ModalBoxStyle } from "@/styles/StyleTemplates";
import {
  Box,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormLabel,
  Input,
  Modal,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface PatientReportProps {
  patient?: Patient;
}

interface OverviewSection {
  heartRate: boolean;
  bloodPressure: boolean;
  spO2: boolean;
  temperature: boolean;
  respRate: boolean;
}

interface AnalyticsSection {
  heartRate: boolean;
  bloodPressure: boolean;
  spO2: boolean;
  temperature: boolean;
  respRate: boolean;
}

interface ReportDetails {
  name: string;
  overview: OverviewSection;
  analytics: AnalyticsSection;
}

export default function PatientReport({ patient }: PatientReportProps) {
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);
  const [currentModalTab, setCurrentModalTab] = useState("overview");
  const [reportDetails, setReportDetails] = useState<ReportDetails>({
    name: patient?.name + " Report",
    overview: {
      heartRate: false,
      bloodPressure: false,
      spO2: false,
      temperature: false,
      respRate: false,
    },
    analytics: {
      heartRate: false,
      bloodPressure: false,
      spO2: false,
      temperature: false,
      respRate: false,
    },
  });

  const handleOpenCreateReportModal = () => {
    setShowCreateReportModal(true);
  };

  const handleCloseCreateReportModal = () => {
    setShowCreateReportModal(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentModalTab(newValue);
  };

  const handleReportDetailsChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const nameParts = name.split(".");
    console.log(nameParts);
    if (nameParts.length === 1) {
      setReportDetails({ ...reportDetails, [name]: value });
    } else if (nameParts.length === 2) {
      const [parent, nestedAttribute] = nameParts;
      setReportDetails({
        ...reportDetails,
        [parent]: {
          // @ts-ignore
          ...reportDetails[parent],
          [nestedAttribute]: value,
        },
      });
      console.log(reportDetails);
    }
  };

  const vitalCheckboxes = (tab: "overview" | "analytics") => {
    return (
      <FormGroup id="vitals">
        <FormLabel
          sx={{ display: "flex", alignItems: "center", marginRight: 2 }}
          component="legend"
        >
          Vitals
        </FormLabel>
        <FormControlLabel
          control={
            <Checkbox
              name={tab + ".heartRate"}
              checked={reportDetails[tab].heartRate}
              onChange={handleReportDetailsChange}
            />
          }
          label="Heart Rate"
        />
        <FormControlLabel
          control={
            <Checkbox
              name={tab + ".spO2"}
              checked={reportDetails[tab].spO2}
              onChange={handleReportDetailsChange}
            />
          }
          label="Blood Oxygen"
        />
        <FormControlLabel
          control={
            <Checkbox
              name={tab + ".bloodPressure"}
              checked={reportDetails[tab].bloodPressure}
              onChange={handleReportDetailsChange}
            />
          }
          label="Blood Pressure"
        />
        <FormControlLabel
          control={
            <Checkbox
              name={tab + ".temperature"}
              checked={reportDetails[tab].temperature}
              onChange={handleReportDetailsChange}
            />
          }
          label="Temperature"
        />
        <FormControlLabel
          control={
            <Checkbox
              name={tab + ".respRate"}
              checked={reportDetails[tab].respRate}
              onChange={handleReportDetailsChange}
            />
          }
          label="Respiratory Rate"
        />
      </FormGroup>
    );
  };

  return (
    <Box>
      <Button variant="contained" onClick={handleOpenCreateReportModal}>
        Create Report
      </Button>
      <Modal
        open={showCreateReportModal}
        onClose={handleCloseCreateReportModal}
      >
        <Box sx={ModalBoxStyle}>
          <Input
            placeholder="Name of Report"
            name="name"
            value={reportDetails.name}
            onChange={handleReportDetailsChange}
            sx={{ marginBottom: 2 }}
          />
          <Typography>
            Select the charts to add to the patient report.
          </Typography>
          <Tabs
            value={currentModalTab}
            onChange={handleTabChange}
            centered
            sx={{ marginBottom: 3, backgroundColor: undefined }}
          >
            <Tab value="overview" label="Overview" />
            <Tab value="analytics" label="Analytics" />
            <Tab value="alerts" label="Alerts" />
          </Tabs>

          {
            currentModalTab === "overview"
              ? vitalCheckboxes("overview")
              : currentModalTab === "analytics"
              ? vitalCheckboxes("analytics")
              : currentModalTab === "alerts"
              ? null
              : null // to add alerts page
          }
          <Box textAlign="right">
            <Button variant="contained">Create Report</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
