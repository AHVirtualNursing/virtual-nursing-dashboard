export type Vital = {
  respRate: VitalsReading[];
  heartRate: VitalsReading[];
  bloodPressureSys: VitalsReading[];
  bloodPressureDia: VitalsReading[];
  spO2: VitalsReading[];
  news2Score: VitalsReading[];
  temperature: VitalsReading[];
};

export type VitalsReading = {
  reading: number;
  datetime: string;
};
