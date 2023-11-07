import { Patient } from "./patient";

export type Reminder = {
  _id: string;
  content: string;
  isComplete: boolean;
  createdBy: string;
  patient: Patient;
  picture?: string;
};
