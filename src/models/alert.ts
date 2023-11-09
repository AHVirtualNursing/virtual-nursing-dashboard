import { Patient } from "./patient";

export class Alert {
  _id: string;
  status: string;
  description: string;
  patient: Patient;
  redelegate: boolean;
  notes?: string;
  createdAt?: string;

  constructor(
    _id: string,
    status: string,
    description: string,
    redelegate: boolean,
    patient: Patient,
    notes?: string,
    createdAt?: string
  ) {
    this._id = _id;
    this.status = status;
    this.description = description;
    this.patient = patient;
    this.redelegate = redelegate;
    this.notes = notes;
    this.createdAt = createdAt;
  }
}
