import { StringLiteral } from "typescript";
import { Patient } from "./patient";
import { Ward } from "./ward";

export class SmartBed {
  _id: string;
  bedStatus: string;
  createdAt: string;
  name: string;
  nurses: [];
  patient?: Patient;
  railStatus: boolean;
  updatedAt: string;
  ward: Ward;
  roomNum: string;
  bedNum: string;

  constructor(
    _id: string,
    bedStatus: string,
    createdAt: string,
    name: string,
    nurses: [],
    railStatus: boolean,
    updatedAt: string,
    ward: Ward,
    roomNum: string,
    bedNum: string,
    patient?: Patient
  ) {
    this._id = _id;
    this.bedStatus = bedStatus;
    this.createdAt = createdAt;
    this.name = name;
    this.nurses = nurses;
    this.patient = patient;
    this.railStatus = railStatus;
    this.updatedAt = updatedAt;
    this.ward = ward;
    this.roomNum = roomNum;
    this.bedNum = bedNum;
  }
}
