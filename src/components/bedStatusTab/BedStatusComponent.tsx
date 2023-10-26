import { SmartBed } from "@/models/smartBed";
import React from "react";

interface BedProp {
  bed: SmartBed | undefined;
}

function BedStatusComponent(bedProp: BedProp) {
  console.log(bedProp.bed);
  console.log(bedProp.bed?.railStatus);
  return (
    <div>
      <p>check the rail status left upper lower right upper lower</p>
      {bedProp.bed?.railStatus ? (
        <div>Bed rails are up</div>
      ) : (
        <div>Bed rails are down</div>
      )}
      {bedProp.bed?.isBrakeSet ? (
        <div>Bed brakes are set</div>
      ) : (
        <div>Bed brakes are not set</div>
      )}
      {bedProp.bed?.bedAlarmTriggered ? (
        <div>Bed alarm has been triggered</div>
      ) : (
        <div>Bed alarm has not been triggered</div>
      )}
      <p>Bed position: {bedProp.bed?.bedPosition}</p>
    </div>
  );
}

export default BedStatusComponent;
