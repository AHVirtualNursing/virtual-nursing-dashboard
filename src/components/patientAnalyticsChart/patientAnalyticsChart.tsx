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
import annotationPlugin from "chartjs-plugin-annotation";
import { Patient } from "@/models/patient";
import { fetchVitalByVitalId } from "@/pages/api/vitals_api";
import FormGroup from "@mui/material/FormGroup";
import { Checkbox, FormControlLabel, FormLabel, Grid } from "@mui/material";
import { showNormalRangeAnnotations } from "./patientAnalyticsChartOptions";

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
  temperature: VitalReading[];
  respRate: VitalReading[];
}

export default function PatientAnalyticsChart({ patient }: PatientChartProps) {
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin,
    annotationPlugin
  );

  const [vitals, setVitals] = useState<VitalData>({
    heartRate: [],
    spO2: [],
    bloodPressureSys: [],
    bloodPressureDia: [],
    temperature: [],
    respRate: [],
  });

  const [selectedVitals, setSelectedVitals] = useState({
    bloodPressure: true,
    heartRate: true,
    spO2: true,
    temperature: true,
    respRate: true,
  });

  const [selectedIndicators, setSelectedIndicators] = useState({
    normalRange: false,
  });

  useEffect(() => {
    fetchVitalData();
  }, []);

  const fetchVitalData = async () => {
    const res = await fetchVitalByVitalId(patient?.vital);
    setVitals(res);
  };

  const colors = {
    heartRate: {
      low: "rgb(255, 191, 0)",
      normal: "rgb(147, 197, 114)",
      high: "rgb(255, 191, 0)",
    },
    spO2: {
      low: "rgb(64, 224, 208)",
      normal: "rgb(100, 149, 237)",
      high: "rgb(255, 0, 255)",
    },
    bloodPressureSys: {
      low: "rgb(210, 4, 45)",
      normal: "rgb(0, 163, 108)",
      high: "rgb(210, 4, 45)",
    },
    bloodPressureDia: {
      low: "rgb(255, 117, 24)",
      normal: "rgb(159, 226, 191)",
      high: "rgb(255, 117, 24)",
    },
    temperature: {
      low: "rgb(255, 117, 24)",
      normal: "rgb(159, 226, 191)",
      high: "rgb(255, 117, 24)",
    },
    respRate: {
      low: "rgb(210, 4, 45)",
      normal: "rgb(0, 163, 108)",
      high: "rgb(210, 4, 45)",
    },
  };

  const updateColorByThreshold = (
    reading: any,
    vitalType:
      | "heartRate"
      | "spO2"
      | "bloodPressureSys"
      | "bloodPressureDia"
      | "temperature"
      | "respRate"
  ) => {
    const thresholds = {
      heartRate: {
        min: 60,
        max: 100,
      },
      spO2: {
        min: 95,
        max: 100,
      },
      bloodPressureSys: {
        min: 90,
        max: 120,
      },
      bloodPressureDia: {
        min: 60,
        max: 80,
      },
      temperature: {
        min: 36.2,
        max: 37.2,
      },
      respRate: {
        min: 12,
        max: 18,
      },
    };

    const p1 = reading.p1.raw;
    if (vitalType === "heartRate") {
      if (p1 < thresholds.heartRate.min) {
        return colors.heartRate.low;
      } else if (p1 > thresholds.heartRate.max) {
        return colors.heartRate.high;
      }
    } else if (vitalType === "spO2") {
      if (p1 < thresholds.spO2.min) {
        return colors.spO2.low;
      }
    } else if (vitalType === "bloodPressureSys") {
      if (p1 < thresholds.bloodPressureSys.min) {
        return colors.bloodPressureSys.low;
      } else if (p1 > thresholds.bloodPressureSys.max) {
        return colors.bloodPressureSys.high;
      }
    } else if (vitalType === "bloodPressureDia") {
      if (p1 < thresholds.bloodPressureDia.min) {
        return colors.bloodPressureDia.low;
      } else if (p1 > thresholds.bloodPressureDia.max) {
        return colors.bloodPressureDia.high;
      }
    } else if (vitalType === "temperature") {
      if (p1 < thresholds.temperature.min) {
        return colors.temperature.low;
      } else if (p1 > thresholds.temperature.max) {
        return colors.temperature.high;
      }
    } else if (vitalType === "respRate") {
      if (p1 < thresholds.respRate.min) {
        return colors.temperature.low;
      } else if (p1 > thresholds.respRate.max) {
        return colors.respRate.high;
      }
    }
  };

  const updateChartData = () => {
    const data = {
      labels: vitals.heartRate.map(
        (vitalReading) => vitalReading.datetime.split(" ")[1]
      ),
      datasets: [] as Dataset[],
    };

    if (selectedVitals.heartRate) {
      data.datasets.push({
        label: "Heart Rate (bpm)",
        data: vitals.heartRate.map((vitalReading) => vitalReading.reading),
        borderColor: colors.heartRate.normal,
        segment: {
          borderColor: (segment: any) =>
            updateColorByThreshold(segment, "heartRate"),
        },
        spanGaps: true,
      } as Dataset);
    }

    if (selectedVitals.spO2) {
      data.datasets.push({
        label: "Blood Oxygen (%)",
        data: vitals.spO2.map((vitalReading) => vitalReading.reading),
        borderColor: colors.spO2.normal,
        segment: {
          borderColor: (segment: any) =>
            updateColorByThreshold(segment, "spO2"),
        },
      } as Dataset);
    }

    if (selectedVitals.bloodPressure) {
      data.datasets.push({
        label: "Blood Pressure Systolic (mm Hg)",
        data: vitals.bloodPressureSys.map(
          (vitalReading) => vitalReading.reading
        ),
        borderColor: colors.bloodPressureSys.normal,
        segment: {
          borderColor: (segment: any) =>
            updateColorByThreshold(segment, "bloodPressureSys"),
        },
      } as Dataset);
      data.datasets.push({
        label: "Blood Pressure Diastolic (mm Hg)",
        data: vitals.bloodPressureDia.map(
          (vitalReading) => vitalReading.reading
        ),
        borderColor: colors.bloodPressureDia.normal,
        segment: {
          borderColor: (segment: any) =>
            updateColorByThreshold(segment, "bloodPressureDia"),
        },
      } as Dataset);
    }

    if (selectedVitals.temperature) {
      data.datasets.push({
        label: "Temperature (°C)",
        data: vitals.temperature.map((vitalReading) => vitalReading.reading),
        borderColor: colors.temperature.normal,
        segment: {
          borderColor: (segment: any) =>
            updateColorByThreshold(segment, "temperature"),
        },
      } as Dataset);
    }

    if (selectedVitals.respRate) {
      data.datasets.push({
        label: "Respiratory Rate (bpm)",
        data: vitals.respRate.map((vitalReading) => vitalReading.reading),
        borderColor: colors.respRate.normal,
        segment: {
          borderColor: (segment: any) =>
            updateColorByThreshold(segment, "respRate"),
        },
      } as Dataset);
    }

    return data;
  };

  const updateChartOptions = () => {
    const options = {
      responsive: true,
      maintainAspectRatio: true,
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
        annotation: {
          annotations: {},
        },
      },
    };

    if (selectedIndicators.normalRange) {
      options.plugins.annotation.annotations =
        showNormalRangeAnnotations(selectedVitals);
    }

    return options;
  };

  const handleSelectedVitalsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSelectedVitals({
      ...selectedVitals,
      [name]: checked,
    });
  };

  const handleSelectedIndicatorsChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setSelectedIndicators({
      ...selectedIndicators,
      [name]: checked,
    });
  };

  return (
    <>
      <Grid item xs={6}>
        <FormGroup id="vitals" sx={{ flexDirection: "row" }}>
          <FormLabel
            sx={{ display: "flex", alignItems: "center", marginRight: 2 }}
            component="legend">
            Vitals
          </FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                name="heartRate"
                checked={selectedVitals.heartRate}
                onChange={handleSelectedVitalsChange}
              />
            }
            label="Heart Rate"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="spO2"
                checked={selectedVitals.spO2}
                onChange={handleSelectedVitalsChange}
              />
            }
            label="Blood Oxygen"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="bloodPressure"
                checked={selectedVitals.bloodPressure}
                onChange={handleSelectedVitalsChange}
              />
            }
            label="Blood Pressure"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="temperature"
                checked={selectedVitals.temperature}
                onChange={handleSelectedVitalsChange}
              />
            }
            label="Temperature"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="respRate"
                checked={selectedVitals.respRate}
                onChange={handleSelectedVitalsChange}
              />
            }
            label="Respiratory Rate"
          />
        </FormGroup>
      </Grid>

      <Grid item xs={6}>
        <FormGroup id="indicators" sx={{ flexDirection: "row" }}>
          <FormLabel
            sx={{ display: "flex", alignItems: "center", marginRight: 2 }}
            component="legend">
            Indicators
          </FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                name="normalRange"
                checked={selectedIndicators.normalRange}
                onChange={handleSelectedIndicatorsChange}
              />
            }
            label="Normal Range"
          />
        </FormGroup>
      </Grid>
      <Line data={updateChartData()} options={updateChartOptions()} />
    </>
  );
}
