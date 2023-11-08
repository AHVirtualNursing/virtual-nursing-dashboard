import { SmartBed } from "./smartbed";
import { Ward } from "./ward";

export type BedSideNurse = {
  _id: string;
  name: string;
  smartBeds: SmartBed[];
  nurseStatus: NurseStatusEnum;
  headNurse: BedSideNurse;
  ward: Ward;
  createdAt: string;
  updatedAt: string;
  username: string;
  email: string;
  password: string;
  mobilePushNotificationToken: string;
  passwordReset: boolean;
};

export enum NurseStatusEnum {
  NORMAL = "normal",
  HEAD = "head",
}
