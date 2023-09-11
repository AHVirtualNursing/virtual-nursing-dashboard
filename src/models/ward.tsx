import { SmartBed } from "./smartBed";

export class Ward {
    num : number;
    smartBeds?: SmartBed[];

    constructor(
        num: number,
        smartBeds?: SmartBed[] 
    ) {
        this.num = num;
        this.smartBeds = smartBeds;
    }
}