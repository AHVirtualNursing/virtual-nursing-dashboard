import { Box, Button, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import profilePic from "../../public/profilepic.jpg";
import { useEffect, useState } from "react";
import { fetchBedByBedId } from "./api/smartbed_api";
import { SmartBed } from "@/types/smartbed";
import VisualisationComponent from "@/components/patientOverviewTab/VisualisationComponent";
import dynamic from "next/dynamic";
import AlertTabComponent from "@/components/patientAlertTab/AlertTabComponent";
import BedStatusComponent from "@/components/bedStatusTab/BedStatusComponent";
const PatientChart = dynamic(
  () => import("@/components/patientAnalyticsChart/patientAnalyticsChart"),
  { ssr: false }
);

const patientVisualisationPage = () => {
  const router = useRouter();
  console.log("router query", router.query);
  const { bedId, viewAlerts } = router.query;
  const [selectedBed, setSelectedBed] = useState<SmartBed>();
  const [currentTab, setCurrentTab] = useState(
    viewAlerts === "true" ? "alerts" : "overview"
  );

  useEffect(() => {
    fetchBedByBedId(bedId).then((res) => setSelectedBed(res));
  }, [bedId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  function updateSelectedPatient() {
    router.push("/updatePatient?patientId=" + selectedBed?.patient?._id);
  }

  return (
    <div className="flex flex-col p-8 gap-8 bg-slate-100 w-full shadow-lg">
      <Box>
        <div className="flex bg-white mb-8 rounded-2xl shadow-lg">
          <Box sx={{ padding: "20px" }}>
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
              {selectedBed?.patient?.name} ({selectedBed?.patient?.nric})
            </h3>
          </Box>
          <Box style={{ width: "100%" }}>
            <Box display={"flex"} sx={{ paddingTop: "20px" }}>
              <p>
                Ward: {selectedBed?.ward.wardNum}, Room: {selectedBed?.roomNum},
                Bed: {selectedBed?.bedNum}
              </p>
            </Box>
            <Box textAlign={"left"}>
              <p>Condition: {selectedBed?.patient?.condition} </p>
              {/* <p>Additional Info: {selectedBed?.patient?.addInfo} </p> */}
            </Box>
            <Box textAlign={"right"} marginRight={2}>
              <button
                className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border-none"
                onClick={updateSelectedPatient}
              >
                Update Details
              </button>
            </Box>
          </Box>
        </div>
        <div className="bg-white rounded-2xl shadow-lg">
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
            <VisualisationComponent patient={selectedBed?.patient} />
          ) : currentTab === "analytics" ? (
            <PatientChart patient={selectedBed?.patient} />
          ) : currentTab === "reports" ? null : currentTab === "alerts" ? (
            <AlertTabComponent patient={selectedBed?.patient} />
          ) : currentTab === "bedstatus" ? (
            <BedStatusComponent bed={selectedBed} />
          ) : null}
        </div>
      </Box>
    </div>
  );
};

export default patientVisualisationPage;
