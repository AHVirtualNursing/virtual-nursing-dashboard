import React, { useEffect, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import { fetchAlertsByPatientId } from "@/pages/api/patients_api";
import { Alert } from "@/models/alert";

type DashboardAlertIconProps = {
  patientId: string | undefined;
};

const DashboardAlertIcon = ({ patientId }: DashboardAlertIconProps) => {
  const [patientAlerts, setPatientAlerts] = useState<Alert[]>([]);
  useEffect(() => {
    // const eventSource = new EventSource(
    //   `http://localhost:3001/patient/${patientId}/alerts`
    // );
    // eventSource.addEventListener("alert", (event) => {
    //   const result = JSON.parse(event.data);
    //   console.log(result)
    //   setPatientAlerts(result);
    // });
    // return () => {
    //   eventSource.close();
    // };
    fetchAlertsByPatientId(patientId).then((alerts) => {
      console.log("patient alerts", alerts);
      setPatientAlerts(alerts);
    });
  }, [patientAlerts.length]);

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
