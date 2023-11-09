import { BedSideNurse } from "./bedsideNurse";
import { VirtualNurse } from "./virtualNurse";

export type Ward = {
  _id: string;
  wardNum: string;
  wardType: string;
  numRooms: number;
  smartBeds?: string[];
  nurses: BedSideNurse[];
  beds: number;
  virtualNurse: VirtualNurse;
};
