import { BedSideNurse } from "./bedsideNurse";
import { SmartBed } from "./smartbed";
import { VirtualNurse } from "./virtualNurse";

export interface Ward {
  _id: string;
  wardNum: string;
  wardType: string;
  numRooms: number;
  smartBeds?: SmartBed[] | string[];
  nurses: BedSideNurse[] | string[];
  beds: number;
  virtualNurse: VirtualNurse | string;
};
