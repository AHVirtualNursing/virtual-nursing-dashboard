import DashboardSideBar from "@/components/DashboardSideBar";
import Header from "@/components/Header";
import { Box, Button } from "@mui/material";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import Image from "next/image";
import profilePic from "../../public/profilepic.jpg";
import { useEffect, useState } from "react";
import { fetchBedByBedId } from "./api/smartbed_api";
import { SmartBed } from "@/models/smartBed";
import VisualisationComponent from "@/components/visualisationComponent";
import dynamic from "next/dynamic";
const PatientChart = dynamic(
  () => import("@/components/patientAnalyticsChart/patientAnalyticsChart"),
  { ssr: false }
);

const patientVisualisationPage = () => {
  const router = useRouter();
  const { bedId } = router.query;
  const [selectedBed, setSelectedBed] = useState<SmartBed>();
  const [showPatientChartView, setShowPatientChartView] = useState(false);

  useEffect(() => {
    fetchBedByBedId(bedId).then((res) => setSelectedBed(res));
  }, [bedId]);

  const handleSideBarTabClick = (key: string) => {
    router.push(
      { pathname: "/dashboard", query: { state: key } },
      "/dashboard"
    );
  };

  function updateSelectedPatient() {
    router.push("/updatePatient?patientId=" + selectedBed?.patient?._id);
  }

  return (
    <div className="flex flex-col p-8 gap-8 bg-blue-100 w-full shadow-lg">
      <Box>
        <Box
          sx={{
            backgroundColor: "lightblue",
            display: "flex",
            border: 1,
            borderRadius: 3,
          }}>
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
              <p>Additional Info: {selectedBed?.patient?.addInfo} </p>
            </Box>
            <Box textAlign={"right"} marginRight={2}>
              <Button
                size="small"
                variant="contained"
                onClick={updateSelectedPatient}>
                Update Details
              </Button>
            </Box>
            <Box textAlign={"right"} marginRight={2} marginTop={2}>
              <Button
                size="small"
                variant="contained"
                onClick={() =>
                  setShowPatientChartView((prevState) => !prevState)
                }>
                {showPatientChartView ? "Visualisation View" : "Chart View"}
              </Button>
            </Box>
          </Box>
        </Box>
        {showPatientChartView ? (
          <PatientChart patient={selectedBed?.patient} />
        ) : (
          <VisualisationComponent patient={selectedBed?.patient} />
        )}
      </Box>
    </div>
  );
};

export default patientVisualisationPage;
