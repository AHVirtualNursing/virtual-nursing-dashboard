import React, { useEffect, useState } from "react";
import { fetchAllAlerts } from "./api/alerts_api";
import { fetchPatientByPatientId } from "./api/patients_api";
import { Alert } from "@/types/alert";
import AlertsTableRow from "@/components/AlertsTableRow";
import AlertDetailsModal from "@/components/AlertDetailsModal";

type AlertPatientMapping = {
  alert: Alert;
  patient: string;
};

const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertPatientMapping[]>();
  const [patientSearch, setPatientSearch] = useState<string>("");
  const [nurseSearch, setNurseSearch] = useState<string>("");
  const [statusCriteria, setStatusCriteria] = useState("open");
  const [vitalCriteria, setVitalCriteria] = useState("");
  const [alertTypeCriteria, setAlertTypeCriteria] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<AlertPatientMapping>();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    fetchAllAlerts().then((alertsList) => {
      const patientIds = alertsList.data.map((alert: Alert) => alert.patient);
      let promises = patientIds.map((id: string) =>
        fetchPatientByPatientId(id)
      );
      Promise.all(promises).then((res) => {
        const alertToPatientMappings = alertsList.data.map(
          (alert: Alert, index: number) => ({
            alert: alert,
            patient: res[index].name,
          })
        );
        setAlerts(alertToPatientMappings);
      });
    });
  }, [alerts?.length]);

  const handleViewAlertDetails = (alertMapping: AlertPatientMapping) => {
    setSelectedAlert(alertMapping);
    setShown(true);
  };

  return (
    <div className="overflow-auto scrollbar p-2 bg-slate-200 w-full">
      {shown && (
        <AlertDetailsModal
          pressed={shown}
          setShown={setShown}
          alertPatientMapping={selectedAlert}
        />
      )}
      <table className="table-auto border-spacing-3">
        <thead className="text-sm text-left">
          {/* ------ column headers ------ */}
          <tr>
            <th>Patient</th>
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
            <td id="patient-filter">
              <input
                type="text"
                className="placeholder:italic placeholder:text-slate-400 w-2/3 rounded-md placeholder:text-sm p-2 focus:outline-none focus:border-sky-500 border boder-slate-300"
                placeholder="Search"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
              />
            </td>
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
                  console.log(e.target.value);
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
              .sort(
                (a, b) =>
                  +new Date(b.alert.createdAt) - +new Date(a.alert.createdAt)
              )
              .filter((alertMapping) =>
                alertMapping.patient.toLowerCase().includes(patientSearch)
              )
              .filter(
                (alertMapping) => alertMapping.alert.status === statusCriteria
              )
              .filter((alertMapping) =>
                alertMapping.alert.alertType.includes(alertTypeCriteria)
              )
              .filter((alertMapping) =>
                alertMapping.alert.alertVitals.some((alertVital) =>
                  alertVital.vital.includes(vitalCriteria)
                )
              )
              .map((alertMapping, index) => (
                <tr
                  key={index}
                  className="text-left hover:bg-blue-300"
                  onClick={() => handleViewAlertDetails(alertMapping)}
                >
                  <AlertsTableRow
                    id="patient-name"
                    width="1/12"
                    data={alertMapping.patient}
                  />
                  <AlertsTableRow
                    id="alert-status"
                    width="1/12"
                    data={alertMapping.alert.status}
                  />
                  <AlertsTableRow
                    id="alert-type"
                    data={alertMapping.alert.alertType}
                  />
                  <AlertsTableRow
                    id="abnormal-vital"
                    data={alertMapping.alert.alertVitals.map(
                      (value) => value.vital
                    )}
                  />
                  <AlertsTableRow
                    id="abnormal-vital-reading"
                    data={alertMapping.alert.alertVitals.map(
                      (value) => value.reading
                    )}
                  />
                  <AlertsTableRow
                    id="alert-description"
                    data={alertMapping.alert.description}
                  />
                  <AlertsTableRow
                    id="handling-nurse"
                    width="1/12"
                    data={alertMapping.alert.handledBy}
                  />
                  <AlertsTableRow
                    id="alert-datetime"
                    data={alertMapping.alert.createdAt
                      .replace("T", " ")
                      .substring(0, 16)}
                  />
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default Alerts;
