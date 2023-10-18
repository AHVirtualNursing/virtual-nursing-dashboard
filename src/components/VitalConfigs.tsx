import React from "react";
import RangeSlider from "./RangeSlider";

function VitalConfigs() {
  return (
    <div className="h-full flex flex-col gap-y-3">
      <h4 className="flex flex-start">Patient Details</h4>
      <div className="bg-white rounded-2xl h-1/6 p-4 flex shadow-lg gap-3 justify-start align-middle"></div>
      <h4 className="flex flex-start">Ranges</h4>
      <div className="bg-white rounded-2xl p-6 h-4/6 shadow-lg">
        <RangeSlider min={60} max={90} label="diastolic" />
        <RangeSlider min={60} max={90} label="systolic" />
        <RangeSlider min={60} max={90} label="pulse" />
      </div>
    </div>
  );
}

export default VitalConfigs;
