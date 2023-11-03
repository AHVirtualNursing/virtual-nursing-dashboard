import React, { useEffect, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import { fetchAlertsByPatientId } from "@/pages/api/patients_api";
import { Alert } from "@/models/alert";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import Badge from "@mui/material/Badge";

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
    socket.on("patientAlertAdded", (data: Alert[]) => {
      setAlertsList(data.filter((alert) => alert.status === "open"));
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
    <div id="iconBadgeContainer" className="relative">
      <Badge badgeContent={patientAlerts.length} color="primary">
        <CampaignIcon style={{ color: "red" }} />
      </Badge>
    </div>
  );
};

export default DashboardAlertIcon;
