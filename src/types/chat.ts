import { Alert } from "./alert";
import { BedSideNurse } from "./bedsideNurse";
import { Patient } from "./patient";
import { VirtualNurse } from "./virtualNurse";

export interface Message {
  _id: string;
  content: string;
  imageUrl?: string;
  patient?: Patient | string;
  alert?: Alert | string;
  createdBy: VirtualNurse | BedSideNurse | string;
  createdAt: string;
}
export interface Chat {
  _id: string;
  virtualNurse: VirtualNurse | string;
  bedsideNurse: BedSideNurse | string;
  messages: Message[];
  isArchived: boolean;
}
