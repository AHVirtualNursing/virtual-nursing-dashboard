interface VitalsReading {
  reading: number
  datetime: string
}

export class Vital {
  respRate: VitalsReading[];
  heartRate: VitalsReading[];
  bloodPressureSys: VitalsReading[];
  bloodPressureDia: VitalsReading[];
  spO2: VitalsReading[];
  news2Score: VitalsReading[];
  temperature: VitalsReading[];

  constructor(
    respRate: VitalsReading[],
    heartRate: VitalsReading[],
    bloodPressureSys: VitalsReading[],
    bloodPressureDia: VitalsReading[],
    spO2: VitalsReading[],
    news2Score: VitalsReading[],
    temperature: VitalsReading[]
  ) {
    this.respRate = respRate;
    this.heartRate = heartRate;
    this.bloodPressureSys = bloodPressureSys;
    this.bloodPressureDia = bloodPressureDia;
    this.spO2 = spO2;
    this.news2Score = news2Score;
    this.temperature = temperature;
  }
}
