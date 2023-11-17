import { Patient } from "./patient";

export interface AlertVitals {
  reading: number;
  vital: string;
}

export interface FollowUpLog {
  respRate: number;
  heartRate: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  spO2: number;
  temperature: number;
  datetime: string;
  addedBy: string;
}

export interface NoteLog {
  info: string;
  datetime: string;
  addedBy: string;
}

export interface Alert {
  _id: string;
  status: string;
  description: string;
  notes: NoteLog[];
  patient: string | Patient;
  handledBy: NoteLog;
  followUps: FollowUpLog[];
  alertVitals: AlertVitals[] | string[];
  alertType: string;
  redelegate: boolean;
  createdAt: string;
}
