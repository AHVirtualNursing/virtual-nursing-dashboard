import React from "react";
import {
  BarChart,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Label,
  LabelList,
} from "recharts";

const data = [
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
];

export default function PendingFollowUps() {
  return (
    <div className="flex flex-col w-1/2 p-4 gap-y-3">
      <h3 className="text-left">Pending Follow Ups</h3>
      <div className="h-full flex gap-x-5">
        <div className="w-1/4 rounded-md bg-pink-200 flex items-center justify-center p-3">
          <p>Total: 140</p>
        </div>
        <div className="w-3/4">
          <ResponsiveContainer width="80%" height="100%">
            <BarChart
              width={150}
              height={40}
              data={data}
              maxBarSize={30}
              layout="vertical"
            >
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" hide />
              <Bar
                dataKey="uv"
                fill="#7F94DA"
                background={{
                  radius: 20,
                  height: 15,
                }}
                radius={[10, 10, 10, 10]}
              >
                <LabelList dataKey={"uv"} position={"center"} fill="black" />
              </Bar>
              <Bar
                dataKey="pv"
                fill="#82ca9d"
                background={{
                  radius: 20,
                  height: 15,
                }}
                radius={[10, 10, 10, 10]}
              >
                <LabelList dataKey={"pv"} position={"center"} fill="black" />
              </Bar>
              <Bar
                dataKey="amt"
                fill="#ffc658"
                background={{
                  radius: 20,
                  height: 15,
                }}
                radius={[10, 10, 10, 10]}
              >
                <LabelList dataKey={"amt"} position={"center"} fill="black" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
