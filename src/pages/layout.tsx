import Head from "next/head";
import React from "react";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Head>
        <title>Virtual Nursing Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Sidebar />
      <main
        className={`${inter.className} flex text-center ml-20 min-h-[calc(100vh-85px)]`}
      >
        {children}
      </main>
    </div>
  );
}
