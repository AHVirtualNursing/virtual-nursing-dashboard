import { BedSideNurse } from "./bedsideNurse";
import { Patient } from "./patient";
import { Ward } from "./ward";

export interface SmartBed {
  _id: string;
  name: string;
  roomNum: string;
  bedNum: string;
  bedStatus: string;
  bedPosition: string;
  isBrakeSet: boolean;
  isRightUpperRail: boolean;
  isLeftUpperRail: boolean;
  isRightLowerRail: boolean;
  isLeftLowerRail: boolean;
  isLowestPosition: boolean;
  isBedExitAlarmOn: boolean;
  isPatientOnBed: boolean;
  createdAt: string;
  updatedAt: string;
  bedAlarmProtocolBreachReason?: string;
  ward?: Ward | string;
  nurses?: BedSideNurse[] | string[];
  patient?: Patient | string;
};
