import React from "react";
import {
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LabelList,
  Label,
} from "recharts";

const data = [
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
];

const PatientSummary = () => {
  return (
    <div className="flex flex-col w-1/2 p-4 gap-y-3">
      <h3 className="text-left">Patients Summary</h3>
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
              <Bar
                dataKey="uv"
                fill="#8884d8"
                radius={10}
                isAnimationActive={false}
                label={{ fill: "black", fontSize: 10 }}
              />
              <Bar
                dataKey="pv"
                fill="#ffc658"
                radius={10}
                label={{ fill: "black", fontSize: 10 }}
              />
              <Bar
                dataKey="amt"
                fill="#82ca9d"
                radius={10}
                label={{ fill: "black", fontSize: 10 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PatientSummary;
