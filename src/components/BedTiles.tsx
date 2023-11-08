import React from "react";
import bed from "../../public/bed_stock.png";
import { Cancel, CheckCircle, Man } from "@mui/icons-material";

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
}

function BedTiles({ cardLayout }: layoutProp) {
  return (
    <div className="flex">
      {cardLayout?.rail ? (
        <div className="flex-1 py-2 px-4">
          <div className="flex text-center">
            <div className="flex-1 bg-emerald-400 rounded-2xl">Left Upper</div>
            <div className="flex-1 bg-red-400 rounded-2xl">Left Lower</div>
          </div>
          <img
            src={bed.src}
            alt="Top down view of bed"
            className="object-contain w-full"
          />
          <div className="flex text-center">
            <div className="flex-1 bg-emerald-400 rounded-2xl">Right Upper</div>
            <div className="flex-1 bg-emerald-400 rounded-2xl">Right Lower</div>
          </div>
        </div>
      ) : null}
      {cardLayout?.warnings ? (
        <div className="flex-1 flex flex-col py-2 px-4">
          <h3>Bed Warnings</h3>
          <div className="bg-slate-100 flex flex-1 border-2 border-solid items-center justify-center rounded-2xl my-2">
            <p>Bed Exit</p>
            <CheckCircle className="fill-emerald-600" />
          </div>

          <div className="bg-slate-100 flex flex-1 border-2 border-solid items-center justify-center rounded-2xl my-2">
            <p>Bed Low</p>
            <CheckCircle className="fill-emerald-600" />
          </div>

          <div className="bg-slate-100 flex flex-1 border-2 border-solid items-center justify-center rounded-2xl my-2">
            <p>Brake On</p>
            <Cancel className="fill-red-500" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default BedTiles;
