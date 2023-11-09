import React from "react";
import bed from "../../public/bed_stock.png";
import { Cancel, CheckCircle, Man } from "@mui/icons-material";
import { SmartBed } from "@/models/smartBed";

interface layout {
  [key: string]: boolean;
  allVitals: boolean;
  hr: boolean;
  rr: boolean;
  spo2: boolean;
  bp: boolean;
  temp: boolean;
  news2: boolean;
  allBedStatuses: boolean;
  rail: boolean;
  warnings: boolean;
  weight: boolean;
  fallRisk: boolean;
}

interface layoutProp {
  cardLayout: layout | undefined;
  smartbed: SmartBed | undefined;
}

function BedTiles({ cardLayout, smartbed }: layoutProp) {
  return (
    <div className="flex">
      {cardLayout?.rail ? (
        <div className="flex-1 py-2 px-4">
          <div className="flex text-center">
            <div
              className={`flex-1 bg-${
                smartbed?.isLeftUpperRail ? "emerald" : "red"
              }-400 rounded-2xl`}
            >
              Left Upper
            </div>
            <div
              className={`flex-1 bg-${
                smartbed?.isLeftLowerRail ? "emerald" : "red"
              }-400 rounded-2xl`}
            >
              Left Lower
            </div>
          </div>
          {smartbed?.isPatientOnBed ? (
            <img
              src={bed.src}
              alt="Top down view of bed"
              className="object-contain w-full"
            />
          ) : (
            <img
              src={bed.src}
              alt="Top down view of bed"
              className="object-contain w-full"
              style={{
                filter: "grayscale(100%)",
                backgroundColor: "rgba(255, 0, 0, 0.5)",
              }}
            />
          )}
          <div className="flex text-center">
            <div
              className={`flex-1 bg-${
                smartbed?.isRightUpperRail ? "emerald" : "red"
              }-400 rounded-2xl`}
            >
              Right Upper
            </div>
            <div
              className={`flex-1 bg-${
                smartbed?.isRightLowerRail ? "emerald" : "red"
              }-400 rounded-2xl`}
            >
              Right Lower
            </div>
          </div>
        </div>
      ) : null}
      {cardLayout?.warnings ? (
        <div className="flex-1 flex flex-col py-2 px-4">
          <h3>Bed Warnings</h3>
          <div className="bg-slate-100 flex flex-1 border-2 border-solid items-center justify-center rounded-2xl my-2">
            <div className="flex items-center">
              <p>
                {smartbed?.isBedExitAlarmOn
                  ? "Bed Exit Alarm On"
                  : "Bed Exit Alarm Off"}
              </p>
              {smartbed?.isBedExitAlarmOn ? (
                <CheckCircle className="fill-emerald-600" />
              ) : (
                <Cancel className="fill-red-500" />
              )}
            </div>
          </div>

          <div className="bg-slate-100 flex flex-1 border-2 border-solid items-center justify-center rounded-2xl my-2">
            <div className="flex items-center">
              <p>
                {smartbed?.isLowestPosition
                  ? "Bed at lowest position"
                  : "Bed not at lowest position"}
              </p>
              {smartbed?.isLowestPosition ? (
                <CheckCircle className="fill-emerald-600" />
              ) : (
                <Cancel className="fill-red-500" />
              )}
            </div>
          </div>

          <div className="bg-slate-100 flex flex-1 border-2 border-solid items-center justify-center rounded-2xl my-2">
            <div className="flex items-center">
              <p>
                {smartbed?.isBrakeSet ? "Brake is set" : "Brake is not set"}
              </p>
              {smartbed?.isBrakeSet ? (
                <CheckCircle className="fill-emerald-600" />
              ) : (
                <Cancel className="fill-red-500" />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default BedTiles;
