import React, { useEffect, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import { fetchAlertsByPatientId } from "@/pages/api/patients_api";
import { Alert } from "@/types/alert";
import HotelIcon from "@mui/icons-material/Hotel";

type DashboardAlertIconProps = {
  patientId: string | undefined;
  socketData?: Alert[] | null;
};

const DashboardAlertIcon = ({
  patientId,
  socketData,
}: DashboardAlertIconProps) => {
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
  }, [socketData, patientId]);

  return (
    <div id="iconBadgeContainer" className="relative">
      {lastVitalAlert && lastVitalAlert.status === "open" ? (
        <CampaignIcon style={{ color: "red" }} />
      ) : null}

      {lastVitalAlert && lastVitalAlert.status === "handling" ? (
        <CampaignIcon style={{ color: "orange" }} />
      ) : null}

      {lastBedAlert && lastBedAlert.status === "open" ? (
        <HotelIcon style={{ color: "red" }} />
      ) : null}

      {lastBedAlert && lastBedAlert.status === "handling" ? (
        <HotelIcon style={{ color: "orange" }} />
      ) : null}
    </div>
  );
};

export default DashboardAlertIcon;
