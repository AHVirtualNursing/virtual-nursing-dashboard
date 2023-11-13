import React, { useContext, useEffect, useState } from "react";
import WarningIcon from "@mui/icons-material/Warning";
import { updateProtocolBreachReason } from "@/pages/api/smartbed_api";
import { SmartBed } from "@/types/smartbed";
import { SocketContext } from "@/pages/layout";
import { fetchPatientByPatientId } from "@/pages/api/patients_api";
import { Patient } from "@/types/patient";

interface BedProp {
  bed: SmartBed | undefined;
}

const BedStatusComponent = ({ bed }: BedProp) => {
  const [fallRisk, setFallRisk] = useState<string | undefined>();
  const [reasonAdded, setReasonAdded] = useState<boolean>(false);
  const [inputReason, setInputReason] = useState<string>("");
  const [socketData, setSocketData] = useState();
  const socket = useContext(SocketContext);

  useEffect(() => {
    const handleUpdatedPatient = (data: any) => {
      console.log("updated patient", data);
      setSocketData(data);
    };

    const handleUpdatedSmartbed = (data: any) => {
      console.log("updated smartbed", data);
      setSocketData(data);
    };

    socket.on("updatedPatient", handleUpdatedPatient);
    socket.on("updatedSmartbed", handleUpdatedSmartbed);

    return () => {
      socket.off("updatedPatient", handleUpdatedPatient);
      socket.off("updatedSmartbed", handleUpdatedSmartbed);
    };
  }, [socket]);

  useEffect(() => {
    //fetch patient to set fall risk correctly
    fetchPatientByPatientId((bed?.patient as Patient)?._id).then((patient) =>
      setFallRisk(patient.fallRisk)
    );
  }, [bed?.patient, socketData]);

  const handleConfirm = () => {
    setReasonAdded(true);
    updateProtocolBreachReason(bed?._id, inputReason);
  };

  const BedAlarmWarning = () => {
    return (
      <>
        {fallRisk === "High" && !bed?.isBedExitAlarmOn && (
          <WarningIcon color={reasonAdded ? "warning" : "error"} />
        )}
      </>
    );
  };

  const ConfirmButton = () => {
    return (
      <>
        {fallRisk === "High" &&
          !bed?.isBedExitAlarmOn &&
          reasonAdded === false && (
            <button className="float-right p-1" onClick={handleConfirm}>
              Confirm
            </button>
          )}
      </>
    );
  };

  return (
    <div className="flex max-h-[470px] overflow-auto scrollbar p-2 gap-5">
      <div id="bed-image" className="flex-1 p-2">
        <div id="left-rails" className="flex gap-5 justify-evenly pt-4">
          <BedRailCard
            id="upper-left"
            info={bed?.isLeftUpperRail}
            rail="Left Upper"
          />
          <BedRailCard
            id="lower-left"
            info={bed?.isLeftLowerRail}
            rail="Left Lower"
          />
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bed_stock.png"
          alt="Patient lying in bed"
          loading="lazy"
          decoding="async"
          className="h-auto w-auto max-h-[300px] max-w-[300px]"
        />

        <div id="right-rails" className="flex gap-5 justify-evenly pb-4">
          <BedRailCard
            id="upper-right"
            info={bed?.isRightUpperRail}
            rail="Right Upper"
          />
          <BedRailCard
            id="lower-right"
            info={bed?.isRightLowerRail}
            rail="Right Lower"
          />
        </div>
        <div
          id="legend-green"
          className="flex gap-2 justify-center items-center text-sm p-3"
        >
          <div className="bg-emerald-400 w-4 h-4"></div>
          <p>Rail Up</p>
        </div>
        <div
          id="legend-orange"
          className="flex gap-2 justify-center items-center text-sm p-2"
        >
          <div className="bg-orange-400 w-4 h-4"></div>
          <p>Rail Down</p>
        </div>
      </div>
      <div id="bed-info" className="bg-white flex-1 space-y-4 p-2 text-left">
        <div className="bg-slate-200 font-bold p-2 rounded-lg uppercase">
          Fall Risk: {fallRisk}
        </div>
        <div className="bg-slate-200 font-bold p-2 rounded-lg uppercase">
          Bed Position: {bed?.bedPosition}
        </div>
        <div className="bg-slate-200 font-bold rounded-lg uppercase flex gap-x-10 px-2 py-1 items-center ">
          <p>
            Bed Lowest Position:{" "}
            {bed?.isLowestPosition ? "lowest" : "not lowest"}
          </p>
          {!bed?.isLowestPosition && <WarningIcon color="warning" />}
        </div>
        <div className="bg-slate-200 font-bold p-2 rounded-lg uppercase">
          Brake Wheels: {bed?.isBrakeSet ? "Locked" : "Not Locked"}
        </div>
        <div className="bg-slate-200 font-bold rounded-lg uppercase flex gap-x-10 px-2 py-1 items-center ">
          {/* - when fall risk high, bed alarm not turned on, red alert, input box and confirm appears
              - when VN inputs + confirm,  red warning turns orange
              - if bed alarm ON, or fall risk drop to medium/low, warning sign and input disappear
          */}
          <p>
            Bed Exit Alarm: {bed?.isBedExitAlarmOn ? "On" : "Not Turned On"}
          </p>
          <BedAlarmWarning />
        </div>
        {fallRisk === "High" && !bed?.isBedExitAlarmOn && (
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
        info ? "bg-emerald-400" : "bg-red-400"
      } rounded-lg py-3 px-10`}
    >
      <p>{rail}</p>
    </div>
  );
};

export default BedStatusComponent;
