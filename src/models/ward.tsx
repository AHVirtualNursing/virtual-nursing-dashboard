import { SmartBed } from "./smartBed";

export class Ward {
  _id: string;
  num: string;
  smartBeds?: SmartBed[];

  constructor(_id: string, num: string, smartBeds?: SmartBed[]) {
    this._id = _id;
    this.num = num;
    this.smartBeds = smartBeds;
  }
}
