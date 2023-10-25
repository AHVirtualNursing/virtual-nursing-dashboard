import React from "react";
import RangeSlider from "../RangeSlider";

const PatientConfigs = () => {
  return (
    <div className="p-4 space-y-2 flex flex-col">
      <h3 className="text-left">Thresholds</h3>
      <RangeSlider
        min={0}
        max={200}
        lowerBound={80}
        upperBound={180}
        label="Heart Rate"
      />
      <RangeSlider
        min={0}
        max={100}
        lowerBound={94}
        upperBound={100}
        label="SP02"
      />
      <RangeSlider
        min={0}
        max={200}
        lowerBound={80}
        upperBound={120}
        label="Systolic"
      />
      <RangeSlider
        min={0}
        max={150}
        lowerBound={60}
        upperBound={80}
        label="Diastolic"
      />
      <div>
        <button className=" float-right bg-blue-900 text-white rounded-lg border-none p-3 font-bold text-md">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PatientConfigs;
