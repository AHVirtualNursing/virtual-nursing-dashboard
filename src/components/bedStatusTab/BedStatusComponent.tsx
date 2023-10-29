import { SmartBed } from "@/models/smartBed";
import React from "react";

interface BedProp {
  bed: SmartBed | undefined;
}

function BedStatusComponent(bedProp: BedProp) {
  console.log(bedProp.bed);
  return (
    <div className="px-20 space-y-8 pb-20">
      <div id="bed-photo">
        <img
          src="https://healthjade.net/wp-content/uploads/2020/02/Low-Fowler%E2%80%99s-position.jpg"
          alt="Patient on bed raised 15-30 degrees"
          className="object-contain w-96 h-48"
        />
      </div>
      <div id="bedrails" className="grid grid-cols-2 grid-rows-2 gap-4">
        <BedInfoCard
          id="left-upper"
          info={bedProp.bed?.railStatus.left.upper}
          displayMsg={["Up", "Down", "Upper Left Rail: "]}
        />
        <BedInfoCard
          id="right-upper"
          info={bedProp.bed?.railStatus.right.upper}
          displayMsg={["Up", "Down", "Upper Right Rail: "]}
        />
        <BedInfoCard
          id="left-lower"
          info={bedProp.bed?.railStatus.left.lower}
          displayMsg={["Up", "Down", "Lower Left Rail: "]}
        />
        <BedInfoCard
          id="right-lower"
          info={bedProp.bed?.railStatus.right.lower}
          displayMsg={["Up", "Down", "Lower Right Rail: "]}
        />
      </div>
      <BedInfoCard
        id="bed-brakes"
        info={bedProp.bed?.isBrakeSet}
        displayMsg={["Set", "Not Set", "Bed Brakes are: "]}
      />
      <BedInfoCard
        id="bed-alarm"
        info={!bedProp.bed?.bedAlarmTriggered}
        displayMsg={["Not Triggered", "Triggered", "Bed alarm is: "]}
      />
      <div id="bed-position" className="bg-blue-300 rounded-lg p-4">
        Bed Position is {bedProp.bed?.bedPosition}
      </div>
    </div>
  );
}

type BedInfoCardProps = {
  id: string;
  info: boolean | undefined;
  displayMsg: string[];
};

const BedInfoCard = ({ id, info, displayMsg }: BedInfoCardProps) => {
  return (
    <div
      id={id}
      className={`${info ? "bg-green-400" : "bg-red-400"} rounded-lg p-4`}
    >
      <p className="font-bold">{displayMsg[2]}</p>
      <p>{info ? displayMsg[0] : displayMsg[1]}</p>
    </div>
  );
};

export default BedStatusComponent;
