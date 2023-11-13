import PatientDischargeReportTemplate from "@/components/patientReport/patientDischargeReport";
import { useRouter } from "next/router";
import React from "react";

export default function DischargeReport() {
  const router = useRouter();
  const { patientId, vitalId, alertConfigId } = router.query;

  return (
    <PatientDischargeReportTemplate
      patientId={patientId as string}
      vitalId={vitalId as string}
      alertConfigId={alertConfigId as string}
    />
  );
}
