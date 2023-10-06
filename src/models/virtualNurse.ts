import { SmartBed } from "./smartBed";
import { Ward } from "./ward";

export class VirtualNurse {
  _id: string;
  username: string;
  ward?: Ward[];

  constructor(
    _id: string,
    username: string,
    ward?: Ward[]
  ) {
    this._id = _id;
    this.username = username;
    this.ward = ward;
  }
}
