import { SmartBed } from "./smartBed";
import { Ward } from "./ward";

export class VirtualNurse {
  _id: string;
  username: string;
  passwordReset: boolean;
  name: string;
  cardLayout: string[];
  ward?: Ward[];

  constructor(
    _id: string,
    username: string,
    passwordReset: boolean,
    name: string,
    cardLayout: string[],
    ward?: Ward[]
  ) {
    this._id = _id;
    this.username = username;
    this.ward = ward;
    this.name = name;
    this.cardLayout = cardLayout;
    this.passwordReset = passwordReset;
  }
}
