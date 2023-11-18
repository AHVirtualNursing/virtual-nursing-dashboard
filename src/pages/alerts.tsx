import React, { useContext, useEffect, useState } from "react";
import { fetchPatientByPatientId } from "./api/patients_api";
import { Alert, AlertVitals } from "@/types/alert";
import AlertsTableRow from "@/components/alerts/AlertsTableRow";
import AlertDetailsModal from "@/components/alerts/AlertDetailsModal";
import { useSession } from "next-auth/react";
import { fetchWardsByVirtualNurse } from "./api/nurse_api";
import { fetchAlertsByWardId } from "./api/wards_api";
import { Ward } from "@/types/ward";
import SelectFilter from "@/components/SelectFilter";
import { SocketContext } from "./layout";

type AlertPatientMapping = {
  alert: Alert;
  patient: string;
};

const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertPatientMapping[]>();
  const [patientSearch, setPatientSearch] = useState<string>("");
  const [nurseSearch, setNurseSearch] = useState<string>("");
  const [statusCriteria, setStatusCriteria] = useState("");
  const [vitalCriteria, setVitalCriteria] = useState("");
  const [alertTypeCriteria, setAlertTypeCriteria] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<AlertPatientMapping>();
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [shown, setShown] = useState(false);
  const [wards, setWards] = useState<Ward[]>([]);
  const [socketData, setSocketData] = useState<Alert>();
  const { data: sessionData } = useSession();
  const socket = useContext(SocketContext);

  useEffect(() => {
    const handleUpdatedAlert = (data: any) => {
      setSocketData(data);
    };
    socket.on("updatedAlert", handleUpdatedAlert);
    return () => {
      socket.off("updatedAlert");
    };
  }, [socket]);

  // get wards assigned to virtual nurse
  // then get alerts for each ward
  // for each alert, map the alert to the patient
  useEffect(() => {
    fetchWardsByVirtualNurse(sessionData?.user.id).then((wards) => {
      setWards(wards);
      let wardsToView: Ward[] = [];
      let promises: Promise<Alert>[] = [];
      if (selectedWard === "") {
        wardsToView = wards;
      } else {
        wardsToView = wards.filter(
          (ward: Ward) => ward.wardNum === selectedWard
        );
      }
      wardsToView.map((ward) => promises.push(fetchAlertsByWardId(ward._id)));
      Promise.all(promises).then((res: any) => {
        let alertsList: Alert[] = [];
        for (const alertArr of res) {
          alertsList.push(...alertArr);
        }
        const patientIds = alertsList.map(
          (alert: Alert) => alert.patient as string
        );

        let patientPromises = patientIds.map((id: string) =>
          fetchPatientByPatientId(id)
        );
        Promise.all(patientPromises).then((res) => {
          const alertToPatientMappings = alertsList.map(
            (alert: Alert, index: number) => ({
              alert: alert,
              patient: res[index].name,
            })
          );
          setAlerts(alertToPatientMappings);
        });
      });
    });
  }, [socketData, selectedWard, sessionData?.user.id]);

  const handleViewAlertDetails = (alertMapping: AlertPatientMapping) => {
    setSelectedAlert(alertMapping);
    setShown(true);
  };

  const filteredAlerts =
    alerts &&
    alerts
      .sort(
        (a, b) => +new Date(b.alert.createdAt) - +new Date(a.alert.createdAt)
      )
      .filter((alertMapping) => {
        const include =
          alertMapping.patient.toLowerCase().includes(patientSearch) &&
          alertMapping.alert.status.toLowerCase().includes(statusCriteria) &&
          alertMapping.alert.alertType
            .toLowerCase()
            .includes(alertTypeCriteria) &&
          (vitalCriteria === ""
            ? true
            : alertMapping.alert.alertVitals.some((alertVital) =>
                (alertVital as AlertVitals).vital
                  .toLowerCase()
                  .includes(vitalCriteria)
              )) &&
          (nurseSearch === ""
            ? true
            : alertMapping.alert.notes[0]?.addedBy
                .toLowerCase()
                .includes(nurseSearch));
        return include;
      });

  return (
    <>
      {shown && (
        <AlertDetailsModal
          pressed={shown}
          setShown={setShown}
          alertPatientMapping={selectedAlert}
        />
      )}
      <div className="bg-slate-100 p-6 w-full">
        <div>
          <div className="flex flex-start p-2">
            <h4>Alerts Overview</h4>
          </div>
        </div>
        <div className="overflow-auto scrollbar bg-white rounded-lg shadow-lg p-4 h-auto max-h-[720px] space-y-3">
          <div className="gap-x-3 flex justify-start items-center">
            <label
              htmlFor="alertWardFilter"
              className="text-sm font-medium text-gray-900"
            >
              Wards
            </label>
            <SelectFilter
              name="alertWardFilter"
              inTable={false}
              changeSelectedOption={setSelectedWard}
              options={["all"].concat(wards.map((ward) => ward.wardNum))}
            />
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

              {filteredAlerts?.map((alertMapping, index) => (
                <tr
                  key={index}
                  onClick={() => handleViewAlertDetails(alertMapping)}
                  className="hover: cursor-pointer"
                >
                  <AlertsTableRow
                    id="patient-name"
                    data={alertMapping.patient}
                  />
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
                    id="abnormal-vital"
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
                    width="1/12"
                    data={alertMapping.alert.handledBy?.addedBy}
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

export default Alerts;
