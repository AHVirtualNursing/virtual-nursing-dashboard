import React from "react";
import bed from "../../public/bed_stock.png";
import { Cancel, CheckCircle, Man } from "@mui/icons-material";
import { SmartBed } from "@/types/smartbed";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Patient } from "@/types/patient";
import { Tooltip } from "@mui/material";

interface CardLayout {
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
  cardLayout: CardLayout | undefined;
  smartbed: SmartBed | undefined;
}

function BedTiles({ cardLayout, smartbed }: layoutProp) {
  return (
    <div className="flex">
      {cardLayout?.rail ? (
        <div className="flex-1 py-2 px-4">
          <div className="flex text-center">
            {/* <div className="bg-red-400"></div>
            <div className="bg-emerald-400"></div> */}
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
              src={"/bed_stock.png"}
              alt="Top down view of bed"
              className="object-contain w-full"
            />
          ) : (
            <img
              src={"bed_stock.png"}
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
          {!smartbed?.isBedExitAlarmOn ? (
            <div className="bg-slate-100 flex flex-1 border-2 border-solid items-center justify-center rounded-2xl my-2">
              <div className="flex items-center">
                <p className="p-2">Bed exit alarm off.</p>
                {(smartbed?.patient as Patient).fallRisk === "High" ? (
                  <Tooltip
                    title={
                      <p style={{ fontSize: "16px" }}>
                        {smartbed?.bedAlarmProtocolBreachReason}
                      </p>
                    }
                  >
                    <ReportProblemIcon sx={{ color: "orange" }} />
                  </Tooltip>
                ) : (
                  <ReportProblemIcon sx={{ color: "red" }} />
                )}
              </div>
            </div>
          ) : null}

          {!smartbed?.isLowestPosition ? (
            <div className="bg-slate-100 flex flex-1 border-2 border-solid items-center justify-center rounded-2xl my-2">
              <div className="flex items-center">
                <p className="p-2">Bed not at lowest position.</p>
                <ReportProblemIcon sx={{ color: "orange" }} />
              </div>
            </div>
          ) : null}

          {!smartbed?.isBrakeSet ? (
            <div className="bg-slate-100 flex flex-1 border-2 border-solid items-center justify-center rounded-2xl my-2">
              <div className="flex items-center">
                <p className="p-2">Brake is not set.</p>
                <ReportProblemIcon sx={{ color: "orange" }} />
              </div>
            </div>
          ) : null}

          {smartbed?.isBedExitAlarmOn &&
          smartbed?.isLowestPosition &&
          smartbed?.isBrakeSet ? (
            <p>No warnings</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default BedTiles;
