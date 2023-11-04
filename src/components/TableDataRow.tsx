import React from "react";

type TableDataRowProps = {
  id: string;
  width: string;
  data: string | string[] | number | undefined;
};

const TableDataRow = ({ id, width, data }: TableDataRowProps) => {
  return (
    <td
      id={id}
      className={`text-sm px-2 w-${width} border-solid border-0 border-l border-slate-400`}
    >
      {typeof data === "object" && data[0] && data[1]
        ? data[0] + "/" + data[1]
        : typeof data === "object"
        ? "-/-"
        : data
        ? data
        : "-"}
    </td>
  );
};

export default TableDataRow;
