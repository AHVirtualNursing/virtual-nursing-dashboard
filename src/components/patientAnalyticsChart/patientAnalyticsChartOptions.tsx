export const showNormalRangeAnnotations = (selectedVitals: {
  bloodPressure: boolean;
  heartRate: boolean;
  spO2: boolean;
}) => {
  const normalRangeAnnotations: {
    [key: string]: any;
  } = {};

  if (selectedVitals.heartRate) {
    normalRangeAnnotations.heartRateMin = {
      type: "line",
      yMin: 60,
      yMax: 60,
      borderColor: "rgb(255, 191, 0)",
      borderWidth: 2,
    };

    normalRangeAnnotations.heartRateMinLabel = {
      type: "label",
      xValue: 5,
      yValue: 61,
      color: "rgb(255, 191, 0)",
      content: ["Min Heart Rate (bpm)"],
      font: {
        size: 12,
      },
    };

    normalRangeAnnotations.heartRateMax = {
      type: "line",
      yMin: 100,
      yMax: 100,
      borderColor: "rgb(255, 191, 0)",
      borderWidth: 2,
    };

    normalRangeAnnotations.heartRateMaxLabel = {
      type: "label",
      yValue: 101,
      color: "rgb(255, 191, 0)",
      content: ["Max Heart Rate (bpm)"],
      font: {
        size: 12,
      },
    };
  }

  if (selectedVitals.spO2) {
    normalRangeAnnotations.spO2Min = {
      type: "line",
      yMin: 95,
      yMax: 95,
      borderColor: "rgb(64, 224, 208)",
      borderWidth: 2,
    };

    normalRangeAnnotations.spO2MinLabel = {
      type: "label",
      yValue: 96,
      color: "rgb(64, 224, 208)",
      content: ["Min Blood Oxygen (%)"],
      font: {
        size: 12,
      },
    };
  }

  if (selectedVitals.bloodPressure) {
    normalRangeAnnotations.bloodPressureSysMin = {
      type: "line",
      yMin: 90,
      yMax: 90,
      borderColor: "rgb(210, 4, 45)",
      borderWidth: 2,
    };

    normalRangeAnnotations.bloodPressureSysMinLabel = {
      type: "label",
      yValue: 92,
      color: "rgb(210, 4, 45)",
      content: ["Min Systolic Blood Pressure (mm Hg)"],
      font: {
        size: 12,
      },
    };

    normalRangeAnnotations.bloodPressureSysMax = {
      type: "line",
      yMin: 120,
      yMax: 120,
      borderColor: "rgb(210, 4, 45)",
      borderWidth: 2,
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
      type: "line",
      yMin: 60,
      yMax: 60,
      borderColor: "rgb(255, 117, 24)",
      borderWidth: 2,
    };

    normalRangeAnnotations.bloodPressureDiaMinLabel = {
      type: "label",
      xValue: 3,
      yValue: 61,
      content: ["Min Diastolic Blood Pressure (mm Hg)"],
      color: "rgb(255, 117, 24)",
      font: {
        size: 12,
      },
    };

    normalRangeAnnotations.bloodPressureDiaMax = {
      type: "line",
      yMin: 80,
      yMax: 80,
      borderColor: "rgb(255, 117, 24)",
      borderWidth: 2,
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

  return normalRangeAnnotations;
};
