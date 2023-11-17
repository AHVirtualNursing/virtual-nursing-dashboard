import { Alert, AlertVitals } from "@/types/alert";
import { Patient } from "@/types/patient";
import { fetchAlertsByPatientId } from "@/pages/api/patients_api";
import React, { useContext, useEffect, useState } from "react";
import AlertsTableRow from "../alerts/AlertsTableRow";
import { SocketContext } from "@/pages/layout";
import AlertDetailsModal from "../alerts/AlertDetailsModal";
import SelectFilter from "../SelectFilter";

interface PatientProp {
  patient: Patient | undefined;
  forDischargeReport?: boolean;
}

const PatientAlerts = (patientProp: PatientProp) => {
  const [statusCriteria, setStatusCriteria] = useState("");
  const [alertTypeCriteria, setAlertTypeCriteria] = useState("");
  const [vitalCriteria, setVitalCriteria] = useState("");
  const [nurseSearch, setNurseSearch] = useState("");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [socketData, setSocketData] = useState<Alert>();
  const [shown, setShown] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert>();
  const socket = useContext(SocketContext);

  useEffect(() => {
    const handleUpdatedAlert = (data: any) => {
      console.log(data);
      setSocketData(data);
    };
    socket.on("updatedAlert", handleUpdatedAlert);
    return () => {
      socket.off("updatedAlert");
    };
  }, [socket]);

  useEffect(() => {
    fetchAlertsByPatientId(patientProp.patient?._id).then((res) => {
      setAlerts(res);
    });
  }, [patientProp.patient?._id, socketData]);

  const handleViewAlertDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setShown(true);
  };

  const filteredAlerts =
    alerts &&
    alerts
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .filter((alert) => {
        const include =
          alert.status.toLowerCase().includes(statusCriteria) &&
          alert.alertType.toLowerCase().includes(alertTypeCriteria) &&
          (vitalCriteria === ""
            ? true
            : alert.alertVitals.some((alertVital) =>
                (alertVital as AlertVitals).vital
                  .toLowerCase()
                  .includes(vitalCriteria)
              )) &&
          (nurseSearch === ""
            ? true
            : alert.notes[0]?.addedBy.toLowerCase().includes(nurseSearch));
        return include;
      });

  return (
    <>
      {shown && (
        <AlertDetailsModal
          pressed={shown}
          setShown={setShown}
          alert={selectedAlert}
        />
      )}
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
                <SelectFilter
                  name="statusSelect"
                  options={["all", "open", "handling", "complete"]}
                  changeSelectedOption={setStatusCriteria}
                  inTable={true}
                />
              </td>
              <td id="alertType-filter">
                <SelectFilter
                  name="alertTypeSelect"
                  options={["all", "vital", "smartbed"]}
                  changeSelectedOption={setAlertTypeCriteria}
                  inTable={true}
                />
              </td>
              <td id="vital-filter">
                <SelectFilter
                  name="vitalFilter"
                  options={[
                    "all vitals",
                    "heart rate",
                    "blood pressure",
                    "respiratory rate",
                    "spo2",
                    "temperature",
                  ]}
                  changeSelectedOption={setVitalCriteria}
                  inTable={true}
                />
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

            {filteredAlerts?.map((alert, index) => (
              <tr
                key={index}
                onClick={() => handleViewAlertDetails(alert)}
                className="hover: cursor-pointer"
              >
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
    </>
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
