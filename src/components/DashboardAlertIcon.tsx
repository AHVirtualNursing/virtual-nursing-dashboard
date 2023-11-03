import React, { useEffect, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import { fetchAlertsByPatientId } from "@/pages/api/patients_api";
import { Alert } from "@/models/alert";
import Badge from "@mui/material/Badge";

type DashboardAlertIconProps = {
  patientId: string | undefined;
  socketData?: Alert | null;
};

const DashboardAlertIcon = ({
  patientId,
  socketData,
}: DashboardAlertIconProps) => {
  const [patientAlerts, setPatientAlerts] = useState<Alert[]>([]);
  useEffect(() => {
    fetchAlertsByPatientId(patientId).then((alerts) => {
      setPatientAlerts(alerts);
    });
  }, [socketData]);

  return (
    <div id="iconBadgeContainer" className="relative">
      <Badge
        badgeContent={patientAlerts && patientAlerts.length}
        color="primary"
      >
        <CampaignIcon style={{ color: "red" }} />
      </Badge>
    </div>
  );
};

export default DashboardAlertIcon;
