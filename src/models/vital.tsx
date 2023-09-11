export class Vital {
    respRate: Object;
    heartRate: Object;
    bloodPressure: Object;
    spO2: Object;
    pulse: Object;

    constructor(
        respRate: Object,
        heartRate: Object,
        bloodPressure: Object,
        spO2: Object,
        pulse: Object
    ) {
        this.respRate = respRate;
        this.heartRate = heartRate;
        this.bloodPressure = bloodPressure;
        this.spO2 = spO2;
        this.pulse = pulse;
    }
}