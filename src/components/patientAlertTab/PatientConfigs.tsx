import React, { useEffect, useState } from "react";
import RangeSlider from "../RangeSlider";
import { AlertConfig } from "@/models/alertConfig";
import { Patient } from "@/models/patient";
import { fetchAlertConfigByPatientId } from "@/pages/api/alertConfigs_api";

type PatientConfigProps = {
  patient: Patient | undefined;
};

const PatientConfigs = ({ patient }: PatientConfigProps) => {
  const [defaultConfig, setDefaultConfig] = useState<AlertConfig>();
  const [rr, setRr] = useState<number[]>([]);
  const [heartRate, setHeartRate] = useState<number[]>([]);
  const [systolic, setSystolic] = useState<number[]>([]);
  const [diastolic, setDiastolic] = useState<number[]>([]);
  const [spo2, setSpo2] = useState<number[]>([]);

  useEffect(() => {
    fetchAlertConfigByPatientId(patient?._id).then((res) => {
      console.log(res?.data);
      const { hrConfig, rrConfig, spO2Config, bpDiaConfig, bpSysConfig } =
        res?.data;
      setHeartRate(hrConfig);
      setSystolic(bpSysConfig);
      setDiastolic(bpDiaConfig);
      setSpo2(spO2Config);
      setRr(rrConfig);
    });
  }, []);

  function handleSaveConfigs() {
    const alertConfig = {
      _id: patient?._id,
      rrConfig: rr,
      hrConfig: heartRate,
      bpSysConfig: systolic,
      bpDiaConfig: diastolic,
      spO2Config: spo2,
    };
    console.log(alertConfig);
  }

  return (
    <div className="p-4 space-y-2 flex flex-col">
      <h3 className="text-left">Thresholds</h3>
      {heartRate.length > 0 && (
        <RangeSlider
          min={0}
          max={200}
          lowerBound={heartRate[0]}
          upperBound={heartRate[1]}
          label="Heart Rate"
          handleThresholds={setHeartRate}
        />
      )}

      {spo2.length > 0 && (
        <RangeSlider
          min={0}
          max={100}
          lowerBound={spo2[0]}
          upperBound={spo2[1]}
          label="SP02"
          handleThresholds={setSpo2}
        />
      )}
      {systolic.length > 0 && (
        <RangeSlider
          min={0}
          max={200}
          lowerBound={systolic[0]}
          upperBound={systolic[1]}
          label="Systolic"
          handleThresholds={setSystolic}
        />
      )}
      {diastolic.length > 0 && (
        <RangeSlider
          min={0}
          max={150}
          lowerBound={diastolic[0]}
          upperBound={diastolic[1]}
          label="Diastolic"
          handleThresholds={setDiastolic}
        />
      )}

      <div>
        <button
          className=" float-right bg-blue-900 text-white rounded-lg border-none p-3 font-bold text-md active:bg-blue-400"
          onClick={handleSaveConfigs}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PatientConfigs;
