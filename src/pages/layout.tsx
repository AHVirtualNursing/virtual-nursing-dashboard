import Head from "next/head";
import React from "react";
import { Inter } from "next/font/google";
import styles from "@/styles/Dashboard.module.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function Dashboardlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Head>
        <title>Virtual Nursing Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <Header />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Sidebar />
        {children}
      </main>
    </div>
  );
}
