import React from "react";

function VitalConfigs() {
  return (
    <div className="h-full flex flex-col gap-y-3">
      <h4 className="flex flex-start">Timing</h4>
      <div className="bg-white rounded-2xl h-1/6 p-4 flex shadow-lg "></div>
      <h4 className="flex flex-start">Ranges</h4>
      <div className="bg-white rounded-2xl p-3 h-4/6 shadow-lg"></div>
    </div>
  );
}

export default VitalConfigs;
