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
  };
  const [start, innerStart, innerEnd, end] = value;

  return (
    <div className="flex gap-6 p-2">
      <span>{label}</span>
      <Slider
        value={value}
        min={0}
        max={100}
        onChange={handleChange}
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
