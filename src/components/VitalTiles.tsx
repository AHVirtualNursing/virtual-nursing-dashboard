import { fetchAlertConfigByPatientId } from "@/pages/api/alertConfigs_api";
import { AlertConfig } from "@/types/alertConfig";
import { Patient } from "@/types/patient";
import { Vital } from "@/types/vital";
import React, { useEffect, useState } from "react";

type VitalProps = {
  data: Vital;
  cardLayout: CardLayout | undefined;
  patient: Patient | undefined;
};

interface CardLayout {
  [key: string]: boolean;
  allVitals: boolean;
  hr: boolean;
  rr: boolean;
  spo2: boolean;
  bp: boolean;
  temp: boolean;
  news2: boolean;
  allBedStatuses: boolean;
  rail: boolean;
  warnings: boolean;
  weight: boolean;
  fallRisk: boolean;
}

const VitalTiles = ({ data, cardLayout, patient }: VitalProps) => {
  const [patientConfig, setPatientConfig] = useState<AlertConfig>();

  useEffect(() => {
    if (patientConfig === undefined) {
      fetchAlertConfigByPatientId(patient?._id).then((res) => {
        setPatientConfig(res?.data);
      });
    }
    // console.log(patientConfig);
  }, [patientConfig]);

  function getColour(reading: number | number[], configType: string) {
    let config: number[] = [];
    let bpsys: number[] = [];
    if (patientConfig) {
      if (configType == "rr") {
        config = patientConfig.rrConfig;
      } else if (configType == "hr") {
        config = patientConfig.hrConfig;
      } else if (configType == "bp") {
        config = patientConfig.bpDiaConfig;
        bpsys = patientConfig.bpSysConfig;
      } else if (configType == "sp") {
        config = patientConfig.spO2Config;
      } else if (configType == "temp") {
        config = patientConfig.temperatureConfig;
      }
      // console.log(bpsys);
      // console.log(config);
      // console.log(reading);
      if (bpsys.length > 0) {
        if (
          ((reading as number[])[0] <= bpsys[0] ||
            (reading as number[])[0] >= bpsys[1]) &&
          ((reading as number[])[1] <= config[0] ||
            (reading as number[])[1] >= config[1])
        ) {
          return "bg-red-400";
        } else {
          return "bg-emerald-400";
        }
      } else {
        if (
          (reading as number) <= config[0] ||
          (reading as number) >= config[1]
        ) {
          return "bg-red-400";
        } else {
          return "bg-emerald-400";
        }
      }
    }
  }

  return (
    <div className="flex justify-around mt-2">
      {cardLayout?.hr ? (
        <div
          className={`flex-1 rounded-2xl mx-2 ${
            data && data.heartRate.length > 0
              ? getColour(
                  data.heartRate[data.heartRate.length - 1].reading,
                  "hr"
                )
              : "bg-slate-200"
          }`}
        >
          <p>HR</p>
          <p>
            {data && data.heartRate.length > 0
              ? data.heartRate[data.heartRate.length - 1].reading
              : "-"}
          </p>
        </div>
      ) : null}
      {cardLayout?.rr ? (
        <div
          className={`flex-1 rounded-2xl mx-2 ${
            data && data.respRate.length > 0
              ? getColour(data.respRate[data.respRate.length - 1].reading, "rr")
              : "bg-slate-200"
          }`}
        >
          <p>RR</p>
          <p>
            {data && data.respRate.length > 0
              ? data.respRate[data.respRate.length - 1].reading
              : "-"}
          </p>
        </div>
      ) : null}
      {cardLayout?.bp ? (
        <div
          className={`flex-1 bg-emerald-400 rounded-2xl mx-2 ${
            data &&
            data.bloodPressureDia.length > 0 &&
            data.bloodPressureSys.length > 0
              ? getColour(
                  [
                    data.bloodPressureDia[data.bloodPressureSys.length - 1]
                      .reading,
                    data.bloodPressureSys[data.bloodPressureDia.length - 1]
                      .reading,
                  ],
                  "bp"
                )
              : "bg-slate-200"
          }`}
        >
          <p>BP</p>
          <p>
            {data &&
            data.bloodPressureDia.length > 0 &&
            data.bloodPressureSys.length > 0
              ? data.bloodPressureSys[data.bloodPressureSys.length - 1]
                  .reading +
                "/" +
                data.bloodPressureDia[data.bloodPressureDia.length - 1].reading
              : "-"}
          </p>
        </div>
      ) : null}
      {cardLayout?.spo2 ? (
        <div
          className={`flex-1 bg-emerald-400 rounded-2xl mx-2 ${
            data && data.spO2.length > 0
              ? getColour(data.spO2[data.spO2.length - 1].reading, "sp")
              : "bg-slate-200"
          }`}
        >
          <p>SPO2</p>
          <p>
            {data && data.spO2.length > 0
              ? data.spO2[data.spO2.length - 1].reading
              : "-"}
          </p>
        </div>
      ) : null}
      {cardLayout?.temp ? (
        <div
          className={`flex-1 bg-emerald-400 rounded-2xl mx-2 ${
            data && data.temperature.length > 0
              ? getColour(
                  data.temperature[data.temperature.length - 1].reading,
                  "temp"
                )
              : "bg-slate-200"
          }`}
        >
          <p>TEMP</p>
          <p>
            {data && data.temperature.length > 0
              ? data.temperature[data.temperature.length - 1].reading
              : "-"}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default VitalTiles;
