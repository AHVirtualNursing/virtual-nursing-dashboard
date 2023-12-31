import { Alert } from "./alert";
import { Reminder } from "./reminder";
import { Vital } from "./vital";
import { Report } from "./report";
import { AlertConfig } from "./alertConfig";
import { Layouts } from "react-grid-layout";

export class Patient {
  _id: string;
  name: string;
  nric: string;
  condition: string;
  picture?: string;
  addInfo?: string;
  copd?: boolean;
  o2Intake?: string;
  consciousness?: string;
  temperature?: number;
  news2Score?: number;
  alerts?: Alert[];
  alertConfig?: AlertConfig[];
  reminders?: Reminder[];
  isDischarged?: boolean;
  vital?: string;
  reports?: Report[];
  layout?: Layouts;

  constructor(
    _id: string,
    name: string,
    nric: string,
    condition: string,
    picture?: string,
    addInfo?: string,
    copd?: boolean,
    o2Intake?: string,
    consciousness?: string,
    temperature?: number,
    news2Score?: number,
    alerts?: Alert[],
    alertConfig?: AlertConfig[],
    reminders?: Reminder[],
    isDischarged?: boolean,
    vital?: string,
    reports?: Report[],
    layout?: Layouts
  ) {
    this._id = _id;
    this.name = name;
    this.nric = nric;
    this.picture = picture;
    this.condition = condition;
    this.addInfo = addInfo;
    this.copd = copd;
    this.o2Intake = o2Intake;
    this.consciousness = consciousness;
    this.temperature = temperature;
    this.news2Score = news2Score;
    this.alerts = alerts;
    this.alertConfig = alertConfig;
    this.reminders = reminders;
    this.isDischarged = isDischarged;
    this.vital = vital;
    this.reports = reports;
    this.layout = layout;
  }
}
