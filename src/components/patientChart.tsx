import React, { ChangeEvent, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Patient } from "@/models/patient";
import { fetchVitalByVitalId } from "@/pages/api/vitals_api";
import FormGroup from "@mui/material/FormGroup";
import { Checkbox, FormControlLabel } from "@mui/material";

interface PatientChartProps {
  patient?: Patient;
}

interface Dataset {
  label: string;
  data: number[];
  borderColor: string;
}

interface VitalReading {
  datetime: string;
  reading: number;
}

interface VitalData {
  heartRate: VitalReading[];
  spO2: VitalReading[];
  bloodPressureSys: VitalReading[];
  bloodPressureDia: VitalReading[];
}

export default function PatientChart({ patient }: PatientChartProps) {
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
  );

  const [vitals, setVitals] = useState<VitalData>({
    heartRate: [],
    spO2: [],
    bloodPressureSys: [],
    bloodPressureDia: [],
  });

  const [selectedVitals, setSelectedVitals] = useState({
    bp: true,
    hr: true,
    spo2: true,
  });

  const updateChartData = () => {
    const data = {
      labels: vitals.heartRate.map(
        (vitalReading) => vitalReading.datetime.split(" ")[1]
      ),
      datasets: [] as Dataset[],
    };

    if (selectedVitals.hr) {
      data.datasets.push({
        label: "Heart Rate (bpm)",
        data: vitals.heartRate.map((vitalReading) => vitalReading.reading),
        borderColor: "red",
      });
    }

    if (selectedVitals.spo2) {
      data.datasets.push({
        label: "Blood Oxygen (%)",
        data: vitals.spO2.map((vitalReading) => vitalReading.reading),
        borderColor: "green",
      });
    }

    if (selectedVitals.bp) {
      data.datasets.push({
        label: "Blood Pressure Systolic (mm Hg)",
        data: vitals.bloodPressureSys.map(
          (vitalReading) => vitalReading.reading
        ),
        borderColor: "blue",
      });
      data.datasets.push({
        label: "Blood Pressure Diastolic (mm Hg)",
        data: vitals.bloodPressureDia.map(
          (vitalReading) => vitalReading.reading
        ),
        borderColor: "darkblue",
      });
    }
    return data;
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {},
      title: {
        display: true,
        text: "Patient Vitals Chart",
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
        },
        pan: {
          enabled: true,
        },
      },
    },
  };

  useEffect(() => {
    fetchVitalData();
  }, []);

  const fetchVitalData = async () => {
    const res = await fetchVitalByVitalId(patient?.vital);
    setVitals(res);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSelectedVitals({
      ...selectedVitals,
      [name]: checked,
    });
  };

  return (
    <div>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name="hr"
              checked={selectedVitals.hr}
              onChange={handleCheckboxChange}
            />
          }
          label="Heart Rate"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="spo2"
              checked={selectedVitals.spo2}
              onChange={handleCheckboxChange}
            />
          }
          label="Blood Oxygen"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="bp"
              checked={selectedVitals.bp}
              onChange={handleCheckboxChange}
            />
          }
          label="Blood Pressure"
        />
      </FormGroup>
      <Line data={updateChartData()} options={options} />
    </div>
  );
}
