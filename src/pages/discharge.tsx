import PatientDischargeReportTemplate from "@/components/patientReport/patientDischargeReportTemplate";
import { AlertConfig } from "@/models/alertConfig";
import { Patient } from "@/models/patient";
import { Vital } from "@/types/vital";
import React, { useContext, useEffect, useState } from "react";
import { callFetchAlertConfigByIdApi } from "./api/alert_config_api";
import { fetchPatientByPatientId } from "./api/patients_api";
import { fetchVitalByVitalId } from "./api/vitals_api";
import { SocketContext } from "./layout";

export default function DischargeReport() {
  const [patient, setPatient] = useState<Patient>();
  const [hazel, setHazel] = useState<Patient>();
  const [vitals, setVitals] = useState<Vital>();
  const [alertConfigs, setAlertConfigs] = useState<AlertConfig>();
  const socket = useContext(SocketContext);

  useEffect(() => {
    fetchHazel();

    socket.send("dvsClientConnections", "6549de24cd9ce75b5b6217d2");
  }, []);

  useEffect(() => {
    socket.on("dischargePatient", (data) => {
      fetchPatient(data._id);
      fetchVitals(data.vital);
      fetchAlertConfig(data.alertConfig);
    });
  });

  const fetchPatient = async (patientId: string) => {
    const patient = await fetchPatientByPatientId(patientId);
    setPatient(patient);
  };

  const fetchHazel = async () => {
    const patient = await fetchPatientByPatientId("6549de1dcd9ce75b5b6217b1");
    console.log(patient);
    setHazel(patient);
  };

  const fetchVitals = async (vitalId: string) => {
    const vitals = await fetchVitalByVitalId(vitalId);
    setVitals(vitals);
  };

  const fetchAlertConfig = async (alertConfigId: string) => {
    const alertConfigs = await callFetchAlertConfigByIdApi(alertConfigId);
    setAlertConfigs(alertConfigs);
  };

  return (
    <>
      <button
        onClick={() =>
          socket.emit("dischargePatient", [hazel, "6549de24cd9ce75b5b6217d2"])
        }>
        discharge patient
      </button>
      {patient && (
        <PatientDischargeReportTemplate
          patient={patient}
          vitals={vitals}
          alertConfigs={alertConfigs}
        />
      )}
    </>
  );
}
