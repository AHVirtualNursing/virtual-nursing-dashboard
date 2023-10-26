import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface dataInterface {
  datetime: string;
  reading: number;
}

const colours: { [key: string]: string } = {
  rr: "rgb(255, 102, 102)",
  hr: "rgb(255, 178, 102)",
  bpSys: "rgb(76, 153, 0)",
  bpDia: "rgb(76, 153, 0)",
  tp: "rgb(102, 178, 255)",
  o2: "rgb(255, 102, 178)",
};

export default function LineChartComponent({
  data,
  vital,
}: {
  data: dataInterface[];
  vital: string;
}) {
  const lineColour = colours[vital];
  return (
    <ResponsiveContainer key={data.length}>
      <LineChart
        data={data}
        margin={{ top: 0, right: 20, bottom: 30, left: 0 }}
      >
        <Line
          type="monotone"
          dataKey="reading"
          stroke={lineColour}
          strokeWidth={3}
        />
        <CartesianGrid stroke="#ccc" strokeDasharray="1" />
        <XAxis dataKey="datetime"></XAxis>
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}
