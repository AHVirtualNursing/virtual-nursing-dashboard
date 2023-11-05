import { SmartBed } from "@/models/smartBed";
import React from "react";
import ManIcon from "@mui/icons-material/Man";
import WarningIcon from "@mui/icons-material/Warning";

interface BedProp {
  bed: SmartBed | undefined;
}

function BedStatusComponent(bedProp: BedProp) {
  return (
    <div className="flex max-h-[470px] overflow-auto scrollbar p-2 gap-5">
      <div id="bed-image" className="flex-1 p-2">
        <div id="upper-rails" className="flex gap-5 justify-evenly pt-4">
          <BedRailCard
            id="upper-left"
            info={bedProp.bed?.isLeftUpperRail}
            rail="Upper Left"
          />
          <BedRailCard
            id="upper-right"
            info={bedProp.bed?.isRightUpperRail}
            rail="Upper Right"
          />
        </div>
        <ManIcon
          sx={{
            fontSize: "200px",
            transform: "rotate(-90deg)",
          }}
        />
        <div id="lower-rails" className="flex gap-5 justify-evenly pb-4">
          <BedRailCard
            id="lower-left"
            info={bedProp.bed?.isLeftLowerRail}
            rail="Lower Left"
          />
          <BedRailCard
            id="lower-right"
            info={bedProp.bed?.isRightLowerRail}
            rail="Lower Right"
          />
        </div>
        <div
          id="legend-green"
          className="flex gap-2 justify-center items-center text-sm p-3"
        >
          <div className="bg-green-400 w-4 h-4"></div>
          <p>Rail Up / Patient Present</p>
        </div>
        <div
          id="legend-orange"
          className="flex gap-2 justify-center items-center text-sm p-2"
        >
          <div className="bg-orange-400 w-4 h-4"></div>
          <p>Rail Down / Patient Absent</p>
        </div>
      </div>
      <div id="bed-info" className="bg-white flex-1 space-y-4 p-2 text-left">
        <div className="bg-slate-200 font-bold p-2 rounded-lg uppercase">
          Bed Position: {bedProp.bed?.bedPosition}
        </div>
        <div className="bg-slate-200 font-bold p-2 rounded-lg uppercase">
          Bed Height: {bedProp.bed?.isLowestPosition ? "Lowest" : "Not Lowest"}
        </div>
        <div className="bg-slate-200 font-bold p-2 rounded-lg uppercase">
          Brake Wheels: {bedProp.bed?.isBrakeSet ? "Locked" : "Not Locked"}
        </div>
        <div className="bg-slate-200 font-bold rounded-lg uppercase flex gap-x-10 px-2 py-1 items-center ">
          <p>
            Bed Alarm: {bedProp.bed?.bedAlarmTriggered ? "On" : "Not Turned On"}
          </p>
          <WarningIcon />
        </div>
        <textarea
          placeholder="Please input reason for protocol breach"
          className=" focus:border-red-400 p-1 w-full"
        />
        <button className="float-right p-1">Confirm</button>
      </div>
    </div>
  );
}

type BedRailCardProps = {
  id: string;
  info: boolean | undefined;
  rail: string;
};

const BedRailCard = ({ id, info, rail }: BedRailCardProps) => {
  return (
    <div
      id={id}
      className={`${
        info ? "bg-green-400" : "bg-orange-400"
      } rounded-lg py-3 px-10`}
    >
      <p>{rail}</p>
    </div>
  );
};

export default BedStatusComponent;
