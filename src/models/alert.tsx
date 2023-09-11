import { Patient } from "./patient";

export class Alert {
    status: string;
    description: string;
    patient: Patient;
    notes?: string;
    
    constructor(
        status: string,
        description: string,
        patient: Patient,
        notes?: string,
    ) {
        this.status = status;
        this.description = description;
        this.patient = patient;
        this.notes = notes;
    }
}