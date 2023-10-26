import React, { useState } from "react";
import RangeSlider from "../RangeSlider";
import { AlertConfig } from "@/models/alertConfig";
import { Patient } from "@/models/patient";

type PatientConfigProps = {
  patient: Patient | undefined;
};

const PatientConfigs = ({ patient }: PatientConfigProps) => {
  const [config, setConfig] = useState<AlertConfig>();
  const [rr, setRr] = useState<number[]>([]);
  const [heartRate, setHeartRate] = useState<number[]>([]);
  const [systolic, setSystolic] = useState<number[]>([]);
  const [diastolic, setDiastolic] = useState<number[]>([]);
  const [spo2, setSpo2] = useState<number[]>([]);

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
      <RangeSlider
        min={0}
        max={200}
        lowerBound={80}
        upperBound={180}
        label="Heart Rate"
        handleThresholds={setHeartRate}
      />
      <RangeSlider
        min={0}
        max={100}
        lowerBound={94}
        upperBound={100}
        label="SP02"
        handleThresholds={setSpo2}
      />
      <RangeSlider
        min={0}
        max={200}
        lowerBound={80}
        upperBound={120}
        label="Systolic"
        handleThresholds={setSystolic}
      />
      <RangeSlider
        min={0}
        max={150}
        lowerBound={60}
        upperBound={80}
        label="Diastolic"
        handleThresholds={setDiastolic}
      />
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
