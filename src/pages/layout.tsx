import Head from "next/head";
import React, { createContext, useEffect } from "react";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Socket, io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { redelegateAlert } from "./api/alerts_api";

const inter = Inter({ subsets: ["latin"] });
const socket = io("http://localhost:3001");
export const SocketContext = createContext<Socket>(socket);
const SocketProvider = ({ children }: any) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: sessionData } = useSession();
  const nurseId = sessionData?.user.id;

  const AlertToast = ({ message }: any) => (
    <div>
      <p>{message}</p>
    </div>
  );

  const RedelegatedToast = ({ message, alertId }: any) => {
    const handleRedelegateClick = () => {
      redelegateAlert(alertId)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return (
      <div>
        <p>{message}</p>
        <button onClick={handleRedelegateClick}>Redelegate</button>
      </div>
    );
  };

  useEffect(() => {
    socket.emit("clientConnections", nurseId);
    const handleAlertIncoming = (data: any) => {
      console.log(data);
      console.log(data.patient);
      console.log(data.alert);
      if (data.alert.redelegate) {
        const message = `${data.patient.name}: ${data.alert.description}`;
        toast.error(
          <RedelegatedToast message={message} alertId={data.alert._id} />
        );
        // call api to redelegate alert :D
      } else {
        const message = `${data.patient.name}: ${data.alert.description}`;
        toast.warning(<AlertToast message={message} />);
      }
    };

    const dischargePatientToast = (data: any) => {
      console.log("toasting discharge patient");
      const message = `${data.name} has been discharged.`;
      toast.info(<AlertToast message={message} />);
    };

    socket.on("alertIncoming", handleAlertIncoming);
    socket.on("dischargePatient", dischargePatientToast);
    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("alertIncoming", handleAlertIncoming);
      socket.off("dischargePatient", dischargePatientToast);
    };
  }, [nurseId]);

  return (
    <SocketProvider>
      <div>
        <Head>
          <title>Virtual Nursing Dashboard</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ToastContainer
          position="bottom-right"
          autoClose={false}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover
          theme="light"
        />
        <Header />
        <Sidebar />
        <main
          className={`${inter.className} text-center flex ml-20 min-h-[calc(100vh-85px)]`}
        >
          {children}
        </main>
      </div>
    </SocketProvider>
  );
}
