import { Patient } from "./patient";

export class Alert {
    _id: string;
    status: string;
    description: string;
    patient: Patient;
    notes?: string;
    
    constructor(
        _id: string,
        status: string,
        description: string,
        patient: Patient,
        notes?: string,
    ) {
        this._id = _id;
        this.status = status;
        this.description = description;
        this.patient = patient;
        this.notes = notes;
    }
}