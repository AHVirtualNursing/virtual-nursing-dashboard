import React from "react";
import { ResponsiveContainer, PieChart, Pie } from "recharts";

const data = [
  {
    name: "Group A",
    value: 400,
  },
  {
    name: "Group B",
    value: 300,
  },
  {
    name: "Group C",
    value: 100,
  },
];

const PatientSummary = () => {
  return (
    <div className="flex flex-col w-1/2 p-4 gap-y-3">
      <h3 className="text-left">Patients Summary</h3>
      <div className="h-full flex gap-x-5 justify-start">
        <div className="w-full">
          <ResponsiveContainer>
            <PieChart width={400} height={400}>
              <Pie data={data} dataKey="value" nameKey="name" label />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PatientSummary;
