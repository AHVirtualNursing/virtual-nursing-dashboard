import React, { useContext, useEffect, useState } from "react";
import WarningIcon from "@mui/icons-material/Warning";
import ReportIcon from "@mui/icons-material/Report";
import {
  fetchBedByBedId,
  updateProtocolBreachReason,
} from "@/pages/api/smartbed_api";
import { SmartBed } from "@/types/smartbed";
import { SocketContext } from "@/pages/layout";
import { fetchPatientByPatientId } from "@/pages/api/patients_api";
import { Patient } from "@/types/patient";

interface BedProp {
  bed: SmartBed | undefined;
}

const BedStatusComponent = ({ bed }: BedProp) => {
  const [fallRisk, setFallRisk] = useState<string | undefined>();
  const [currBed, setCurrBed] = useState<SmartBed>();
  const [reasonAdded, setReasonAdded] = useState<boolean>(false);
  const [inputReason, setInputReason] = useState<string | undefined>("");
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
    fetchBedByBedId(bed?._id).then((bed: SmartBed) => {
      setCurrBed(bed);
      setInputReason(bed?.bedAlarmProtocolBreachReason);
    });
  }, [bed?.patient, socketData, bed?._id]);

  const handleConfirm = () => {
    setReasonAdded(true);
    updateProtocolBreachReason(currBed?._id, inputReason as string);
  };

  const BedAlarmWarning = () => {
    return (
      <>
        {fallRisk === "High" &&
          !currBed?.isBedExitAlarmOn &&
          // <WarningIcon
          //   style={{
          //     color:
          //       reasonAdded || currBed?.bedAlarmProtocolBreachReason
          //         ? "orange"
          //         : "red",
          //   }}
          // />
          (reasonAdded || currBed?.bedAlarmProtocolBreachReason ? (
            <ReportIcon color="warning" />
          ) : (
            <WarningIcon color="error" />
          ))}
      </>
    );
  };

  const ConfirmButton = () => {
    return (
      <>
        {fallRisk === "High" &&
          !currBed?.isBedExitAlarmOn &&
          !currBed?.bedAlarmProtocolBreachReason &&
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
            info={currBed?.isLeftUpperRail}
            rail="Left Upper"
          />
          <BedRailCard
            id="lower-left"
            info={currBed?.isLeftLowerRail}
            rail="Left Lower"
          />
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bed_stock.png"
          alt="Patient lying in bed"
          loading="lazy"
          decoding="async"
          className="object-contain w-full max-h-[600px] max-w-[600px]"
          style={{
            filter: currBed?.isPatientOnBed ? "" : "grayscale(100%)",
            backgroundColor: currBed?.isPatientOnBed
              ? ""
              : "rgba(255, 0, 0, 0.5)",
          }}
        />

        <div id="right-rails" className="flex gap-5 justify-evenly pb-4">
          <BedRailCard
            id="upper-right"
            info={currBed?.isRightUpperRail}
            rail="Right Upper"
          />
          <BedRailCard
            id="lower-right"
            info={currBed?.isRightLowerRail}
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
          Bed Position: {currBed?.bedPosition}
        </div>
        <div className="bg-slate-200 font-bold rounded-lg uppercase flex gap-x-10 px-2 py-1 items-center ">
          Bed Lowest Position:{" "}
          {currBed?.isLowestPosition ? "lowest" : "not lowest"}
          {!currBed?.isLowestPosition && (
            <WarningIcon style={{ color: "orange" }} />
          )}
        </div>
        <div className="bg-slate-200 font-bold rounded-lg uppercase flex gap-x-10 px-2 py-1 items-center ">
          Bed Brakes: {currBed?.isBrakeSet ? "Set" : "Not Set"}
          {!currBed?.isBrakeSet && <WarningIcon style={{ color: "orange" }} />}
        </div>
        <div className="bg-slate-200 font-bold rounded-lg uppercase flex gap-x-10 px-2 py-1 items-center ">
          {/* - when fall risk high, bed alarm not turned on, red alert, input box and confirm appears
              - when VN inputs + confirm,  red warning turns orange
              - if bed alarm ON, or fall risk drop to medium/low, warning sign and input disappear
          */}
          <p>
            Bed Exit Alarm: {currBed?.isBedExitAlarmOn ? "On" : "Not Turned On"}
          </p>
          <BedAlarmWarning />
        </div>
        {fallRisk === "High" && !currBed?.isBedExitAlarmOn && (
          <textarea
            value={inputReason}
            name="reason-input"
            placeholder="Please input reason for protocol breach"
            className=" focus:border-red-400 p-1 w-full"
            disabled={
              reasonAdded || currBed?.bedAlarmProtocolBreachReason
                ? true
                : false
            }
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
        info ? "bg-emerald-400" : "bg-orange-400"
      } rounded-lg py-3 px-10`}
    >
      <p>{rail}</p>
    </div>
  );
};

export default BedStatusComponent;
