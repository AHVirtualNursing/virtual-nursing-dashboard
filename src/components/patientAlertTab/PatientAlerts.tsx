import { Alert, AlertVitals } from "@/types/alert";
import { Patient } from "@/types/patient";
import { fetchAlertsByPatientId } from "@/pages/api/patients_api";
import React, { useEffect, useState } from "react";
import AlertsTableRow from "../alerts/AlertsTableRow";

interface PatientProp {
  patient: Patient | undefined;
}

const PatientAlerts = (patientProp: PatientProp) => {
  const [statusCriteria, setStatusCriteria] = useState("");
  const [alertTypeCriteria, setAlertTypeCriteria] = useState("");
  const [vitalCriteria, setVitalCriteria] = useState("");
  const [nurseSearch, setNurseSearch] = useState("");
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetchAlertsByPatientId(patientProp.patient?._id).then((res) => {
      console.log("patient alerts", res);
      setAlerts(res);
    });
  }, [patientProp.patient?._id]);

  return (
    <div className="overflow-auto scrollbar bg-white rounded-lg shadow-lg p-4 h-auto max-h-[700px] space-y-3">
      <table className="table-auto md:table-fixed border-collapse w-full">
        <thead className="text-sm bg-slate-100">
          {/* ------ column headers ------ */}
          <tr>
            <TableHeader title="Status" />
            <TableHeader title="Alert Type" />
            <TableHeader title="Vital Type" colspan={2} />
            <TableHeader title="Description" />
            <TableHeader title="Bedside Nurse" />
            <TableHeader title="Time" />
          </tr>
        </thead>

        <tbody>
          <tr id="subheaders">
            <td id="status-filter">
              <select
                name="status-select"
                className="bg-white p-1 rounded-lg w-auto"
                value={statusCriteria}
                onChange={(e) => setStatusCriteria(e.target.value)}
              >
                <option value="">All</option>
                <option value="open">Open</option>
                <option value="handling">Handling</option>
                <option value="complete">Complete</option>
              </select>
            </td>
            <td id="alertType-filter">
              <select
                name="alertType-select"
                className="bg-white p-1 w-auto rounded-lg"
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
                className="bg-white p-1 w-auto rounded-lg"
                value={vitalCriteria}
                onChange={(e) => setVitalCriteria(e.target.value)}
              >
                <option value="">All Vitals</option>
                <option value="Heart Rate">HR</option>
                <option value="Blood Pressure">BP</option>
                <option value="Respiratory Rate">RR</option>
                <option value="SPO2">SPO2</option>
                <option value="Temperature">Temp</option>
              </select>
            </td>

            <td id="vital-reading" className="text-sm underline">
              Reading
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
              .filter((alert) =>
                alert.status.toLowerCase().includes(statusCriteria)
              )
              .filter((alert) => alert.alertType.includes(alertTypeCriteria))
              .filter((alert) =>
                alert.alertVitals.some((alertVital) =>
                  (alertVital as AlertVitals).vital.includes(vitalCriteria)
                )
              )
              .map((alert, index) => (
                <tr key={index}>
                  <td
                    className={`text-sm border-solid border-0 border-b border-slate-400`}
                  >
                    <button
                      className={`${
                        alert.status === "open"
                          ? "bg-red-400"
                          : alert.status === "handling"
                          ? "bg-orange-400"
                          : "bg-green-400"
                      } text-white py-1 px-3 rounded-lg w-auto uppercase pointer-events-none`}
                    >
                      {alert.status}
                    </button>
                  </td>
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
                    data={alert.notes[0]?.addedBy}
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

const TableHeader = ({
  title,
  colspan,
}: {
  title: string;
  colspan?: number;
}) => {
  return (
    <th
      className="p-2 uppercase text-xs font-bold"
      colSpan={colspan ? colspan : 1}
    >
      {title}
    </th>
  );
};

export default PatientAlerts;
