import { SmartBed } from "./smartBed";

export class Ward {
  _id: string;
  num: string;
  wardType: string;
  numRooms: number;
  smartBeds?: SmartBed[];

  constructor(_id: string, num: string, wardType: string, numRooms: number, smartBeds?: SmartBed[]) {
    this._id = _id;
    this.num = num;
    this.wardType = wardType;
    this.numRooms = numRooms;
    this.smartBeds = smartBeds;
  }
}
