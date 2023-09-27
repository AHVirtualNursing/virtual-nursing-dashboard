import React from "react";

export default function Patients() {
  const patientData = [
    {
      name: "Jack Hunt",
      condition: "Ligma balls ay lmao goteem",
      bp: "120/80",
      adh: "70%",
      temp: "36.0",
      hr: "96",
    },
    {
      name: "Mike Cont",
      condition: "Sugma",
      bp: "121/50",
      adh: "70%",
      temp: "36.0",
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
    <table className="table-fixed w-full border-collapse">
      <thead className="text-sm bg-sky-200">
        <tr>
          <th className="p-2">Patient</th>
          <th>Condition</th>
          <th>Blood Pressure</th>
          <th>Temperature</th>
          <th>Heart Rate</th>
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
          <td className="flex justify-center gap-12 pt-4">
            <td className="text-xs font-bold">Result</td>
            <td className="text-xs font-bold">Adh</td>
          </td>
          <td>hello</td>
          <td>hello</td>
        </tr>
        {patientData.map((pd) => (
          <tr className="border-b border-black">
            <td className="text-sm py-2">{pd.name}</td>
            <td className="text-sm py-2">{pd.condition}</td>
            <td className="flex justify-center gap-12 pt-2">
              <td className="text-sm py-2">{pd.bp}</td>
              <td className="text-sm py-2">{pd.adh}</td>
            </td>
            <td className="text-sm py-2">{pd.temp}</td>
            <td className="text-sm py-2">{pd.hr}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
