import { useEffect, useState } from "react";
import { getDateTime } from "../patientAnalyticsChart/utils";
import { fetchAlertConfigByPatientId } from "@/pages/api/alertConfigs_api";
import { AlertConfig } from "@/types/alertConfig";
interface dataInterface {
  datetime: string;
  reading: number;
  patientId: string;
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
  patientId,
}: {
  data: dataInterface[];
  vital: string;
  patientId: string | undefined;
}) {
  const [alertConfig, setAlertConfig] = useState<AlertConfig>();

  useEffect(() => {
    fetchAlertConfigByPatientId(patientId).then((res) =>
      setAlertConfig(res?.data)
    );
  }, []);

  function getColour(reading: number | number[], configType: string) {
    let config: number[] = [];
    if (alertConfig) {
      if (configType == "rr") {
        config = alertConfig.rrConfig;
      } else if (configType == "hr") {
        config = alertConfig.hrConfig;
      } else if (configType == "bpSys") {
        config = alertConfig.bpSysConfig;
      } else if (configType == "bpDia") {
        config = alertConfig.bpDiaConfig;
      } else if (configType == "spo2") {
        config = alertConfig.spO2Config;
      } else if (configType == "temp") {
        config = alertConfig.temperatureConfig;
      }
      if (
        (reading as number) <= config[0] ||
        (reading as number) >= config[1]
      ) {
        return "text-red-400";
      } else {
        return "text-neutral-950";
      }
    }
  }
  return (
    <div>
      {data.length > 0 ? (
        <div>
          <h3>{vitals[vital][0]}</h3>
          <div className="flex items-center justify-center">
            <h1
              className={`${getColour(data[data.length - 1].reading, vital)}`}
            >
              {data[data.length - 1]?.reading}
            </h1>
            <p className={`${getColour(data[data.length - 1].reading, vital)}`}>
              {vitals[vital][1]}
            </p>
          </div>
        </div>
      ) : null}

      {data.length > 0 ? (
        <p>
          Last logged at
          {getDateTime(new Date(data[data.length - 1]?.datetime))}
        </p>
      ) : null}
    </div>
  );
}
