import React, { useEffect, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import { fetchAlertsByPatientId } from "@/pages/api/patients_api";
import { Alert } from "@/models/alert";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

type DashboardAlertIconProps = {
  patientId: string | undefined;
};

const DashboardAlertIcon = ({ patientId }: DashboardAlertIconProps) => {
  const [patientAlerts, setPatientAlerts] = useState<Alert[]>([]);
  const [alertsList, setAlertsList] = useState<Alert[]>([]);
  const { data: sessionData } = useSession();
  useEffect(() => {
    const socket = io("http://localhost:3001");
    const nurseId = sessionData?.user.id;
    socket.emit("alertConnections", nurseId);
    socket.on("patientAlertAdded", (data: any) => {
      setAlertsList(data);
    });
    socket.on("patientAlertDeleted", (data) => {
      setAlertsList(data);
    });
    fetchAlertsByPatientId(patientId).then((alerts) => {
      setPatientAlerts(alerts);
    });
    return () => {
      socket.close();
    };
  }, [alertsList.length]);

  return (
    <td className="w-1/12 text-center">
      <div id="iconBadgeContainer" className="relative">
        <CampaignIcon style={{ color: "red" }} />
        <div className="absolute text-xs top-[-10px] left-[75px] border-solid border-2 border-slate-100 bg-slate-100">
          {patientAlerts && patientAlerts.length}
        </div>
      </div>
    </td>
  );
};

export default DashboardAlertIcon;
