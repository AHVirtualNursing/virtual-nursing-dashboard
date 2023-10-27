import { BedSideNurse } from "./bedsideNurse";
import { Message } from "./message";
import { Patient } from "./patient";
import { VirtualNurse } from "./virtualNurse";

export type Chat = {
    _id: string;
    virtualNurse: VirtualNurse;
    bedsideNurse: BedSideNurse;
    latestMessage: string;
    messages: Message[];
    patient: Patient;
  };