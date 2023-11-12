import { Vital } from "@/types/vital";
import React from "react";

type VitalProps = {
  data: Vital;
  cardLayout: CardLayout | undefined;
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

const VitalTiles = ({ data, cardLayout }: VitalProps) => {
  // console.log(data);

  return (
    <div className="flex justify-around mt-2">
      {cardLayout?.hr ? (
        <div className="flex-1 bg-slate-200 border-solid border-2 rounded-2xl mx-2">
          <p>HR</p>
          <p>
            {data && data.heartRate.length > 0
              ? data.heartRate[data.heartRate.length - 1].reading
              : "-"}
          </p>
        </div>
      ) : null}
      {cardLayout?.rr ? (
        <div className="flex-1 bg-slate-200 border-solid border-2 rounded-2xl mx-2">
          <p>RR</p>
          <p>
            {data && data.respRate.length > 0
              ? data.respRate[data.respRate.length - 1].reading
              : "-"}
          </p>
        </div>
      ) : null}
      {cardLayout?.bp ? (
        <div className="flex-1 bg-slate-200 border-solid border-2 rounded-2xl mx-2">
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
        <div className="flex-1 bg-slate-200 border-solid border-2 rounded-2xl mx-2">
          <p>SPO2</p>
          <p>
            {data && data.spO2.length > 0
              ? data.spO2[data.spO2.length - 1].reading
              : "-"}
          </p>
        </div>
      ) : null}
      {cardLayout?.temp ? (
        <div className="flex-1 bg-slate-200 border-solid border-2 rounded-2xl mx-2">
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
