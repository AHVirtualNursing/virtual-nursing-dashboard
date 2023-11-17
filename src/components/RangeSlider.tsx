import { Slider } from "@mui/material";
import React, { useState } from "react";

type RangeSliderProps = {
  min: number;
  max: number;
  lowerBound: number;
  upperBound: number;
  label: string;
  handleThresholds: Function;
};

const RangeSlider = ({
  min,
  max,
  lowerBound,
  upperBound,
  label,
  handleThresholds,
}: RangeSliderProps) => {
  const [value, setValue] = useState<number[]>([lowerBound, upperBound]);
  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 50,
      label: "50",
    },
    {
      value: 100,
      label: "100",
    },
    {
      value: 150,
      label: "150",
    },
    {
      value: 200,
      label: "200",
    },
  ];

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
    handleThresholds(newValue);
  };
  const [start, end] = value;

  return (
    <div className="flex gap-6 p-2">
      <span className="w-1/12">{label}</span>
      <Slider
        value={value}
        min={min}
        max={max}
        onChange={handleChange}
        valueLabelDisplay="on"
        marks={marks}
        disableSwap
        sx={{
          "& .MuiSlider-track": {
            background: "green",
            borderColor: "green",
          },
          "& .MuiSlider-thumb": {
            background: "white",
            "& span": {
              background: "black",
            },
          },
          "& .MuiSlider-rail": {
            opacity: 1,
            // background: `linear-gradient(to right, red 0 ${start}%, orange ${start}% ${innerStart}%, green ${innerStart}% ${innerEnd}%, orange ${innerEnd}% ${end}%, red ${end}% 100% )`,
            background: `linear-gradient(to right, red ${start}%, red ${end}%)`,
          },
          "& .MuiSlider-mark": {
            background: "none",
          },
        }}
      />
    </div>
  );
};

export default RangeSlider;
