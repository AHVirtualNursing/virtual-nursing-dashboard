import React from "react";

export default function Patients() {
  const patientData = [
    {
      name: "Jack Hunt",
      condition: "Lorem ipsum fhfjdf  iashdas  aids",
      bp: "120/80",
      adh: "70%",
      glucose: "115",
      hr: "96",
    },
    {
      name: "Mike Cont",
      condition: "Sugma",
      bp: "121/50",
      adh: "70%",
      glucose: "90",
      hr: "100",
    },
    {
      name: "Mike Oxlong",
      condition: "Ligma dasdsdasweefwe fsdf sf",
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

  return (
    <table className="table-auto w-full border-collapse">
      <thead className="text-sm bg-sky-200">
        <tr>
          <th className="p-2">Patient</th>
          <th>Condition</th>
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
          <td>Result</td>
          <td>Adh</td>
          <td>Level</td>
          <td>Updated:</td>
          <td>HR</td>
        </tr>
        {patientData.map((pd) => (
          <tr className="border-b border-black">
            <td className="text-sm py-2 w-1/5">{pd.name}</td>
            <td className="text-sm py-2 w-1/5">{pd.condition}</td>
            <td className="text-sm py-2 w-1/12">{pd.bp}</td>
            <td className="text-sm py-2 w-1/12">{pd.adh}</td>
            <td className="text-sm py-2 w-1/12">{pd.glucose}</td>
            <td className="text-sm py-2 w-1/12">1 day ago</td>
            <td className="text-sm py-2">{pd.hr}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
