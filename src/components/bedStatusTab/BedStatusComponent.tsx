import { SmartBed } from "@/models/smartBed";
import React, { useState } from "react";
import WarningIcon from "@mui/icons-material/Warning";
import { updateProtocolBreachReason } from "@/pages/api/smartbed_api";

interface BedProp {
  bed: SmartBed | undefined;
}

const BedStatusComponent = (bedProp: BedProp) => {
  const [fallRisk, setFallRisk] = useState<string>("high");
  const [reasonAdded, setReasonAdded] = useState<boolean>(false);
  const [inputReason, setInputReason] = useState<string>("");

  const { bed } = bedProp;

  const handleConfirm = () => {
    setReasonAdded(true);
    updateProtocolBreachReason(bed?._id, inputReason);
  };

  const BedAlarmWarning = () => {
    return (
      fallRisk === "high" &&
      !bed?.isBedAlarmOn && (
        <WarningIcon color={reasonAdded ? "warning" : "error"} />
      )
    );
  };

  const ConfirmButton = () => {
    return (
      fallRisk === "high" &&
      !bed?.isBedAlarmOn &&
      reasonAdded === false && (
        <button className="float-right p-1" onClick={handleConfirm}>
          Confirm
        </button>
      )
    );
  };

  return (
    <div className="flex max-h-[470px] overflow-auto scrollbar p-2 gap-5">
      <div id="bed-image" className="flex-1 p-2">
        <div id="left-rails" className="flex gap-5 justify-evenly pt-4">
          <BedRailCard
            id="upper-left"
            info={bedProp.bed?.isLeftUpperRail}
            rail="Upper Left"
          />
          <BedRailCard
            id="lower-left"
            info={bedProp.bed?.isLeftLowerRail}
            rail="Lower Left"
          />
        </div>

        <img src="/bed_stock.png" alt="Patient lying in bed" />

        <div id="right-rails" className="flex gap-5 justify-evenly pb-4">
          <BedRailCard
            id="upper-right"
            info={bedProp.bed?.isRightUpperRail}
            rail="Upper Right"
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
        <div className="bg-slate-200 font-bold rounded-lg uppercase flex gap-x-10 px-2 py-1 items-center ">
          <p>
            Bed Alarm: {bedProp.bed?.isLowestPosition ? "lowest" : "not lowest"}
          </p>
          {!bedProp.bed?.isLowestPosition && <WarningIcon color="warning" />}
        </div>
        <div className="bg-slate-200 font-bold p-2 rounded-lg uppercase">
          Brake Wheels: {bedProp.bed?.isBrakeSet ? "Locked" : "Not Locked"}
        </div>
        <div className="bg-slate-200 font-bold rounded-lg uppercase flex gap-x-10 px-2 py-1 items-center ">
          {/* - when fall risk high, bed alarm not turned on, red alert, input box and confirm appears
              - when VN inputs + confirm,  red warning turns orange
              - if bed alarm ON, or fall risk drop to medium/low, warning sign and input disappear
          */}
          <p>Bed Alarm: {bedProp.bed?.isBedAlarmOn ? "On" : "Not Turned On"}</p>
          <BedAlarmWarning />
        </div>
        {fallRisk === "high" && !bed?.isBedAlarmOn && (
          <textarea
            value={inputReason}
            name="reason-input"
            placeholder="Please input reason for protocol breach"
            className=" focus:border-red-400 p-1 w-full"
            disabled={reasonAdded ? true : false}
            onChange={(event) => setInputReason(event.target.value)}
          />
        )}
        <ConfirmButton />
      </div>
    </div>
  );
};

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