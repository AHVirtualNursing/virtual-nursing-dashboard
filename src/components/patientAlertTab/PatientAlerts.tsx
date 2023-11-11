import { Alert, AlertVitals } from "@/types/alert";
import { Patient } from "@/types/patient";
import { fetchAlertsByPatientId } from "@/pages/api/patients_api";
import React, { useEffect, useState } from "react";
import AlertsTableRow from "../AlertsTableRow";

interface PatientProp {
  patient: Patient | undefined;
}

const PatientAlerts = (patientProp: PatientProp) => {
  const [statusCriteria, setStatusCriteria] = useState("open");
  const [alertTypeCriteria, setAlertTypeCriteria] = useState("");
  const [vitalCriteria, setVitalCriteria] = useState("");
  const [nurseSearch, setNurseSearch] = useState("");
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetchAlertsByPatientId(patientProp.patient?._id).then((res) => {
      console.log(res);
      setAlerts(res);
    });
  }, [patientProp.patient?._id]);

  return (
    <div className="overflow-auto scrollbar p-2 bg-slate-200 w-full">
      <table className="table-auto border-spacing-3">
        <thead className="text-sm text-left">
          {/* ------ column headers ------ */}
          <tr>
            <th>Status</th>
            <th>Alert Type</th>
            <th>Vital Type</th>
            <th>Vital Measurement</th>
            <th className="px-2">Description</th>
            <th className="px-1">Bedside Nurse</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          <tr id="subheaders" className="text-left">
            <td id="status-filter">
              <select
                name="status-select"
                className="bg-white p-1 w-full"
                value={statusCriteria}
                onChange={(e) => setStatusCriteria(e.target.value)}
              >
                <option value="open">open</option>
                <option value="handling">handling</option>
                <option value="complete">complete</option>
              </select>
            </td>
            <td id="alertType-filter">
              <select
                name="alertType-select"
                className="bg-white p-1 w-full"
                value={alertTypeCriteria}
                onChange={(e) => {
                  setAlertTypeCriteria(e.target.value);
                }}
              >
                <option value="">All</option>
                <option value="Vital">Vital</option>
                <option value="SmartBed">SmartBed</option>
              </select>
            </td>
            <td id="vital-filter">
              <select
                name="vital-select"
                className="bg-white p-1 w-full"
                value={vitalCriteria}
                onChange={(e) => setVitalCriteria(e.target.value)}
              >
                <option value="">All</option>
                <option value="Heart Rate">HR</option>
                <option value="Blood Pressure">BP</option>
                <option value="Respiratory Rate">RR</option>
                <option value="SPO2">SPO2</option>
                <option value="Temperature">Temp</option>
              </select>
            </td>

            <td id="vital-reading" className="text-xs underline">
              Abnormal Reading
            </td>
            <td>{""}</td>

            <td id="nurse-filter">
              <input
                type="text"
                className="placeholder:italic placeholder:text-slate-400 w-2/3 rounded-md placeholder:text-sm p-2 focus:outline-none focus:border-sky-500 border boder-slate-300"
                placeholder="Search"
                value={nurseSearch}
                onChange={(e) => setNurseSearch(e.target.value)}
              />
            </td>
            <td></td>
          </tr>

          {alerts &&
            alerts
              .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
              .filter((alert) => alert.status === statusCriteria)
              .filter((alert) => alert.alertType.includes(alertTypeCriteria))
              .filter((alert) =>
                alert.alertVitals.some((alertVital) =>
                  (alertVital as AlertVitals).vital.includes(vitalCriteria)
                )
              )
              .map((alert, index) => (
                <tr
                  key={index}
                  className="text-left hover:bg-blue-200 cursor-pointer"
                >
                  <AlertsTableRow
                    id="alert-status"
                    width="1/12"
                    data={alert.status}
                  />
                  <AlertsTableRow id="alert-type" data={alert.alertType} />
                  <AlertsTableRow
                    id="abnormal-vital"
                    data={alert.alertVitals.map(
                      (value) => (value as AlertVitals).vital
                    )}
                  />
                  <AlertsTableRow
                    id="abnormal-vital-reading"
                    data={alert.alertVitals.map(
                      (value) => (value as AlertVitals).reading
                    )}
                  />
                  <AlertsTableRow
                    id="alert-description"
                    data={alert.description}
                  />
                  <AlertsTableRow
                    id="handling-nurse"
                    width="1/12"
                    data={alert.handledBy?.addedBy}
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

export default PatientAlerts;
