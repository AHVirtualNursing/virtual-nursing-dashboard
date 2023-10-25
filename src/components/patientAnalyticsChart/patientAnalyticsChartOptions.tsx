export const showNormalRangeAnnotations = (selectedVitals: {
  bloodPressure: boolean;
  heartRate: boolean;
  spO2: boolean;
  temperature: boolean;
  respRate: boolean;
}) => {
  const normalRangeAnnotations: {
    [key: string]: any;
  } = {};

  if (selectedVitals.heartRate) {
    normalRangeAnnotations.heartRateMin = {
      type: "box",
      yMin: 60,
      yMax: 100,
      backgroundColor: "rgb(255, 191, 0, 0.25)",
      borderWidth: 0,
    };

    normalRangeAnnotations.heartRateMinLabel = {
      type: "label",
      yValue: 59,
      color: "rgb(255, 162, 0)",
      content: ["Min Heart Rate (bpm)"],
      font: {
        size: 12,
      },
    };

    normalRangeAnnotations.heartRateMaxLabel = {
      type: "label",
      yValue: 101,
      color: "rgb(255, 162, 0)",
      content: ["Max Heart Rate (bpm)"],
      font: {
        size: 12,
      },
    };
  }

  if (selectedVitals.spO2) {
    normalRangeAnnotations.spO2Min = {
      type: "box",
      yMin: 95,
      yMax: 100,
      backgroundColor: "rgb(64, 224, 208, 0.25)",
      borderWidth: 0,
    };

    normalRangeAnnotations.spO2MinLabel = {
      type: "label",
      yValue: 94,
      color: "rgb(64, 200, 224)",
      content: ["Min Blood Oxygen (%)"],
      font: {
        size: 12,
      },
    };
  }

  if (selectedVitals.bloodPressure) {
    normalRangeAnnotations.bloodPressureSysMin = {
      type: "box",
      yMin: 90,
      yMax: 120,
      backgroundColor: "rgb(210, 4, 45, 0.25)",
      borderWidth: 0,
    };

    normalRangeAnnotations.bloodPressureSysMinLabel = {
      type: "label",
      yValue: 89,
      color: "rgb(210, 4, 45)",
      content: ["Min Systolic Blood Pressure (mm Hg)"],
      font: {
        size: 12,
      },
    };

    normalRangeAnnotations.bloodPressureSysMaxLabel = {
      type: "label",
      yValue: 121,
      content: ["Max Systolic Blood Pressure (mm Hg)"],
      color: "rgb(210, 4, 45)",
      font: {
        size: 12,
      },
    };

    normalRangeAnnotations.bloodPressureDiaMin = {
      type: "box",
      yMin: 60,
      yMax: 80,
      backgroundColor: "rgb(255, 117, 24, 0.25)",
      borderWidth: 0,
    };

    normalRangeAnnotations.bloodPressureDiaMinLabel = {
      type: "label",
      yValue: 59,
      content: ["Min Diastolic Blood Pressure (mm Hg)"],
      color: "rgb(255, 117, 24)",
      font: {
        size: 12,
      },
    };

    normalRangeAnnotations.bloodPressureDiaMaxLabel = {
      type: "label",
      yValue: 81,
      content: ["Max Diastolic Blood Pressure (mm Hg)"],
      color: "rgb(255, 117, 24)",
      font: {
        size: 12,
      },
    };
  }

  if (selectedVitals.temperature) {
    normalRangeAnnotations.temperature = {
      type: "box",
      yMin: 36.2,
      yMax: 37.2,
      backgroundColor: "rgb(64, 224, 208, 0.25)",
      borderWidth: 0,
    };

    normalRangeAnnotations.temperatureMinLabel = {
      type: "label",
      yValue: 36.1,
      color: "rgb(64, 200, 224)",
      content: ["Min Temperature (°C)"],
      font: {
        size: 12,
      },
    };

    normalRangeAnnotations.temperatureMaxLabel = {
      type: "label",
      yValue: 37.3,
      color: "rgb(64, 200, 224)",
      content: ["Max Temperature (°C)"],
      font: {
        size: 12,
      },
    };
  }

  if (selectedVitals.respRate) {
    normalRangeAnnotations.respRate = {
      type: "box",
      yMin: 12,
      yMax: 18,
      backgroundColor: "rgb(47,79,79, 0.25)",
      borderWidth: 0,
    };

    normalRangeAnnotations.respRateMinLabel = {
      type: "label",
      yValue: 11,
      color: "rgb(47,79,79)",
      content: ["Min Respiratory Rate (breaths per minute)"],
      font: {
        size: 12,
      },
    };

    normalRangeAnnotations.respRateMaxLabel = {
      type: "label",
      yValue: 19,
      color: "rgb(47,79,79)",
      content: ["Max Respiratory Rate (breaths per minute)"],
      font: {
        size: 12,
      },
    };
  }

  return normalRangeAnnotations;
};
