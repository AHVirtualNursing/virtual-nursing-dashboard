import React, { ChangeEvent, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  ChartData,
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
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Grid,
} from "@mui/material";
import {
  vitalChartAttributes,
  getGradient,
  updateBorderDash,
  updateChartOptions,
  updateColorByThreshold,
} from "./utils";

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
    heartRate: true,
    bloodPressure: false,
    spO2: false,
    temperature: false,
    respRate: false,
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

  const updateChartData = (chartId: string) => {
    const data: ChartData<"line"> = {
      labels: vitals.heartRate.map(
        (vitalReading) => vitalReading.datetime.split(" ")[1]
      ),
      datasets: [] as Dataset[],
    };

    if (chartId == "chart1") {
      if (selectedVitals.heartRate) {
        data.datasets.push({
          label: "Heart Rate (bpm)",
          data: vitals.heartRate.map((vitalReading) => vitalReading.reading),
          borderColor: (context: any) => {
            return getGradient(context, "heartRate");
          },
          segment: {
            borderDash: (segment: any) => updateBorderDash(segment),
          },
          yAxisID: "yLeftChart1",
        } as unknown as Dataset);
      }

      if (selectedVitals.spO2) {
        data.datasets.push({
          label: "Blood Oxygen (%)",
          data: vitals.spO2.map((vitalReading) => vitalReading.reading),
          borderColor: (context: any) => {
            return getGradient(context, "spO2");
          },
          segment: {
            borderDash: (segment: any) => updateBorderDash(segment),
          },
          yAxisID: "yRightChart1",
        } as unknown as Dataset);
      }

      if (selectedVitals.bloodPressure) {
        data.datasets.push({
          label: "Blood Pressure Systolic (mm Hg)",
          data: vitals.bloodPressureSys.map(
            (vitalReading) => vitalReading.reading
          ),
          borderColor: (context: any) => {
            return getGradient(context, "bloodPressureSys");
          },
          segment: {
            borderDash: (segment: any) => updateBorderDash(segment),
          },
          yAxisID: "yLeftChart1",
        } as unknown as Dataset);
        data.datasets.push({
          label: "Blood Pressure Diastolic (mm Hg)",
          data: vitals.bloodPressureDia.map(
            (vitalReading) => vitalReading.reading
          ),
          borderColor: (context: any) => {
            return getGradient(context, "bloodPressureDia");
          },
          segment: {
            borderDash: (segment: any) => updateBorderDash(segment),
          },
          yAxisID: "yLeftChart1",
        } as unknown as Dataset);
      }
    } else if (chartId == "chart2") {
      if (selectedVitals.temperature) {
        data.datasets.push({
          label: "Temperature (°C)",
          data: vitals.temperature.map((vitalReading) => vitalReading.reading),
          borderColor: (context: any) => {
            return getGradient(context, "temperature");
          },
          segment: {
            borderDash: (segment: any) => updateBorderDash(segment),
          },
          yAxisID: "yLeftChart2",
        } as unknown as Dataset);
      }

      if (selectedVitals.respRate) {
        data.datasets.push({
          label: "Respiratory Rate (bpm)",
          data: vitals.respRate.map((vitalReading) => vitalReading.reading),
          borderColor: vitalChartAttributes.respRate.normal,
          segment: {
            borderColor: (segment: any) =>
              updateColorByThreshold(segment, "respRate"),
            borderDash: (segment: any) => updateBorderDash(segment),
          },
          yAxisID: "yRightChart2",
        } as Dataset);
      }
    }
    return data;
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
      <Box sx={{ height: 400 }} id="chart1">
        <Line
          data={updateChartData("chart1")}
          options={updateChartOptions(
            selectedVitals,
            selectedIndicators,
            "chart1"
          )}
        />
      </Box>
      <Box sx={{ height: 400 }} id="chart2">
        <Line
          data={updateChartData("chart2")}
          options={updateChartOptions(
            selectedVitals,
            selectedIndicators,
            "chart2"
          )}
        />
      </Box>
    </>
  );
}
