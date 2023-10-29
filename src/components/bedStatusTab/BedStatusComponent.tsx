import { SmartBed } from "@/models/smartBed";
import React from "react";

interface BedProp {
  bed: SmartBed | undefined;
}

function BedStatusComponent(bedProp: BedProp) {
  console.log(bedProp.bed);
  return (
    <>
      <div id="bed-photo">
        <img
          src="https://healthjade.net/wp-content/uploads/2020/02/Low-Fowler%E2%80%99s-position.jpg"
          alt="Patient on bed raised 15-30 degrees"
          className="object-contain w-96 h-48"
        />
      </div>
      <div id="bedrail" className="rounded-lg">
        <p>Bed Rails: {bedProp.bed?.railStatus ? "Up" : "Down"}</p>
      </div>
      <div id="bed-brakes">
        <p>Bed Brakes: {bedProp.bed?.isBrakeSet ? "Set" : "Not set"}</p>
      </div>
      <div id="bed-alarm">
        <p>
          Bed Alarm:{" "}
          {bedProp.bed?.bedAlarmTriggered ? "Triggered" : "Not triggered"}
        </p>
      </div>
      <div id="bed-position">Bed Position is {bedProp.bed?.bedPosition}</div>
    </>
  );
}

export default BedStatusComponent;
