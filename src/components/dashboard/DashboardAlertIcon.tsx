import React, { useContext, useEffect, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import { fetchAlertsByPatientId } from "@/pages/api/patients_api";
import { Alert } from "@/types/alert";
import HotelIcon from "@mui/icons-material/Hotel";
import { SocketContext } from "@/pages/layout";

type DashboardAlertIconProps = {
  patientId: string | undefined;
  socketData?: Alert[] | null;
};

const DashboardAlertIcon = ({
  patientId,
  socketData,
}: DashboardAlertIconProps) => {
  const socket = useContext(SocketContext);
  const [sock, setSock] = useState();
  const [lastVitalAlert, setLastVitalAlert] = useState<Alert>();
  const [lastBedAlert, setLastBedAlert] = useState<Alert>();
  useEffect(() => {
    if (socketData == null) {
      fetchAlertsByPatientId(patientId).then((alerts) => {
        const vitalAlerts = alerts.filter(
          (alert: Alert) => alert.alertType === "Vital"
        );
        const bedAlerts = alerts.filter(
          (alert: Alert) => alert.alertType === "SmartBed"
        );
        setLastVitalAlert(vitalAlerts[vitalAlerts.length - 1]);
        setLastBedAlert(bedAlerts[bedAlerts.length - 1]);
      });
    } else {
      const vitalAlerts = socketData.filter(
        (alert: Alert) => alert.alertType === "Vital"
      );
      const bedAlerts = socketData.filter(
        (alert: Alert) => alert.alertType === "SmartBed"
      );
      setLastVitalAlert(vitalAlerts[vitalAlerts.length - 1]);
      setLastBedAlert(bedAlerts[bedAlerts.length - 1]);
    }
  }, [socketData, patientId, sock]);

  useEffect(() => {
    const handleAlertUpdate = (data: any) => {
      setSock(data);
    };

    socket.on("updatedAlert", handleAlertUpdate);
    return () => {
      socket.on("updatedAlert", handleAlertUpdate);
    };
  }, []);

  return (
    <div id="iconBadgeContainer" className="flex">
      {lastVitalAlert && lastVitalAlert.status === "open" ? (
        <CampaignIcon
          style={{ color: "red", paddingRight: "10px", fontSize: "40" }}
        />
      ) : null}

      {lastVitalAlert && lastVitalAlert.status === "handling" ? (
        <CampaignIcon
          style={{ color: "orange", paddingRight: "10px", fontSize: "40" }}
        />
      ) : null}

      {lastBedAlert && lastBedAlert.status === "open" ? (
        <HotelIcon
          style={{ color: "red", paddingLeft: "10px", fontSize: "40" }}
        />
      ) : null}

      {lastBedAlert && lastBedAlert.status === "handling" ? (
        <HotelIcon
          style={{ color: "orange", paddingLeft: "10px", fontSize: "40" }}
        />
      ) : null}
    </div>
  );
};

export default DashboardAlertIcon;
