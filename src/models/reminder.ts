import { Patient } from "./patient";

export class Reminder {
  _id: string;
  content: string;
  isComplete: boolean;
  createdBy: string;
  patient: Patient;
  picture?: string;

  constructor(
    _id: string,
    content: string,
    isComplete: boolean,
    createdBy: string,
    patient: Patient,
    picture?: string
  ) {
    this._id = _id;
    this.content = content;
    this.isComplete = isComplete;
    this.createdBy = createdBy;
    this.patient = patient;
    this.picture = picture;
  }
}
