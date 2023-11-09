export class AlertConfig {
  _id: string | undefined;
  rrConfig: number[];
  hrConfig: number[];
  bpSysConfig: number[];
  bpDiaConfig: number[];
  spO2Config: number[];

  constructor(
    _id: string,
    rrConfig: number[],
    hrConfig: number[],
    bpSysConfig: number[],
    bpDiaConfig: number[],
    spO2Config: number[]
  ) {
    this._id = _id;
    this.rrConfig = rrConfig;
    this.hrConfig = hrConfig;
    this.bpDiaConfig = bpDiaConfig;
    this.bpSysConfig = bpSysConfig;
    this.spO2Config = spO2Config;
  }
}
