import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Dashboard.module.css";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { useState } from "react";
import DashboardSideBar from "@/components/DashboardSideBar";
import Wards from "./wards";
import Patients from "./patients";
import Alerts from "./alerts";

const inter = Inter({ subsets: ["latin"] });

export default function Dashboard() {
  const router = useRouter();

  console.log(router.query);
  console.log(router.query["state"]);
  const [currentPage, setCurrentPage] =
    router.query["state"] === undefined
      ? useState("patients")
      : useState(router.query["state"]);

  const handleSideBarTabClick = (key: string) => {
    setCurrentPage(key);
  };

  return (
    <>
      <Head>
        <title>Virtual Nursing Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Header />
        <Box sx={{ display: "flex" }}>
          <DashboardSideBar handleSideBarTabClick={handleSideBarTabClick} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: "background.default",
              p: 3,
            }}
          >
            <Box>
              {currentPage === "patients" && <Patients />}
              {currentPage === "wards" && <Wards />}
              {currentPage === "alerts" && <Alerts />}
            </Box>
          </Box>
        </Box>
      </main>
    </>
  );
}
Dashboard.requireAuth = true;
