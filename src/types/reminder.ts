import { Patient } from "./patient";

export interface Reminder {
  _id: string;
  content: string;
  isComplete: boolean;
  createdBy: string;
  patient: Patient | string;
  picture?: string;
  interval: number;
};
