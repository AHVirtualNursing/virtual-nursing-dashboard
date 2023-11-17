import PatientReports from "@/components/patientReport/patientReports";
import React from "react";

export default function DischargeReportsPage() {
  return (
    <div className="flex flex-col p-8 gap-8 bg-slate-100 w-full shadow-lg">
      <PatientReports viewType="all" />
    </div>
  );
}
