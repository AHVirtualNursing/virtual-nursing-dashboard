import { Patient } from "./patient";
import { Ward } from "./ward"

export class SmartBed {
    _id: string;
    bedNum: number;
    roomNum: number;
    ward: Ward;
    bedStatus: string;
    railStatus: boolean;
    patient?: Patient

    constructor(
        _id: string,
        bedNum: number,
        roomNum: number,
        ward: Ward,
        bedStatus: string,
        railStatus: boolean,
        patient?: Patient
    ) {
        this._id = _id;
        this.bedNum = bedNum;
        this.roomNum = roomNum;
        this.ward = ward;
        this.bedStatus = bedStatus;
        this.railStatus = railStatus;
        this.patient = patient;
    }
}