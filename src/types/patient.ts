import { Report } from "@/models/report";
import { Alert } from "./alert";
import { AlertConfig } from "./alertConfig";
import { Reminder } from "./reminder";
import { Vital } from "./vital";

export type Patient = {
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
  alerts: Alert[];
  alertConfig: AlertConfig[];
  reminders: Reminder[];
  vital: Vital;
  reports: Report[];
  order: string[];
};

export type InfoLog = {
  info: string;
  datetime: string;
  addedBy: string;
};
