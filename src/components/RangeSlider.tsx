import React from "react";

type RangeSliderProps = {
  min: number;
  max: number;
  label: string;
};

function RangeSlider({ min, max, label }: RangeSliderProps) {
  return (
    <div className="flex gap-6 p-4">
      <label htmlFor={label}>{label}</label>
      <input type="range" name={label} className="w-full" />
    </div>
  );
}

export default RangeSlider;
