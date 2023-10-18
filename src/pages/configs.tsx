import PendingFollowUps from "@/components/PendingFollowUps";
import React, { useState } from "react";

function Configs() {
  const tabPages = [{ title: "Vitals" }, { title: "Rules" }];
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="flex flex-col p-8 gap-8 bg-blue-100 w-full shadow-lg">
      <div className="flex flex-row flex-start gap-10">
        <div className="bg-blue-400 p-2  rounded-xl flex justify-between items-center gap-x-5 ">
          {tabPages.map((item, index) => (
            <button
              key={index}
              className={`bg-transparent border-none w-full p-2 rounded-xl text-center font-bold text-lg text-white ${
                selectedTab === index ? "ring-2 bg-white text-blue-600" : ""
              }`}
              onClick={() => setSelectedTab(index)}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
      <h4 className="flex flex-start">Conditions</h4>
      <div className="bg-white rounded-2xl h-1/2 p-4 flex shadow-lg "></div>
      <h4 className="flex flex-start">Actions</h4>
      <div className="bg-white rounded-2xl h-1/2 p-3 shadow-lg"></div>
    </div>
  );
}

export default Configs;
