import React from "react";

export default function TableSubHeader({
  subheaderText,
}: {
  subheaderText: string;
}) {
  return (
    <>
      <td className="text-xs underline break-words px-2">{subheaderText}</td>
    </>
  );
}
