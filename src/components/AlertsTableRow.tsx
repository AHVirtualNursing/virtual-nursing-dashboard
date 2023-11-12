import { Alert, AlertVitals, NoteLog } from "@/types/alert";
import React from "react";

type AlertsTableRowProps = {
  id: string;
  data: string | string[] | number[] | undefined;
  width?: string;
};

const AlertsTableRow = ({ id, data, width }: AlertsTableRowProps) => {
  return (
    <td
      id={id}
      className={`text-sm p-3 w-${width} border-solid border-0 border-b border-slate-400`}
    >
      {typeof data === "object" && typeof data[0] === "string"
        ? data.map((value, index) => (
            <p key={index} className="whitespace-nowrap">
              {value}
            </p>
          ))
        : typeof data === "object" && typeof data[0] === "number"
        ? data.map((value, index) => <p key={index}>{value}</p>)
        : data}
    </td>
  );
};

export default AlertsTableRow;
