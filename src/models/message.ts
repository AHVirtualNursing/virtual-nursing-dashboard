import { Patient } from "./patient";

export type Message = {
  _id: string;
  content: string;
  imageUrl?: string;
  createdBy: string;
  createdAt: Date;
  patient?: Patient;
};
