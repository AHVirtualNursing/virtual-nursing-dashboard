import { Patient } from "@/types/patient";
import React, { useState } from "react";
import PatientAlerts from "./PatientAlerts";
import PatientConfigs from "./PatientConfigs";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import EditNotificationsIcon from "@mui/icons-material/EditNotifications";

type PropType = {
  patient: Patient | undefined;
};

const AlertTabComponent = ({ patient }: PropType) => {
  const tabs = ["ALERTS", "ALERT CONFIGS"];
  const [selectedTab, setSelectedTab] = useState<number>(0);
  return (
    <div className="bg-white p-2 rounded-lg shadow-lg overflow-y-auto scrollbar">
      <div
        id="pageTabs"
        className="bg-blue-900 p-2 rounded-xl flex justify-between items-center gap-x-5"
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`bg-transparent flex items-center justify-center gap-x-2 border-none w-full p-2 rounded-xl text-center font-bold text-md ${
              selectedTab === index
                ? "ring-2 bg-white text-blue-600"
                : "text-white"
            }`}
            onClick={() => setSelectedTab(index)}
          >
            {tab == "ALERTS" && <NotificationImportantIcon />}
            {tab == "ALERT CONFIGS" && <EditNotificationsIcon />}
            {tab}
          </button>
        ))}
      </div>
      <div>
        {selectedTab === 0 && <PatientAlerts patient={patient} />}
        {selectedTab === 1 && <PatientConfigs patient={patient} />}
      </div>
    </div>
  );
};

export default AlertTabComponent;
