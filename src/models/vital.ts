export class Vital {
  _id: string;
  respRate: Object;
  heartRate: Object;
  bloodPressure: Object;
  spO2: Object;
  pulse: Object;

  constructor(
    _id: string,
    respRate: Object,
    heartRate: Object,
    bloodPressure: Object,
    spO2: Object,
    pulse: Object
  ) {
    this._id = _id;
    this.respRate = respRate;
    this.heartRate = heartRate;
    this.bloodPressure = bloodPressure;
    this.spO2 = spO2;
    this.pulse = pulse;
  }
}
