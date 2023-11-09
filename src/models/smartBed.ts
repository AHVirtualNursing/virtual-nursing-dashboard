import { BedSideNurse } from "./bedsideNurse";
import { Patient } from "./patient";
import { Ward } from "./ward";

export class SmartBed {
  _id: string;
  bedStatus: string;
  createdAt: string;
  name: string;
  nurses: BedSideNurse[];
  patient?: Patient;
  bedPosition: string;
  isBrakeSet: boolean;
  isBedExitAlarmOn: boolean;
  isPatientOnBed: boolean;
  bedAlarmProtocolBreachReason: string;
  isLeftUpperRail: boolean;
  isRightUpperRail: boolean;
  isLeftLowerRail: boolean;
  isRightLowerRail: boolean;
  isLowestPosition: boolean;
  updatedAt: string;
  ward: Ward;
  roomNum: string;
  bedNum: string;

  constructor(
    _id: string,
    bedStatus: string,
    createdAt: string,
    name: string,
    nurses: BedSideNurse[],
    isLeftUpperRail: boolean,
    isRightUpperRail: boolean,
    isLeftLowerRail: boolean,
    isRightLowerRail: boolean,
    isLowestPosition: boolean,
    updatedAt: string,
    ward: Ward,
    roomNum: string,
    bedNum: string,
    bedPosition: string,
    isBrakeSet: boolean,
    isBedExitAlarmOn: boolean,
    isPatientOnBed: boolean,
    bedAlarmProtocolBreachReason: string,
    patient?: Patient
  ) {
    this._id = _id;
    this.bedStatus = bedStatus;
    this.createdAt = createdAt;
    this.name = name;
    this.nurses = nurses;
    this.patient = patient;
    this.isLeftLowerRail = isLeftLowerRail;
    this.isRightUpperRail = isRightUpperRail;
    this.isRightLowerRail = isRightLowerRail;
    this.isLeftUpperRail = isLeftUpperRail;
    this.isLowestPosition = isLowestPosition;
    this.updatedAt = updatedAt;
    this.ward = ward;
    this.roomNum = roomNum;
    this.bedPosition = bedPosition;
    this.isBrakeSet = isBrakeSet;
    this.isBedExitAlarmOn = isBedExitAlarmOn;
    this.isPatientOnBed = isPatientOnBed;
    this.bedAlarmProtocolBreachReason = bedAlarmProtocolBreachReason;
    this.bedNum = bedNum;
  }
}
