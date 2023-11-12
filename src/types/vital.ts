export interface Vital {
  _id: string;
  respRate: VitalsReading[];
  heartRate: VitalsReading[];
  bloodPressureSys: VitalsReading[];
  bloodPressureDia: VitalsReading[];
  spO2: VitalsReading[];
  news2Score: VitalsReading[];
  temperature: VitalsReading[];
}

export interface VitalsReading {
  reading: number;
  datetime: string;
}
