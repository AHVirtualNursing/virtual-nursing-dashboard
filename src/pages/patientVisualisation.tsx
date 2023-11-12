import { Box, Button, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import profilePic from "../../public/profilepic.jpg";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { fetchBedByBedId } from "./api/smartbed_api";
import { SmartBed } from "@/types/smartbed";
import VisualisationComponent from "@/components/patientOverviewTab/VisualisationComponent";
import dynamic from "next/dynamic";
import PatientReport from "@/components/patientReport/patientReport";
import AlertTabComponent from "@/components/patientAlertTab/AlertTabComponent";
import BedStatusComponent from "@/components/bedStatusTab/BedStatusComponent";
import { CloudUpload } from "@mui/icons-material";
import { VisuallyHiddenInput } from "@/styles/Components";
import { callUploadAndParseMockDataFromS3Api } from "./api/s3_api";
const PatientChart = dynamic(
  () => import("@/components/patientAnalyticsChart/patientAnalyticsChart"),
  { ssr: false }
);
import autoAnimate from "@formkit/auto-animate";
import { Patient } from "@/types/patient";
import { Ward } from "@/types/ward";

const patientVisualisationPage = () => {
  const router = useRouter();
  console.log("router query", router.query);
  const { patientId, bedId, viewAlerts } = router.query;
  const [selectedBed, setSelectedBed] = useState<SmartBed>();
  const [currentTab, setCurrentTab] = useState(
    viewAlerts === "true" ? "alerts" : "overview"
  );
  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);
  const [processingData, setProcessingData] = useState(false);

  useEffect(() => {
    fetchBedByBedId(bedId).then((res) => setSelectedBed(res));
  }, [bedId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  function updateSelectedPatient() {
    router.push(
      "/updatePatient?patientId=" + (selectedBed?.patient as Patient)?._id
    );
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] as File | undefined;

    if (file) {
      callUploadAndParseMockDataFromS3Api(file, patientId as string);
      setProcessingData(true);
    } else {
      setProcessingData(false);
    }
  };

  return (
    <div className="flex flex-col p-8 gap-8 bg-slate-100 w-full shadow-lg">
      <div className="flex flex-start">
        <h4>Patient Dashboard</h4>
      </div>
      <Box>
        <div className="flex bg-white mb-8 rounded-2xl shadow-lg">
          <Box className="p-4 text-center">
            <Image
              style={{
                width: "40%",
                height: "auto",
                borderRadius: "50%",
              }}
              src={profilePic}
              alt="Picture of Patient"
            />
            <h3>
              {(selectedBed?.patient as Patient)?.name} (
              {(selectedBed?.patient as Patient)?.nric})
            </h3>
          </Box>
          <Box style={{ width: "100%" }}>
            <Box display={"flex"} sx={{ paddingTop: "20px" }}>
              <p>
                Ward: {(selectedBed?.ward as Ward)?.wardNum}, Room:{" "}
                {selectedBed?.roomNum}, Bed: {selectedBed?.bedNum}
              </p>
            </Box>
            <Box textAlign={"left"}>
              <p>Condition: {(selectedBed?.patient as Patient)?.condition} </p>
            </Box>
            <Box textAlign={"right"} marginRight={2}>
              <button
                className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border-none"
                onClick={updateSelectedPatient}
              >
                Update Details
              </button>
            </Box>
            <Box textAlign={"right"} marginRight={2} marginTop={2}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUpload />}
              >
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                {processingData ? "Processing Data..." : "Upload Data"}
              </Button>
            </Box>
          </Box>
        </div>
        <div className="bg-white rounded-2xl shadow-lg" ref={parent}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            centered
            sx={{ marginBottom: 3, backgroundColor: undefined }}
          >
            <Tab value="overview" label="Overview" />
            <Tab value="analytics" label="Analytics" />
            <Tab value="alerts" label="Alerts" />
            <Tab value="reports" label="Reports" />
            <Tab value="bedstatus" label="Bed Status" />
          </Tabs>
          {currentTab === "overview" ? (
            <VisualisationComponent patient={selectedBed?.patient as Patient} />
          ) : currentTab === "analytics" ? (
            <PatientChart patient={selectedBed?.patient as Patient} />
          ) : currentTab === "reports" ? (
            <PatientReport patient={selectedBed?.patient as Patient} />
          ) : currentTab === "alerts" ? (
            <AlertTabComponent patient={selectedBed?.patient as Patient} />
          ) : currentTab === "bedstatus" ? (
            <BedStatusComponent bed={selectedBed} />
          ) : null}
        </div>
      </Box>
    </div>
  );
};

export default patientVisualisationPage;
