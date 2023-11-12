import { Alert, AlertVitals } from "@/types/alert";
import React from "react";
import AlertsTableRow from "./AlertsTableRow";

type AlertPatientMapping = {
  alert: Alert;
  patient: string;
};

type AlertsTableProps = {
  alerts: AlertPatientMapping[] | undefined;
};

const AlertsTable = ({ alerts }: AlertsTableProps) => {
  return (
    <div className="overflow-auto scrollbar bg-white rounded-lg shadow-lg p-4 h-auto max-h-[700px] space-y-3">
      <div className="gap-x-3 flex justify-start items-center">
        <label
          htmlFor="alertWardFilter"
          className="text-sm font-medium text-gray-900"
        >
          Wards
        </label>
        <select
          name="alertWardFilter"
          id="alert-ward-filter"
          className="p-2 bg-gray-50 rounded-lg border border-gray-300 text-gray-900 text-sm"
        >
          <option value="assigned-wards">Assigned Wards</option>
        </select>
      </div>

      <table className="table-auto md:table-fixed border-collapse w-full">
        <thead className="text-sm bg-slate-100">
          <tr>
            <TableHeader title="Patient" />
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
            <td>
              <input type="text" />
            </td>
            <td>
              <select name="" id=""></select>
            </td>
            <td>
              <select name="" id=""></select>
            </td>
            <td className="text-sm underline flex items-center justify-center gap-2">
              <p>Vital</p>
              <div>
                <select name="" id=""></select>
              </div>
            </td>
            <td className="text-sm underline">Reading</td>
            <td></td>
            <td>
              <input type="text" />
            </td>
            <td></td>
          </tr>
          {alerts?.map((alertMapping, index) => (
            <tr key={index}>
              <AlertsTableRow id="patient-name" data={alertMapping.patient} />
              <td
                className={`text-sm border-solid border-0 border-b border-slate-400`}
              >
                <button
                  className={`${
                    alertMapping.alert.status === "open"
                      ? "bg-red-400"
                      : alertMapping.alert.status === "handling"
                      ? "bg-orange-400"
                      : "bg-green-400"
                  } text-white py-1 px-3 rounded-lg w-auto uppercase pointer-events-none`}
                >
                  {alertMapping.alert.status}
                </button>
              </td>
              <AlertsTableRow
                id="alert-type"
                data={alertMapping.alert.alertType}
              />
              <AlertsTableRow
                id="abnormal-vital-reading"
                data={alertMapping.alert.alertVitals.map(
                  (value) => (value as AlertVitals).vital
                )}
              />
              <AlertsTableRow
                id="abnormal-vital-reading"
                data={alertMapping.alert.alertVitals.map(
                  (value) => (value as AlertVitals).reading
                )}
              />
              <AlertsTableRow
                id="alert-description"
                data={alertMapping.alert.description}
              />
              <AlertsTableRow
                id="handling-nurse"
                data={alertMapping.alert.notes[0]?.addedBy}
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

export default AlertsTable;
