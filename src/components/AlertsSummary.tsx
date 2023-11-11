import { Alert } from "@/types/alert";
import { fetchAllAlerts } from "@/pages/api/alerts_api";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
];

const AlertsSummary = () => {
  const [alerts, setAlerts] = useState<Alert[]>();

  useEffect(() => {
    fetchAllAlerts().then((alerts) => {
      setAlerts(alerts.data);
    });
  }, []);

  const alertsData = [
    {
      name: "Page B",
      open: alerts?.filter((alert) => alert.status === "open").length,
      handling: alerts?.filter((alert) => alert.status === "handling").length,
      completed: alerts?.filter((alert) => alert.status === "complete").length,
    },
  ];

  return (
    <div className="flex flex-col w-1/2 p-4 gap-y-3">
      <h3 className="text-left">Alerts Summary</h3>
      <div className="h-full flex gap-x-5">
        <div className="w-1/4 rounded-md bg-pink-200 flex items-center justify-center p-3">
          <p>Total: {alerts && alerts.length}</p>
        </div>
        <div className="w-3/4">
          <ResponsiveContainer width="80%" height="100%">
            <BarChart
              width={150}
              height={40}
              data={alertsData}
              maxBarSize={30}
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
