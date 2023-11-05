import React from "react";
import bed from "../../public/bed_stock.png";
import { Cancel, CheckCircle, Man } from "@mui/icons-material";

function BedTiles() {
  return (
    <div className="flex">
      <div className="w-1/2 py-2 px-4">
        <div className="flex text-center">
          <div className="flex-1 bg-emerald-400 rounded-2xl">Left Upper</div>
          <div className="flex-1 bg-red-400 rounded-2xl">Left Lower</div>
        </div>
        <img
          src={bed.src}
          alt="Top down view of bed"
          className="object-contain w-full"
        />
        {/* <Man className="-rotate-90 text-9xl"></Man> */}
        <div className="flex text-center">
          <div className="flex-1 bg-emerald-400 rounded-2xl">Right Upper</div>
          <div className="flex-1 bg-emerald-400 rounded-2xl">Right Lower</div>
        </div>
      </div>
      <div className="w-1/4 flex flex-col py-2 pl-4">
        <div className="flex-col flex flex-1 border-0 border-b-2 border-r-2 border-solid items-center justify-center">
          <p>Bed Exit</p>
          <CheckCircle className="fill-emerald-600" />
        </div>
        <div className="flex-col flex flex-1 border-0 border-t-2 border-r-2 border-solid items-center justify-center">
          <p>Brake On</p>
          <Cancel className="fill-red-500" />
        </div>
      </div>
      <div className="w-1/4 flex flex-col py-2 pr-4">
        <div className="flex-col flex flex-1 border-0 border-b-2 border-l-2 border-solid items-center justify-center">
          <p>Bed Low</p>
          <CheckCircle className="fill-emerald-600" />
        </div>
        <div className="flex-col flex flex-1 border-0 border-t-2 border-l-2 border-solid items-center justify-center">
          <p>Weight</p>
          <Cancel className="fill-red-500" />
        </div>
      </div>

      {/* <div className="w-1/2 flex flex-col py-2 px-4">
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
        <div className="bg-slate-100 flex flex-1 border-2 border-solid items-center justify-center rounded-2xl my-2">
          <p>Weight</p>
          <Cancel className="fill-red-500" />
        </div>
      </div> */}
    </div>
  );
}

export default BedTiles;
