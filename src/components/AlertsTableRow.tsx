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
      className={`text-sm px-4 w-${width} border-solid border-0 border-l border-slate-400`}
    >
      {typeof data === "object" && typeof data[0] === "string"
        ? data.map((value) => (
            <div>
              <p>{value}</p>
              <hr />
            </div>
          ))
        : typeof data === "object" && typeof data[0] === "number"
        ? data.map((value) => <li>{value}</li>)
        : data}
    </td>
  );
};

export default AlertsTableRow;
