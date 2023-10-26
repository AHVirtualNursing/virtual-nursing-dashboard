interface dataInterface {
  datetime: string;
  reading: number;
}

const vitals: { [key: string]: string } = {
  rr: "Respiratory Rate",
  hr: "Heart Rate",
  bpSys: "Blood Pressure Systolic",
  bpDia: "Blood Pressure Diastolic",
  tp: "Temperature",
  o2: "SpO2",
};

export default function LastUpdatedVital({
  data,
  vital,
}: {
  data: dataInterface[];
  vital: string;
}) {
  return (
    <div>
      <h3>{vitals[vital]}</h3>
      <div>
        <h1>{data[data.length - 1].reading}</h1>
        <p>bpm</p>
      </div>
      <p>Last logged at {data[data.length - 1].datetime}</p>
    </div>
  );
}
