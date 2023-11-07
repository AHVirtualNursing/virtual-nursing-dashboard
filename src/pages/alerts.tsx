import React, { useEffect, useState } from "react";
import { fetchAllAlerts } from "./api/alerts_api";
import { fetchPatientByPatientId } from "./api/patients_api";
import { Alert } from "@/types/alert";
import { Patient } from "@/types/patient";
import TableDataRow from "@/components/TableDataRow";
import AlertsTableRow from "@/components/AlertsTableRow";

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>();
  const [patients, setPatients] = useState<Patient[] | undefined>();

  useEffect(() => {
    fetchAllAlerts().then((alertsList) => {
      setAlerts(alertsList.data);
      const patientIds = alertsList.data.map((alert: Alert) => alert.patient);
      let promises = patientIds.map((id: string) =>
        fetchPatientByPatientId(id)
      );
      Promise.all(promises).then((res) => {
        setPatients(res);
      });
    });
  }, [alerts?.length]);

  return (
    <div className="overflow-auto scrollbar p-4 bg-slate-200 w-full">
      <table className="table-auto border-collapse border-spacing-3">
        <thead className="text-sm text-left">
          {/* ------ column headers ------ */}
          <tr>
            <th>Patient</th>
            <th>Status</th>
            <th>Alert Type</th>
            <th>Vital Measurement</th>
            <th className="p-2">Description</th>
            <th className="p-1">Bedside Nurse</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {alerts &&
            alerts.map((alert, index) => (
              <tr key={index} className="text-left">
                <AlertsTableRow
                  id="patient-name"
                  width="1/12"
                  data={patients && patients[index].name}
                />
                <AlertsTableRow
                  id="alert-status"
                  width="1/12"
                  data={alert.status}
                />
                <AlertsTableRow
                  id="abnormal-vital"
                  data={alert.alertVitals.map((value) => value.vital)}
                />
                <AlertsTableRow
                  id="abnormal-vital-reading"
                  data={alert.alertVitals.map((value) => value.reading)}
                />
                <AlertsTableRow
                  id="alert-description"
                  data={alert.description}
                />
                <AlertsTableRow
                  id="handling-nurse"
                  width="1/12"
                  data={alert.handledBy}
                />
                <AlertsTableRow
                  id="alert-datetime"
                  data={alert.createdAt.replace("T", " ").substring(0, 16)}
                />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Alerts;
