import { Vital } from "@/models/vital";
import React from "react";

type VitalProps = {
  data: Vital;
};

const VitalTiles = ({ data }: VitalProps) => {
  console.log(data);

  return (
    <div className="flex justify-between mt-2">
      <div className="w-1/5 bg-red-400 rounded-2xl mx-2">
        <p>HR</p>
        <p>
          {data && data.heartRate.length > 0
            ? data.heartRate[data.heartRate.length - 1].reading
            : "-"}
        </p>
      </div>
      <div className="w-1/5 bg-orange-400 rounded-2xl mx-2">
        <p>RR</p>
        <p>
          {data && data.respRate.length > 0
            ? data.respRate[data.respRate.length - 1].reading
            : "-"}
        </p>
      </div>
      <div className="w-1/5 bg-amber-400 rounded-2xl mx-2">
        <p>BP</p>
        <p>
          {data &&
          data.bloodPressureDia.length > 0 &&
          data.bloodPressureSys.length > 0
            ? data.bloodPressureSys[data.bloodPressureSys.length - 1].reading +
              "/" +
              data.bloodPressureDia[data.bloodPressureDia.length - 1].reading
            : "-"}
        </p>
      </div>
      <div className="w-1/5 bg-lime-400 rounded-2xl mx-2">
        <p>SPO2</p>
        <p>
          {data && data.spO2.length > 0
            ? data.spO2[data.spO2.length - 1].reading
            : "-"}
        </p>
      </div>
      <div className="w-1/5 bg-teal-400 rounded-2xl mx-2">
        <p>TEMP</p>
        <p>
          {data && data.temperature.length > 0
            ? data.temperature[data.temperature.length - 1].reading
            : "-"}
        </p>
      </div>
    </div>
  );
};

export default VitalTiles;
