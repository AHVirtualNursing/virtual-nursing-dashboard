import { Slider } from "@mui/material";
import React, { useState } from "react";

type RangeSliderProps = {
  min: number;
  max: number;
  label: string;
};

function RangeSlider({ min, max, label }: RangeSliderProps) {
  const [value, setValue] = useState<number[]>([20, 40, 60, 80]);
  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 20,
      label: "20",
    },
    {
      value: 60,
      label: "60",
    },
    {
      value: 80,
      label: "80",
    },
    {
      value: 100,
      label: "100",
    },
  ];
  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };
  const [start, innerStart, innerEnd, end] = value;

  return (
    <div className="flex gap-6 p-2">
      <span className="w-1/12">{label}</span>
      <Slider
        value={value}
        min={0}
        max={100}
        onChange={handleChange}
        marks={marks}
        sx={{
          "& .MuiSlider-track": {
            background: "transparent",
            borderColor: "transparent",
          },
          "& .MuiSlider-thumb": {
            background: "white",
            "& span": {
              background: "black",
            },
          },
          "& .MuiSlider-rail": {
            opacity: 1,
            background: `linear-gradient(to right, red 0 ${start}%, orange ${start}% ${innerStart}%, green ${innerStart}% ${innerEnd}%, orange ${innerEnd}% ${end}%, red ${end}% )`,
          },
          "& .MuiSlider-mark": {
            background: "none",
          },
        }}
      />
    </div>
  );
}

export default RangeSlider;
