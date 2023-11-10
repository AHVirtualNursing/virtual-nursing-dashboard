import PatientReport from "@/components/patientReport/patientReport";
import React from "react";

export default function AllReportsPage() {
  return (
    <div className="flex flex-col p-8 gap-8 bg-slate-100 w-full shadow-lg">
      <PatientReport viewType="all" />
    </div>
  );
}
