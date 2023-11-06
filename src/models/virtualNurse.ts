import { SmartBed } from "./smartBed";
import { Ward } from "./ward";

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

export class VirtualNurse {
  _id: string;
  username: string;
  passwordReset: boolean;
  name: string;
  cardLayout: layout;
  ward?: Ward[];

  constructor(
    _id: string,
    username: string,
    passwordReset: boolean,
    name: string,
    cardLayout: layout,
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
