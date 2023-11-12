import React, { useState } from "react";

type SelectFilterProps = {
  name: string;
  options: string[];
  changeSelectedOption: (value: React.SetStateAction<string>) => void;
  inTable: boolean;
  customStyle?: string;
  defaultValue?: string;
};

const SelectFilter = ({
  name,
  options,
  inTable,
  customStyle,
  defaultValue,
  changeSelectedOption,
}: SelectFilterProps) => {
  const [value, setSelectedValue] = useState<string>(
    defaultValue ? defaultValue : ""
  );
  return (
    <select
      name={name}
      id={name}
      value={value}
      className={`${
        inTable ? "bg-gray-50 p-1 mt-2" : "p-2 bg-gray-50"
      } w-auto rounded-lg border border-gray-300 text-gray-900 text-sm capitalize focus:ring-blue-500 focus:border-blue-500 p-2.5" ${
        customStyle ? customStyle : ""
      }`}
      onChange={(e) => {
        setSelectedValue(e.target.value);
        changeSelectedOption(e.target.value);
      }}
    >
      {options.map((option, index) => (
        <option key={index} value={option.includes("all") ? "" : option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default SelectFilter;
