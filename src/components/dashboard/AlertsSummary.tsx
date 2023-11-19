import { Alert } from "@/types/alert";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Ward } from "@/types/ward";
import { fetchAlertsByWardId } from "@/pages/api/wards_api";

type AlertsSummaryProps = {
  selectedWard: string;
  selectedTime: string;
  wards: Ward[];
};

const AlertsSummary = ({
  selectedWard,
  selectedTime,
  wards,
}: AlertsSummaryProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // fetch all alerts of patients in selected ward, then filter by selected time
  useEffect(() => {
    let wardsToView: Ward[] = [],
      wardAlertsPromises: any[] = [];
    if (selectedWard === "") {
      wardsToView = wards;
    } else {
      wardsToView = wards.filter((ward) => ward.wardNum === selectedWard);
    }

    wardAlertsPromises = wardsToView.map((ward) =>
      fetchAlertsByWardId(ward._id)
    );

    Promise.all(wardAlertsPromises).then((result) => {
      const alerts: Alert[] = [].concat(...result);
      // filter by time
      selectedTime === ""
        ? setAlerts(alerts)
        : setAlerts(
            alerts.filter(
              (alert: Alert) =>
                alert.createdAt.replace("T", " ").substring(0, 10) ===
                new Date().toISOString().slice(0, 10)
            )
          );
    });
  }, [selectedTime, selectedWard, wards]);

  const alertsData = [
    {
      name: "Alerts",
      open: alerts?.filter((alert) => alert.status === "open").length,
      handling: alerts?.filter((alert) => alert.status === "handling").length,
      completed: alerts?.filter((alert) => alert.status === "complete").length,
    },
  ];

  return (
    <div className="flex flex-col w-1/2 p-4 gap-y-4 align-middle">
      <h4 className="text-left">Alerts Summary</h4>
      <div className="h-full flex gap-x-5">
        <div className="w-1/6 rounded-md bg-pink-200 flex flex-col gap-y-3 items-center justify-center p-3">
          <p className="font-sans text-6xl">{alerts && alerts.length}</p>
          <p className="">Total Alerts</p>
        </div>
        <div className="w-3/4">
          <ResponsiveContainer width="80%" height="90%">
            <BarChart
              width={100}
              height={40}
              data={alertsData}
              maxBarSize={20}
              layout="vertical"
            >
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" hide />
              <Bar
                dataKey="open"
                fill="#FF7373"
                background={{
                  radius: 20,
                  height: 15,
                }}
                radius={[10, 10, 10, 10]}
                label={{ fill: "black", fontSize: 10 }}
              />
              <Bar
                dataKey="handling"
                fill="#ffc658"
                background={{
                  radius: 20,
                  height: 15,
                }}
                radius={[10, 10, 10, 10]}
                label={{ fill: "black", fontSize: 10 }}
              />
              <Bar
                dataKey="completed"
                fill="#82ca9d"
                background={{
                  radius: 20,
                  height: 15,
                }}
                radius={[10, 10, 10, 10]}
                label={{ fill: "black", fontSize: 10 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AlertsSummary;
