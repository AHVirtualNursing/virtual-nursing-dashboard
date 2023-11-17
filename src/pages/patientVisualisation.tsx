/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import profilePic from "../../public/profilepic.png";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { fetchBedByBedId } from "./api/smartbed_api";
import { SmartBed } from "@/types/smartbed";
import VisualisationComponent from "@/components/patientOverviewTab/VisualisationComponent";
import dynamic from "next/dynamic";
import PatientReport from "@/components/patientReport/PatientReports";
import AlertTabComponent from "@/components/patientAlertTab/AlertTabComponent";
import BedStatusComponent from "@/components/bedStatusTab/BedStatusComponent";
import { CloudUpload } from "@mui/icons-material";
import { VisuallyHiddenInput } from "@/styles/Components";
import { callUploadAndParseMockDataFromS3Api } from "./api/s3_api";
const PatientChart = dynamic(
  () => import("@/components/patientAnalyticsChart/PatientAnalyticsChart"),
  { ssr: false }
);
import autoAnimate from "@formkit/auto-animate";
import { Patient } from "@/types/patient";
import { Ward } from "@/types/ward";
import { SocketContext } from "./layout";

const PatientVisualisationPage = () => {
  const router = useRouter();
  console.log("router query", router.query);
  const { patientId, bedId, viewAlerts } = router.query;
  const [selectedBed, setSelectedBed] = useState<SmartBed>();
  const [socketData, setSocketData] = useState();

  const [currentTab, setCurrentTab] = useState(
    viewAlerts === "true" ? "alerts" : "overview"
  );
  const socket = useContext(SocketContext);

  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);
  const [processingData, setProcessingData] = useState(false);

  useEffect(() => {
    const handleUpdatedPatient = (data: any) => {
      console.log("updated patient", data);
      setSocketData(data);
    };
    socket.on("updatedPatient", handleUpdatedPatient);
    return () => {
      socket.off("updatedPatient", handleUpdatedPatient);
    };
  }, [socket]);

  useEffect(() => {
    fetchBedByBedId(bedId).then((res) => setSelectedBed(res));
  }, [bedId, socketData]);

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
    <div className="flex flex-col p-8 gap-5 bg-slate-100 w-full shadow-lg">
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
              {(selectedBed?.patient as Patient)?.nric.slice(5)})
            </h3>
          </Box>
          <Box style={{ width: "100%" }}>
            <Box
              display={"flex"}
              sx={{ paddingTop: "20px", justifyContent: "space-between" }}
            >
              <p>
                Ward: {(selectedBed?.ward as Ward)?.wardNum}, Room:{" "}
                {selectedBed?.roomNum}, Bed: {selectedBed?.bedNum}
              </p>
            </Box>

            <Box
              display={"flex"}
              sx={{ paddingTop: "20px", flexDirection: "column" }}
            >
              <div className="flex flex-col text-left">
                <p>Condition: {(selectedBed?.patient as Patient)?.condition}</p>
                <br />
                <p>
                  Additional Notes:
                  {(selectedBed?.patient as Patient)?.infoLogs[0]?.info}
                </p>
                <button
                  className={`${
                    (selectedBed?.patient as Patient)?.fallRisk === "High"
                      ? "bg-red-400"
                      : (selectedBed?.patient as Patient)?.fallRisk === "Medium"
                      ? "bg-orange-400"
                      : "bg-emerald-400"
                  } text-white font-bold p-1 border-none pointer-events-none mt-4 w-1/5`}
                >
                  Fall Risk: {(selectedBed?.patient as Patient)?.fallRisk}
                </button>
                <button className="pointer-events-none text-white font-bold p-1 border-none mr-4 bg-orange-400 mt-4 w-1/5">
                  Acuity Level: {(selectedBed?.patient as Patient)?.acuityLevel}
                </button>
              </div>
              <div></div>
            </Box>

            <Box textAlign={"right"} marginRight={2}></Box>
            <Box textAlign={"right"} marginRight={2}>
              <button
                className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border-none"
                onClick={updateSelectedPatient}
              >
                Update Details
              </button>
            </Box>
            <Box
              textAlign={"right"}
              marginRight={2}
              marginTop={2}
              marginBottom={2}
            >
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
            <PatientReport viewType="single" patientId={patientId as string} />
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

export default PatientVisualisationPage;
