import { ChartOptions } from "chart.js";

export const vitalChartAttributes = {
  heartRate: {
    normal: "green",
    abnormal: "red",
    threshold: { min: 60, max: 100 },
    chartID: "chart1",
    yScaleID: "yLeftChart1",
  },
  spO2: {
    normal: "rgb(100, 149, 23)",
    abnormal: "red",
    threshold: { min: 95, max: 100 },
    chartID: "chart1",
    yScaleID: "yRightChart1",
  },
  bloodPressure: {
    normal: "rgb(100, 149, 237)",
    abnormal: "rgb(210, 4, 45)",
    threshold: {
      bloodPressureSys: {
        min: 90,
        max: 120,
      },
      bloodPressureDia: {
        min: 60,
        max: 80,
      },
    },
    chartID: "chart1",
    yScaleID: "yLeftChart1",
  },
  temperature: {
    normal: "green",
    abnormal: "red",
    threshold: { min: 36.2, max: 37.2 },
    chartID: "chart2",
    yScaleID: "yLeftChart2",
  },
  respRate: {
    normal: "rgb(100, 149, 237)",
    abnormal: "rgb(210, 4, 45)",
    threshold: { min: 12, max: 18 },
    chartID: "chart2",
    yScaleID: "yRightChart2",
  },
};

export const updateChartOptions = (
  selectedVitals: {
    bloodPressure: boolean;
    heartRate: boolean;
    spO2: boolean;
    temperature: boolean;
    respRate: boolean;
  },
  selectedIndicators: {
    threshold: boolean;
  },
  xRange: {
    min: number;
    max: number;
  },
  chartId: string
) => {
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {},
      title: {
        display: false,
        text: "Patient Vitals Chart",
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.05,
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
    scales: {
      y: {
        display:
          (!selectedVitals.heartRate &&
            !selectedVitals.bloodPressure &&
            !selectedVitals.spO2 &&
            chartId === "chart1") ||
          (!selectedVitals.respRate &&
            !selectedVitals.temperature &&
            chartId === "chart2"),
      },
      yLeftChart1: {
        display:
          chartId === "chart1" &&
          (selectedVitals.heartRate || selectedVitals.bloodPressure),
        position: "left",
      },
      yRightChart1: {
        display:
          selectedVitals.spO2 && chartId === vitalChartAttributes.spO2.chartID,
        position: "right",
      },
      yLeftChart2: {
        display:
          selectedVitals.temperature &&
          chartId === vitalChartAttributes.temperature.chartID,
        position: "left",
      },
      yRightChart2: {
        display:
          selectedVitals.respRate &&
          chartId === vitalChartAttributes.respRate.chartID,
        position: "right",
      },
    },
  };

  if (
    selectedIndicators.threshold &&
    options.plugins &&
    options.plugins.annotation
  ) {
    options.plugins.annotation.annotations = showNormalRangeAnnotations(
      selectedVitals,
      chartId
    );
  }

  return options;
};

const showNormalRangeAnnotations = (
  selectedVitals: {
    bloodPressure: boolean;
    heartRate: boolean;
    spO2: boolean;
    temperature: boolean;
    respRate: boolean;
  },
  chartId: string
) => {
  const normalRangeAnnotations: {
    [key: string]: any;
  } = {};

  if (
    selectedVitals.heartRate &&
    chartId === vitalChartAttributes.heartRate.chartID
  ) {
    normalRangeAnnotations.heartRateNormal = {
      type: "box",
      yMin: 60,
      yMax: 100,
      backgroundColor: "rgb(255, 191, 0, 0.25)",
      borderWidth: 0,
      yScaleID: vitalChartAttributes.heartRate.yScaleID,
    };

    normalRangeAnnotations.heartRateMinLabel = {
      type: "label",
      yValue: 59,
      color: "rgb(255, 162, 0)",
      content: ["Min Heart Rate (bpm)"],
      font: {
        size: 12,
      },
      yScaleID: vitalChartAttributes.heartRate.yScaleID,
    };

    normalRangeAnnotations.heartRateMaxLabel = {
      type: "label",
      yValue: 101,
      color: "rgb(255, 162, 0)",
      content: ["Max Heart Rate (bpm)"],
      font: {
        size: 12,
      },
      yScaleID: vitalChartAttributes.heartRate.yScaleID,
    };
  }

  if (selectedVitals.spO2 && chartId === vitalChartAttributes.spO2.chartID) {
    normalRangeAnnotations.spO2Normal = {
      type: "box",
      yMin: 95,
      yMax: 100,
      backgroundColor: "rgb(64, 224, 208, 0.25)",
      borderWidth: 0,
      yScaleID: vitalChartAttributes.spO2.yScaleID,
    };

    normalRangeAnnotations.spO2MinLabel = {
      type: "label",
      yValue: 94,
      color: "rgb(64, 200, 224)",
      content: ["Min Blood Oxygen (%)"],
      font: {
        size: 12,
      },
      yScaleID: vitalChartAttributes.spO2.yScaleID,
    };
  }

  if (
    selectedVitals.bloodPressure &&
    chartId === vitalChartAttributes.bloodPressure.chartID
  ) {
    normalRangeAnnotations.bloodPressureSysNormal = {
      type: "box",
      yMin: 90,
      yMax: 120,
      backgroundColor: "rgb(210, 4, 45, 0.25)",
      borderWidth: 0,
      yScaleID: vitalChartAttributes.bloodPressure.yScaleID,
    };

    normalRangeAnnotations.bloodPressureSysMinLabel = {
      type: "label",
      yValue: 89,
      color: "rgb(210, 4, 45)",
      content: ["Min Systolic Blood Pressure (mm Hg)"],
      font: {
        size: 12,
      },
      yScaleID: vitalChartAttributes.bloodPressure.yScaleID,
    };

    normalRangeAnnotations.bloodPressureSysMaxLabel = {
      type: "label",
      yValue: 121,
      content: ["Max Systolic Blood Pressure (mm Hg)"],
      color: "rgb(210, 4, 45)",
      font: {
        size: 12,
      },
      yScaleID: vitalChartAttributes.bloodPressure.yScaleID,
    };

    normalRangeAnnotations.bloodPressureDiaNormal = {
      type: "box",
      yMin: 60,
      yMax: 80,
      backgroundColor: "rgb(255, 117, 24, 0.25)",
      borderWidth: 0,
      yScaleID: vitalChartAttributes.bloodPressure.yScaleID,
    };

    normalRangeAnnotations.bloodPressureDiaMinLabel = {
      type: "label",
      yValue: 59,
      content: ["Min Diastolic Blood Pressure (mm Hg)"],
      color: "rgb(255, 117, 24)",
      font: {
        size: 12,
      },
      yScaleID: vitalChartAttributes.bloodPressure.yScaleID,
    };

    normalRangeAnnotations.bloodPressureDiaMaxLabel = {
      type: "label",
      yValue: 81,
      content: ["Max Diastolic Blood Pressure (mm Hg)"],
      color: "rgb(255, 117, 24)",
      font: {
        size: 12,
      },
      yScaleID: vitalChartAttributes.bloodPressure.yScaleID,
    };
  }

  if (
    selectedVitals.temperature &&
    chartId === vitalChartAttributes.temperature.chartID
  ) {
    normalRangeAnnotations.temperatureNormal = {
      type: "box",
      yMin: 36.2,
      yMax: 37.2,
      backgroundColor: "rgb(64, 224, 208, 0.25)",
      borderWidth: 0,
      yScaleID: vitalChartAttributes.temperature.yScaleID,
    };

    normalRangeAnnotations.temperatureMinLabel = {
      type: "label",
      yValue: 36.1,
      color: "rgb(64, 200, 224)",
      content: ["Min Temperature (°C)"],
      font: {
        size: 12,
      },
      yScaleID: vitalChartAttributes.temperature.yScaleID,
    };

    normalRangeAnnotations.temperatureMaxLabel = {
      type: "label",
      yValue: 37.3,
      color: "rgb(64, 200, 224)",
      content: ["Max Temperature (°C)"],
      font: {
        size: 12,
      },
      yScaleID: vitalChartAttributes.temperature.yScaleID,
    };
  }

  if (
    selectedVitals.respRate &&
    chartId === vitalChartAttributes.respRate.chartID
  ) {
    normalRangeAnnotations.respRateNormal = {
      type: "box",
      yMin: 12,
      yMax: 18,
      backgroundColor: "rgb(47,79,79, 0.25)",
      borderWidth: 0,
      yScaleID: vitalChartAttributes.respRate.yScaleID,
    };

    normalRangeAnnotations.respRateMinLabel = {
      type: "label",
      yValue: 11.8,
      color: "rgb(47,79,79)",
      content: ["Min Respiratory Rate (breaths per minute)"],
      font: {
        size: 12,
      },
      yScaleID: vitalChartAttributes.respRate.yScaleID,
    };

    normalRangeAnnotations.respRateMaxLabel = {
      type: "label",
      yValue: 18.2,
      color: "rgb(47,79,79)",
      content: ["Max Respiratory Rate (breaths per minute)"],
      font: {
        size: 12,
      },
      yScaleID: vitalChartAttributes.respRate.yScaleID,
    };
  }

  return normalRangeAnnotations;
};

export const updateBorderDash = (reading: any) => {
  const p0 = reading.p0.raw;
  const p1 = reading.p1.raw;

  if (p1 > p0) {
    return [5, 5];
  }
};

export const getGradient = (
  context: any,
  vitalType:
    | "heartRate"
    | "spO2"
    | "bloodPressureSys"
    | "bloodPressureDia"
    | "temperature"
    | "respRate"
) => {
  const chart = context.chart;
  const { ctx, chartArea } = chart;

  const isBloodPressure =
    vitalType === "bloodPressureSys" || vitalType === "bloodPressureDia";

  const yAxisScale = isBloodPressure
    ? chart.scales[vitalChartAttributes.bloodPressure.yScaleID]
    : chart.scales[vitalChartAttributes[vitalType].yScaleID];

  if (!chartArea) {
    return;
  }

  const height = chart.height;

  const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);

  let yThresholdMax = yAxisScale.getPixelForValue(
    isBloodPressure
      ? vitalChartAttributes.bloodPressure.threshold[vitalType].max
      : vitalChartAttributes[vitalType].threshold.max
  );

  let yThresholdMin = yAxisScale.getPixelForValue(
    isBloodPressure
      ? vitalChartAttributes.bloodPressure.threshold[vitalType].min
      : vitalChartAttributes[vitalType].threshold.min
  );

  if (yThresholdMax !== -32768) {
    let offsetMax = yThresholdMax / height;
    let offsetMin = yThresholdMin / height;

    if (0 < offsetMax && offsetMax < 1 && 0 < offsetMin && offsetMin < 1) {
      if (
        vitalType == "bloodPressureSys" ||
        vitalType == "bloodPressureDia" ||
        vitalType == "respRate"
      ) {
        gradient.addColorStop(0, vitalChartAttributes.bloodPressure.abnormal);
        gradient.addColorStop(
          offsetMin,
          vitalChartAttributes.bloodPressure.normal
        );
        gradient.addColorStop(
          offsetMin,
          vitalChartAttributes.bloodPressure.abnormal
        );
        gradient.addColorStop(
          offsetMax,
          vitalChartAttributes.bloodPressure.abnormal
        );
        gradient.addColorStop(
          offsetMax,
          vitalChartAttributes.bloodPressure.normal
        );
        gradient.addColorStop(1, vitalChartAttributes.bloodPressure.abnormal);
      } else if (vitalType == "heartRate" || vitalType == "temperature") {
        gradient.addColorStop(0, vitalChartAttributes.heartRate.abnormal);
        gradient.addColorStop(offsetMin, vitalChartAttributes.heartRate.normal);
        gradient.addColorStop(
          offsetMin,
          vitalChartAttributes.heartRate.abnormal
        );
        gradient.addColorStop(
          offsetMax,
          vitalChartAttributes.heartRate.abnormal
        );
        gradient.addColorStop(offsetMax, vitalChartAttributes.heartRate.normal);
        gradient.addColorStop(1, vitalChartAttributes.heartRate.abnormal);
      }
      // spO2
    } else if (offsetMax < 0 && offsetMax > -1) {
      gradient.addColorStop(0, vitalChartAttributes.spO2.normal);
      gradient.addColorStop(offsetMin, vitalChartAttributes.spO2.normal);
      gradient.addColorStop(offsetMin, vitalChartAttributes.spO2.abnormal);
    } else if (offsetMin < 0 && offsetMax > -1) {
      gradient.addColorStop(offsetMax, vitalChartAttributes.spO2.abnormal);
      gradient.addColorStop(offsetMax, vitalChartAttributes.spO2.normal);
      gradient.addColorStop(1, vitalChartAttributes.spO2.normal);
    }
  }
  return gradient;
};

interface Label {
  datetime: string;
}

export const updateLabels = (labels: Label[], timeRange: string) => {
  let updatedLabels: Label[] = [];
  let previousDate = "";

  if (timeRange == "12H") {
    updatedLabels = labels.filter((vitalReading) => {
      const minDatetime = new Date();
      minDatetime.setHours(minDatetime.getHours() - 12);
      return vitalReading.datetime >= getDateTime(minDatetime);
    });
  } else if (timeRange == "1D") {
    updatedLabels = labels.filter((vitalReading) => {
      const currentDate = new Date(vitalReading.datetime)
        .setHours(0, 0, 0, 0)
        .toString();
      return vitalReading.datetime >= currentDate;
    });
  } else if (timeRange == "3D") {
    updatedLabels = labels.filter((vitalReading) => {
      const minDatetime = new Date();
      minDatetime.setDate(minDatetime.getDate() - 2);
      return vitalReading.datetime >= getDateTime(minDatetime);
    });
  } else if (timeRange == "all") {
    updatedLabels = labels;
  } else if (
    timeRange &&
    timeRange.match(
      /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}),(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/g
    )
  ) {
    const minTimeRange = timeRange.split(",")[0];
    const maxTimeRange = timeRange.split(",")[1];

    updatedLabels = labels.filter(
      (vitalReading) =>
        vitalReading.datetime >= minTimeRange &&
        vitalReading.datetime <= maxTimeRange
    );
  }

  return updatedLabels
    .sort((a, b) => {
      return a.datetime.localeCompare(b.datetime);
    })
    .map((vitalReading) => {
      const currentDate = vitalReading.datetime.slice(0, 10);

      if (currentDate !== previousDate) {
        previousDate = currentDate;
        return currentDate;
      }

      return vitalReading.datetime.slice(11, -3);
    });
};

export const getDateTime = (date: Date = new Date()) => {
  function twoDigit(n: number) {
    return (n < 10 ? "0" : "") + n;
  }

  return (
    "" +
    date.getFullYear() +
    "-" +
    twoDigit(date.getMonth() + 1) +
    "-" +
    twoDigit(date.getDate()) +
    " " +
    twoDigit(date.getHours()) +
    ":" +
    twoDigit(date.getMinutes())
  );
};
