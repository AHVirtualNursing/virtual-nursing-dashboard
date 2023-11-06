import React, { ChangeEvent, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  ChartData,
  CategoryScale,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
import { Patient } from "@/models/patient";
import { fetchVitalByVitalId } from "@/pages/api/vitals_api";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputAdornment,
  Modal,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  getGradient,
  updateBorderDash,
  updateChartOptions,
  vitalChartAttributes,
  updateLabels,
  getDateTime,
} from "./utils";
import { ModalBoxStyle } from "@/styles/StyleTemplates";

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
    threshold: false,
    exceedance: false,
    increasingTrend: false,
  });

  const [selectedTimeRange, setSelectedTimeRange] = useState("1D");

  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());
  const [showCustomDateRangeModal, setShowCustomDateRangeModal] =
    useState(false);

  useEffect(() => {
    fetchVitalData();
  }, []);

  const fetchVitalData = async () => {
    const res = await fetchVitalByVitalId(patient?.vital);
    setVitals(res);
  };

  const updateChartData = (chartId: string) => {
    const data: ChartData<"line"> = {
      labels: updateLabels(vitals.heartRate, selectedTimeRange),
      datasets: [] as Dataset[],
    };

    if (chartId == "chart1") {
      if (selectedVitals.heartRate) {
        data.datasets.push({
          label: "Heart Rate (bpm)",
          data: vitals.heartRate.map((vitalReading) => vitalReading.reading),
          borderColor: (context: any) => {
            return selectedIndicators.exceedance
              ? getGradient(context, "heartRate")
              : vitalChartAttributes.heartRate.normal;
          },
          segment: {
            borderDash: (segment: any) =>
              selectedIndicators.increasingTrend
                ? updateBorderDash(segment)
                : [],
          },
          yAxisID: vitalChartAttributes.heartRate.yScaleID,
        } as unknown as Dataset);
      }

      if (selectedVitals.spO2) {
        data.datasets.push({
          label: "Blood Oxygen (%)",
          data: vitals.spO2.map((vitalReading) => vitalReading.reading),
          borderColor: (context: any) => {
            return selectedIndicators.exceedance
              ? getGradient(context, "spO2")
              : vitalChartAttributes.spO2.normal;
          },
          segment: {
            borderDash: (segment: any) =>
              selectedIndicators.increasingTrend
                ? updateBorderDash(segment)
                : [],
          },
          yAxisID: vitalChartAttributes.spO2.yScaleID,
        } as unknown as Dataset);
      }

      if (selectedVitals.bloodPressure) {
        data.datasets.push({
          label: "Blood Pressure Systolic (mm Hg)",
          data: vitals.bloodPressureSys.map(
            (vitalReading) => vitalReading.reading
          ),
          borderColor: (context: any) => {
            return selectedIndicators.exceedance
              ? getGradient(context, "bloodPressureSys")
              : vitalChartAttributes.bloodPressure.normal;
          },
          segment: {
            borderDash: (segment: any) =>
              selectedIndicators.increasingTrend
                ? updateBorderDash(segment)
                : [],
          },
          yAxisID: vitalChartAttributes.bloodPressure.yScaleID,
        } as unknown as Dataset);
        data.datasets.push({
          label: "Blood Pressure Diastolic (mm Hg)",
          data: vitals.bloodPressureDia.map(
            (vitalReading) => vitalReading.reading
          ),
          borderColor: (context: any) => {
            return selectedIndicators.exceedance
              ? getGradient(context, "bloodPressureDia")
              : vitalChartAttributes.bloodPressure.normal;
          },
          segment: {
            borderDash: (segment: any) =>
              selectedIndicators.increasingTrend
                ? updateBorderDash(segment)
                : [],
          },
          yAxisID: vitalChartAttributes.bloodPressure.yScaleID,
        } as unknown as Dataset);
      }
    } else if (chartId == "chart2") {
      if (selectedVitals.temperature) {
        data.datasets.push({
          label: "Temperature (°C)",
          data: vitals.temperature.map((vitalReading) => vitalReading.reading),
          borderColor: (context: any) => {
            return selectedIndicators.exceedance
              ? getGradient(context, "temperature")
              : vitalChartAttributes.temperature.normal;
          },
          segment: {
            borderDash: (segment: any) =>
              selectedIndicators.increasingTrend
                ? updateBorderDash(segment)
                : [],
          },
          yAxisID: vitalChartAttributes.temperature.yScaleID,
        } as unknown as Dataset);
      }

      if (selectedVitals.respRate) {
        data.datasets.push({
          label: "Respiratory Rate (bpm)",
          data: vitals.respRate.map((vitalReading) => vitalReading.reading),
          borderColor: (context: any) => {
            return selectedIndicators.exceedance
              ? getGradient(context, "respRate")
              : vitalChartAttributes.respRate.normal;
          },
          segment: {
            borderDash: (segment: any) =>
              selectedIndicators.increasingTrend
                ? updateBorderDash(segment)
                : [],
          },
          yAxisID: vitalChartAttributes.respRate.yScaleID,
        } as unknown as Dataset);
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

  const handleSelectedTimeRangeChange = (
    _: React.MouseEvent<HTMLElement, MouseEvent>,
    value: string
  ) => {
    if (value != null && value != "custom") {
      setSelectedTimeRange(value);
    }
  };

  const handleShowCustomDateRangeModal = () => {
    setShowCustomDateRangeModal((prevState) => !prevState);
  };

  const handleUpdateCustomDateRange = () => {
    handleShowCustomDateRangeModal();
    setSelectedTimeRange(
      `${getDateTime(customStartDate)},${getDateTime(customEndDate)}`
    );
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
                name="threshold"
                checked={selectedIndicators.threshold}
                onChange={handleSelectedIndicatorsChange}
              />
            }
            label="Threshold"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="exceedance"
                checked={selectedIndicators.exceedance}
                onChange={handleSelectedIndicatorsChange}
              />
            }
            label="Exceedance"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="increasingTrend"
                checked={selectedIndicators.increasingTrend}
                onChange={handleSelectedIndicatorsChange}
              />
            }
            label="Increasing Trend"
          />
        </FormGroup>
      </Grid>
      <Box sx={{ height: 400 }} id="chart1">
        <Line
          data={updateChartData("chart1")}
          options={updateChartOptions(
            selectedVitals,
            selectedIndicators,
            {
              min: 0,
              max: 7,
            },
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
            {
              min: 0,
              max: 7,
            },
            "chart2"
          )}
        />
      </Box>
      <ToggleButtonGroup
        value={selectedTimeRange}
        exclusive
        onChange={handleSelectedTimeRangeChange}
        aria-label="text alignment">
        <ToggleButton value="12H" aria-label="left aligned">
          12H
        </ToggleButton>
        <ToggleButton value="1D" aria-label="left aligned">
          1D
        </ToggleButton>
        <ToggleButton value="3D" aria-label="left aligned">
          3D
        </ToggleButton>
        <ToggleButton value="all" aria-label="left aligned">
          All
        </ToggleButton>
        <ToggleButton
          value="custom"
          aria-label="left aligned"
          onClick={() => handleShowCustomDateRangeModal()}
          selected={
            selectedTimeRange.match(
              /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}),(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/g
            ) != null
          }>
          Custom
        </ToggleButton>
      </ToggleButtonGroup>
      <Modal
        open={showCustomDateRangeModal}
        onClose={handleShowCustomDateRangeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={ModalBoxStyle}>
          <Typography variant="h6" component="h2" sx={{ marginBottom: 2 }}>
            Select Date Range
          </Typography>
          <TextField
            label="Start Date and Time"
            type="datetime-local"
            value={new Date(customStartDate.getTime() + 8 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 16)}
            onChange={(e) => setCustomStartDate(new Date(e.target.value))}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="far fa-clock"></i>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="End Date and Time"
            type="datetime-local"
            value={new Date(customEndDate.getTime() + 8 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 16)}
            onChange={(e) => setCustomEndDate(new Date(e.target.value))}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="far fa-clock"></i>
                </InputAdornment>
              ),
            }}
          />
          <Grid item xs={12} sx={{ marginTop: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleUpdateCustomDateRange()}>
              Set Range
            </Button>
          </Grid>
        </Box>
      </Modal>
    </>
  );
}
