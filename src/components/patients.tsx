import React, { useEffect, useState } from "react";

export default function Patients() {
  const patientData = [
    {
      id: 1,
      name: "Jack Hunt",
      condition: "Lorem ipsum fhfjdf  iashdas  aids",
      ward: "1",
      bed: "1",
      bp: "120/80",
      adh: "70%",
      glucose: "115",
      hr: "96",
    },
    {
      id: 2,
      name: "Mike Cont",
      condition: "Sugma",
      ward: "1",
      bed: "2",
      bp: "121/50",
      adh: "70%",
      glucose: "90",
      hr: "100",
    },
    {
      id: 3,
      name: "Mike Oxlong",
      condition: "Ligma dasdsdasweefwe fsdf sf",
      ward: "1",
      bed: "3",
      bp: "121/50",
      adh: "70%",
      glucose: "90",
      hr: "100",
    },
  ];

  const TableSearchbar = () => (
    <input
      className="placeholder:italic placeholder:text-slate-400 w-2/3 rounded-md placeholder:text-sm px-2 focus:outline-none focus:border-sky-500 border boder-slate-300"
      placeholder="Search"
      type="text"
      name="search"
    />
  );

  const [number, setNumber] = useState(0);
  // useEffect(() => {
  //   function getRandomInteger(min, max) {
  //     min = Math.ceil(min);
  //     max = Math.floor(max);
  //     return Math.floor(Math.random() * (max - min + 1)) + min;
  //   }
  //   const interval = setInterval(() => {
  //     const num = getRandomInteger(0, 100);
  //     setNumber(num);
  //   }, 2000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [number]);

  return (
    <table className="table-auto w-full border-collapse">
      <thead className="text-sm bg-sky-200">
        <tr>
          <th className="p-2">Patient</th>
          <th>Condition</th>
          <th>Bed</th>
          <th>Ward</th>
          <th colSpan={2}>Blood Pressure</th>
          <th colSpan={2}>Glucose</th>
          <th>Heart Rate</th>
          <th>Saturation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2">
            <TableSearchbar />
          </td>
          <td>
            <TableSearchbar />
          </td>
          <td></td>
          <td></td>
          <td className="text-sm">Result</td>
          <td className="text-sm">Adh</td>
          <td className="text-sm">Level</td>
          <td className="text-sm">Updated:</td>
          <td className="text-sm">HR</td>
        </tr>
        {patientData.map((pd) => (
          <tr className="border-b border-black" key={pd.id}>
            <td className="text-sm py-2 w-1/6">{pd.name}</td>
            <td className="text-sm py-2 w-1/6">{pd.condition}</td>
            <td className="text-sm py-2 w-1/12">{pd.bed}</td>
            <td className="text-sm py-2 w-1/12">{pd.ward}</td>
            <td className="text-sm py-2 w-1/12">{pd.bp}</td>
            <td className="text-sm py-2 w-1/12">{pd.adh}</td>
            <td className="text-sm py-2 w-1/12">{pd.glucose}</td>
            <td className="text-sm py-2 w-1/12">1 day ago</td>
            <td className="text-sm py-2">{pd.hr}</td>
            <td className="text-sm py-2">{number}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
