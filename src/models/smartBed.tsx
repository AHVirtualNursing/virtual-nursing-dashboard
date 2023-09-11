import { Patient } from "./patient";
import { Ward } from "./ward"

export class SmartBed {
    bedNum: number;
    roomNum: number;
    ward: Ward;
    bedStatus: string;
    railStatus: boolean;
    patient?: Patient

    constructor(
        bedNum: number,
        roomNum: number,
        ward: Ward,
        bedStatus: string,
        railStatus: boolean,
        patient?: Patient
    ) {
        this.bedNum = bedNum;
        this.roomNum = roomNum;
        this.ward = ward;
        this.bedStatus = bedStatus;
        this.railStatus = railStatus;
        this.patient = patient;
    }
}