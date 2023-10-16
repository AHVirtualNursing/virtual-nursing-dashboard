import PendingFollowUps from "@/components/PendingFollowUps";
import React from "react";

function Configs() {
  return (
    <div className="flex flex-col p-8 gap-8 bg-blue-100 w-full shadow-lg">
      <h4 className="flex flex-start">Conditions</h4>
      <div className="bg-white rounded-2xl h-1/2 p-4 flex shadow-lg "></div>
      <h4 className="flex flex-start">Actions</h4>
      <div className="bg-white rounded-2xl h-1/2 p-3 shadow-lg"></div>
    </div>
  );
}

export default Configs;
