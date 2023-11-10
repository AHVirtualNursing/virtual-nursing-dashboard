import { SmartBed } from "./smartbed";
import { User } from "./user";
import { Ward } from "./ward";

export interface BedSideNurse extends User {
  _id: string;
  smartBeds: SmartBed[] | string[];
  nurseStatus: NurseStatusEnum;
  headNurse: BedSideNurse | string;
  ward: Ward | string;
  createdAt: string;
  updatedAt: string;
  mobilePushNotificationToken: string;
};

export enum NurseStatusEnum {
  NORMAL = "normal",
  HEAD = "head",
}
