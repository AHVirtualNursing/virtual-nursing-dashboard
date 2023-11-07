export type Alert = {
  status: string;
  description: string;
  notes: [];
  patient: string;
  handledBy: string;
  followUps: [];
  alertVitals: AlertVitals[];
  createdAt: string;
};

export type AlertVitals = {
  reading: number;
  vital: string;
};
