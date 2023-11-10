import { Alert } from "./alert";
import { Reminder } from "./reminder";
import { InfoLog } from "./infoLog";
import { Layouts } from "react-grid-layout";

export interface Patient {
  _id: string;
  name: string;
  nric: string;
  condition: string;
  order: string[];
  picture?: string;
  infoLogs?: InfoLog[];
  copd?: boolean;
  o2Intake?: string;
  consciousness?: string;
  acuityLevel?: string;
  fallRisk?: string;
  alerts?: Alert[];
  alertConfig?: string;
  reminders?: Reminder[];
  isDischarged?: boolean;
  vital?: string;
  reports?: string[];
  layout?: Layouts;
}
