import { Alert } from "./alert";
import { Reminder } from "./reminder";
import { Vital } from "./vital";

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
    reminders?: Reminder[];
    isDischarged?: boolean;
    vital?: Vital;

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
        reminders?: Reminder[],
        isDischarged?: boolean,
        vital?: Vital,
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
        this.reminders = reminders;
        this.isDischarged = isDischarged;
        this.vital = vital;
    }
}