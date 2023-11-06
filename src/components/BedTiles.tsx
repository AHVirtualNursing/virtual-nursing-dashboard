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
  exit: boolean;
  lowestPosition: boolean;
  brake: boolean;
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
      {cardLayout?.exit ||
      cardLayout?.brake ||
      cardLayout?.lowestPosition ||
      cardLayout?.weight ? (
        <div className="flex-1 flex py-2 px-4">
          {cardLayout?.exit || cardLayout.lowestPosition ? (
            <div className="flex flex-1 flex-col p-1">
              {cardLayout?.exit ? (
                <div className="bg-slate-100 flex flex-1 border-2 border-solid items-center justify-center rounded-2xl my-2">
                  <p>Bed Exit</p>
                  <CheckCircle className="fill-emerald-600" />
                </div>
              ) : null}
              {cardLayout?.lowestPosition ? (
                <div className="bg-slate-100 flex flex-1 border-2 border-solid items-center justify-center rounded-2xl my-2">
                  <p>Bed Low</p>
                  <CheckCircle className="fill-emerald-600" />
                </div>
              ) : null}
            </div>
          ) : null}

          {cardLayout?.brake || cardLayout.weight ? (
            <div className="flex flex-1 flex-col p-1">
              {cardLayout?.brake ? (
                <div className="bg-slate-100 flex flex-1 border-2 border-solid items-center justify-center rounded-2xl my-2">
                  <p>Brake On</p>
                  <Cancel className="fill-red-500" />
                </div>
              ) : null}
              {cardLayout?.weight ? (
                <div className="bg-slate-100 flex flex-1 border-2 border-solid items-center justify-center rounded-2xl my-2">
                  <p>Weight</p>
                  <Cancel className="fill-red-500" />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* <div className="flex-1 flex flex-col py-2 pl-4">
        <div className="flex-col flex flex-1 border-0 border-b-2 border-r-2 border-solid items-center justify-center">
          <p>Bed Exit</p>
          <CheckCircle className="fill-emerald-600" />
        </div>
        <div className="flex-col flex flex-1 border-0 border-t-2 border-r-2 border-solid items-center justify-center">
          <p>Brake On</p>
          <Cancel className="fill-red-500" />
        </div>
      </div>
      <div className="flex-1 flex flex-col py-2 pr-4">
        <div className="flex-col flex flex-1 border-0 border-b-2 border-l-2 border-solid items-center justify-center">
          <p>Bed Low</p>
          <CheckCircle className="fill-emerald-600" />
        </div>
        <div className="flex-col flex flex-1 border-0 border-t-2 border-l-2 border-solid items-center justify-center">
          <p>Weight</p>
          <Cancel className="fill-red-500" />
        </div>
      </div> */}
    </div>
  );
}

export default BedTiles;
