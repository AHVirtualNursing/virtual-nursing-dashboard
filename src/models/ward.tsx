import { SmartBed } from "./smartBed";

export class Ward {
  _id: string;
  num: number;
  smartBeds?: SmartBed[];

  constructor(_id: string, num: number, smartBeds?: SmartBed[]) {
    this._id = _id;
    this.num = num;
    this.smartBeds = smartBeds;
  }
}
