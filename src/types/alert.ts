export type Alert = {
  status: string;
  description: string;
  notes: NoteLog[];
  patient: string;
  handledBy: string;
  followUps: FollowUpLog[];
  alertVitals: AlertVitals[];
  alertType: string;
  createdAt: string;
};

export type AlertVitals = {
  reading: number;
  vital: string;
};

export type NoteLog = {
  info: string;
  datetime: string;
  addedBy: string;
};

export type FollowUpLog = {
  respRate: number;
  heartRate: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  spO2: number;
  temperature: number;
  datetime: string;
  addedBy: string;
};
