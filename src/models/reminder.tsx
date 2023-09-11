import { Patient } from "./patient";

export class Reminder {
    content: string;
    isComplete: boolean;
    createdBy: string;
    patient: Patient;
    picture?: string;

    constructor(
        content: string,
        isComplete: boolean,
        createdBy: string,
        patient: Patient,
        picture?: string
    ) {
        this.content = content;
        this.isComplete = isComplete;
        this.createdBy = createdBy;
        this.patient = patient;
        this.picture = picture;
    }
}