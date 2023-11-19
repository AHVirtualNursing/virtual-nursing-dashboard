/* eslint-disable react-hooks/rules-of-hooks */
import { Alert, Box, Button, Snackbar, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import profilePic from "../../public/profilepic.png";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { fetchBedByBedId } from "./api/smartbed_api";
import { SmartBed } from "@/types/smartbed";
import VisualisationComponent from "@/components/patientOverviewTab/VisualisationComponent";
import dynamic from "next/dynamic";
import PatientReport from "@/components/patientReport/patientReports";
import AlertTabComponent from "@/components/patientAlertTab/AlertTabComponent";
import BedStatusComponent from "@/components/bedStatusTab/BedStatusComponent";
import { CloudUpload } from "@mui/icons-material";
import { VisuallyHiddenInput } from "@/styles/Components";
import { callUploadAndParseMockDataFromS3Api } from "./api/s3_api";
import EditNoteIcon from "@mui/icons-material/EditNote";
const PatientChart = dynamic(
  () => import("@/components/patientAnalyticsChart/patientAnalyticsChart"),
  { ssr: false }
);
import autoAnimate from "@formkit/auto-animate";
import { Patient } from "@/types/patient";
import { Ward } from "@/types/ward";
import { SocketContext } from "./layout";
import { Vital } from "@/types/vital";
import { getVitalByPatientId } from "./api/patients_api";
import PatientInfoModal from "@/components/PatientInfoModal";

const PatientVisualisationPage = () => {
  const router = useRouter();
  console.log("router query", router.query);
  const { patientId, bedId, viewAlerts } = router.query;
  const [selectedBed, setSelectedBed] = useState<SmartBed>();
  const [socketData, setSocketData] = useState();
  const [patientVital, setPatientVital] = useState<Vital>();
  const [shown, setShown] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
    getVitalByPatientId(patientId).then((res) => {
      console.log("vital", res);
    });
  }, [bedId, socketData, patientId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  function updateSelectedPatient() {
    router.push(
      "/updatePatient?patientId=" + (selectedBed?.patient as Patient)?._id
    );
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] as File | undefined;

    if (file) {
      setProcessingData(true);

      try {
        const res = await callUploadAndParseMockDataFromS3Api(
          file,
          patientId as string
        );
        if (res === 200) {
          setSnackbarSeverity("success");
          setSnackbarMessage("File uploaded and processed successfully!");
          setProcessingData(false);
          setOpenSnackbar(true);
        } else {
          console.error("error");
          setSnackbarSeverity("error");
          setSnackbarMessage(`Error uploading and processing file`);
          setOpenSnackbar(true);
          setProcessingData(false);
        }
      } catch (error) {
        console.error(error);
        setSnackbarSeverity("error");
        setSnackbarMessage(`Error uploading and processing file`);
        setOpenSnackbar(true);
        setProcessingData(false);
      }
    } else {
      setProcessingData(false);
    }
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      {shown && (
        <PatientInfoModal
          pressed={shown}
          setShown={setShown}
          infoLogs={(selectedBed?.patient as Patient)?.infoLogs}
        />
      )}
      <div className="flex flex-col p-8 gap-5 bg-slate-100 w-full shadow-lg">
        <div className="flex flex-start">
          <h4>Patient Dashboard</h4>
        </div>
        <Box>
          <div className="flex bg-white mb-8 rounded-2xl shadow-lg p-4 gap-x-4">
            <div id="basic-info" className="bg-white space-y-3 left-0">
              <Image
                style={{
                  width: "30%",
                  height: "40%",
                  // borderRadius: "50%",
                }}
                src={profilePic}
                alt="Picture of Patient"
              />
              <h4>
                {(selectedBed?.patient as Patient)?.name} (
                {(selectedBed?.patient as Patient)?.nric})
              </h4>
              <p className="font-bold">
                Ward: {(selectedBed?.ward as Ward)?.wardNum}, Room:{" "}
                {selectedBed?.roomNum}, Bed: {selectedBed?.bedNum}
              </p>
              <div className="flex justify-center gap-x-3">
                <p className="text-slate-500">Condition:</p>
                <p>{(selectedBed?.patient as Patient)?.condition}</p>
              </div>
              <div className="flex justify-center gap-x-3">
                <p className="text-slate-500">Admission:</p>
                <p>
                  {" "}
                  {(selectedBed?.patient as Patient)?.admissionDateTime
                    ?.toString()
                    .replace("T", " ")
                    .substring(0, 16)}
                </p>
              </div>
            </div>
            <div id="data-col" className="flex flex-col gap-y-4 py-2 grow mr-7">
              <div className="p-2 flex justify-between rounded-lg shadow-lg bg-slate-100">
                <p>Fall Risk</p>
                <p
                  className={`${
                    (selectedBed?.patient as Patient)?.fallRisk === "High"
                      ? "text-red-400"
                      : (selectedBed?.patient as Patient)?.fallRisk === "Medium"
                      ? "text-orange-400"
                      : "text-emerald-400"
                  } uppercase font-extrabold`}
                >
                  {(selectedBed?.patient as Patient)?.fallRisk}
                </p>
              </div>

              <div className="p-2 flex justify-between rounded-lg shadow-lg bg-slate-100">
                <p>Acuity Level</p>
                <p className="font-semibold">
                  {(selectedBed?.patient as Patient)?.acuityLevel}
                </p>
              </div>

              <div className="p-2 flex justify-between rounded-lg shadow-lg bg-slate-100">
                <p>O2 Intake</p>
                <p className="font-semibold uppercase">
                  {(selectedBed?.patient as Patient)?.o2Intake}
                </p>
              </div>

              <div className="p-2 flex justify-between rounded-lg shadow-lg bg-slate-100">
                <p>Consciousness</p>
                <p className="font-semibold uppercase">
                  {(selectedBed?.patient as Patient)?.consciousness}
                </p>
              </div>

              <div className="p-2 flex justify-between rounded-lg shadow-lg bg-slate-100">
                <p>NEWS2 Score</p>
                <p className="font-semibold uppercase">
                  {patientVital?.news2Score
                    ? patientVital?.news2Score[0]?.reading
                    : "-"}
                </p>
              </div>
            </div>

            <div id="details" className="bg-white flex">
              <div
                id="buttons-col"
                className="flex flex-col-reverse py-5 gap-y-4 "
              >
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUpload />}
                >
                  {/* <button className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 pr-4 rounded-full border-none">
                  <div className="flex items-center justify-center gap-x-3">
                    <CloudUpload fontSize="small" /> */}
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileChange}
                  />
                  {processingData ? "Processing Data..." : "Upload Data"}
                  {/* </div> */}
                </Button>
                <button
                  className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 pr-1 rounded-full border-none"
                  onClick={updateSelectedPatient}
                >
                  <div className="flex items-center justify-center gap-x-3">
                    <EditNoteIcon fontSize="small" />
                    Update Details
                  </div>
                </button>
                <button
                  className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border-none"
                  onClick={() => setShown(true)}
                >
                  View Additional Notes
                </button>
              </div>
            </div>
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
              <VisualisationComponent
                patient={selectedBed?.patient as Patient}
              />
            ) : currentTab === "analytics" ? (
              <PatientChart patient={selectedBed?.patient as Patient} />
            ) : currentTab === "reports" ? (
              <PatientReport
                viewType="single"
                patientId={patientId as string}
              />
            ) : currentTab === "alerts" ? (
              <AlertTabComponent patient={selectedBed?.patient as Patient} />
            ) : currentTab === "bedstatus" ? (
              <BedStatusComponent bed={selectedBed} />
            ) : null}
          </div>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </div>
    </>
  );
};

export default PatientVisualisationPage;
