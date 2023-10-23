import DashboardSideBar from "@/components/DashboardSideBar";
import Header from "@/components/Header";
import { Box, Button } from "@mui/material";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import styles from "@/styles/Dashboard.module.css";
import Image from "next/image";
import profilePic from "../../public/profilepic.jpg";
import { useEffect, useState } from "react";
import { fetchBedByBedId } from "./api/smartbed_api";
import { SmartBed } from "@/models/smartBed";
import { Patient } from "@/models/patient";
import VisualisationComponent from "@/components/VisualisationComponent";

const inter = Inter({ subsets: ["latin"] });

const patientVisualisationPage = () => {
  const router = useRouter();
  const { patientId, bedId } = router.query;

  const handleSideBarTabClick = (key: string) => {
    router.push(
      { pathname: "/dashboard", query: { state: key } },
      "/dashboard"
    );
  };

  const [selectedBed, setSelectedBed] = useState<SmartBed>();

  useEffect(() => {
    fetchBedByBedId(bedId).then((res) => setSelectedBed(res));
  }, [bedId]);

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
              <p>Additional Info: {selectedBed?.patient?.addInfo} </p>
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
        <VisualisationComponent patient={selectedBed?.patient} />
      </Box>
    </div>
  );
};

export default patientVisualisationPage;
