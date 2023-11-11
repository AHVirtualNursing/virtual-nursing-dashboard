import { Alert } from "./alert";
import { AlertConfig } from "./alertConfig";
import { Reminder } from "./reminder";
import { Report } from "./report";
import { Vital } from "./vital";

export interface Patient {
  _id: string;
  name: string;
  nric: string;
  picture: string;
  condition: string;
  infoLogs: InfoLog[];
  copd: boolean;
  o2Intake: string;
  consciousness: string;
  acuityLevel: string;
  fallRisk: string;
  isDischarged: boolean;
  admissionDateTime: Date;
  dischargeDateTime: Date;
  alerts: Alert[] | string[];
  alertConfig: AlertConfig | string;
  reminders: Reminder[] | string[];
  vital: Vital | string;
  reports: Report[] | string[];
  order: string[];
}

export interface InfoLog {
  info: string;
  datetime: string;
  addedBy: string;
};
