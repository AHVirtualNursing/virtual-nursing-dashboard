import { getDateTime } from "../patientAnalyticsChart/utils";
interface dataInterface {
  datetime: string;
  reading: number;
}

const vitals: { [key: string]: string[] } = {
  rr: ["Respiratory Rate", "bpm"],
  hr: ["Heart Rate", "bpm"],
  bpSys: ["Blood Pressure Systolic", "mmHg"],
  bpDia: ["Blood Pressure Diastolic", "mmHg"],
  temp: ["Temperature", "°C"],
  spo2: ["SpO2", "%"],
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
      {data.length > 0 ? (
        <div>
          <h3>{vitals[vital][0]}</h3>
          <div className="flex items-center justify-center">
            <h1>{data[data.length - 1]?.reading}</h1>
            <p>{vitals[vital][1]}</p>
          </div>
        </div>
      ) : null}

      {data.length > 0 ? (
        <p className="py-40">
          Last logged at{" "}
          {getDateTime(new Date(data[data.length - 1]?.datetime))}
        </p>
      ) : null}
    </div>
  );
}
