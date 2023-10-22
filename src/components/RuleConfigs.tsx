import React from "react";

function RuleConfigs() {
  return (
    <div className="flex flex-col h-full gap-y-2">
      <h4 className="flex flex-start">Conditions</h4>
      <div className="bg-white rounded-2xl h-1/2 p-4 flex shadow-lg "></div>
      <h4 className="flex flex-start">Actions</h4>
      <div className="bg-white rounded-2xl h-1/2 p-4 shadow-lg"></div>
    </div>
  );
}

export default RuleConfigs;
