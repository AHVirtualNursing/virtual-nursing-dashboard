import RuleConfigs from "@/components/RuleConfigs";
import VitalConfigs from "@/components/VitalConfigs";
import React, { useState } from "react";

function Configs() {
  const tabPages = [{ title: "Vitals" }, { title: "Rules" }];
  const vitalSelections = [
    { name: "Blood Pressure" },
    { name: "Heart Rate" },
    { name: "Saturation" },
    { name: "Temp" },
  ];
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedVital, setSelectedVital] = useState(0);

  return (
    <div className="flex flex-col p-8 gap-8 bg-slate-100 w-full shadow-lg">
      <div className="flex flex-start gap-8">
        <div
          id="pageTabs"
          className="bg-blue-900 p-2 rounded-xl flex justify-between items-center gap-x-5"
        >
          {tabPages.map((tab, index) => (
            <button
              key={index}
              className={`bg-transparent border-none w-full p-2 rounded-xl text-center font-bold text-lg ${
                selectedTab === index
                  ? "ring-2 bg-white text-blue-600"
                  : "text-white"
              }`}
              onClick={() => setSelectedTab(index)}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>
      <div className="flex h-full gap-6">
        {selectedTab === 0 && (
          <div
            id="sideVitalButtons"
            className="w-1/12 flex flex-col gap-y-5 pt-8 align-middle"
          >
            {vitalSelections.map((vital, index) => (
              <button
                className="bg-slate-200 rounded-xl p-5 justify-center flex shadow-inner border-b-2"
                key={index}
                onClick={() => setSelectedVital(index)}
              >
                {vital.name}
              </button>
            ))}
          </div>
        )}
        <div className={`${selectedTab === 0 ? "w-11/12" : "w-full"}`}>
          {selectedTab === 0 && <VitalConfigs />}
          {selectedTab === 1 && <RuleConfigs />}
        </div>
      </div>
    </div>
  );
}

export default Configs;
