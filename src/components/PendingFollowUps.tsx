import React from "react";
import {
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
];

export default function PendingFollowUps() {
  return (
    <div className="flex flex-col w-1/2 p-4 gap-y-3">
      <h3 className="text-left">Patients</h3>
      <div className="h-full flex gap-x-5 justify-start">
        <div className="w-full">
          <ResponsiveContainer width="80%" height="100%">
            <BarChart width={150} height={40} data={data} barCategoryGap="10%">
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                  paddingLeft: "30px",
                }}
              />
              <XAxis dataKey="name" type="category" hide />
              <YAxis type="number" hide />
              <Bar dataKey="uv" fill="#8884d8" radius={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
