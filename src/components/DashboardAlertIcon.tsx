import React, { useEffect, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import { fetchAlertsByPatientId } from "@/pages/api/patients_api";
import { Alert } from "@/types/alert";
import Badge from "@mui/material/Badge";

type DashboardAlertIconProps = {
  patientId: string | undefined;
  socketData?: Alert[] | null;
};

const DashboardAlertIcon = ({
  patientId,
  socketData,
}: DashboardAlertIconProps) => {
  const [patientAlerts, setPatientAlerts] = useState<Alert[]>([]);
  useEffect(() => {
    if (socketData == null) {
      fetchAlertsByPatientId(patientId).then((alerts) => {
        setPatientAlerts(alerts);
      });
    } else {
      console.log("setting socketData for alertIcon");
      setPatientAlerts(socketData);
    }
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
