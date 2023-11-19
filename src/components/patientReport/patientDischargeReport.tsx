import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Box, TableContainer, Table, TableRow, TableCell } from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertConfig } from "@/types/alertConfig";
import { Patient } from "@/types/patient";
import { Vital } from "@/types/vital";
import PatientAlerts from "../patientAlertTab/PatientAlerts";
import { fetchPatientByPatientId } from "@/pages/api/patients_api";
import { fetchVitalByVitalId } from "@/pages/api/vitals_api";
import { callFetchAlertConfigByIdApi } from "@/pages/api/alert_config_api";
import { getDateTime } from "../patientAnalyticsChart/utils";
interface PatientDischargeReportProps {
  patientId: string;
  vitalId: string;
  alertConfigId: string;
}

export default function PatientDischargeReport({
  patientId,
  vitalId,
  alertConfigId,
}: PatientDischargeReportProps) {
  const [patient, setPatient] = useState<Patient>();
  const [vitals, setVitals] = useState<Vital>();
  const [alertConfigs, setAlertConfigs] = useState<AlertConfig>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchPatient = async () => {
    const patient = await fetchPatientByPatientId(patientId);
    setPatient(patient);
  };

  const fetchVitals = async () => {
    const vitals = await fetchVitalByVitalId(vitalId);
    setVitals(vitals);
  };

  const fetchAlertConfig = async () => {
    const alertConfigs = await callFetchAlertConfigByIdApi(alertConfigId);
    setAlertConfigs(alertConfigs);
  };

  const fetchData = async () => {
    await fetchPatient();
    await fetchVitals();
    await fetchAlertConfig();
  };

  const colours: { [key: string]: string } = {
    "Respiratory Rate": "rgb(255, 102, 102)",
    "Heart Rate": "rgb(255, 178, 102)",
    "Blood Pressure Systolic": "rgb(76, 153, 0)",
    "Blood Pressure Diastolic": "rgb(76, 153, 0)",
    Temperature: "rgb(102, 178, 255)",
    "Blood Oxygen": "rgb(255, 102, 178)",
  };

  return (
    <Box width="100%">
      <Image
        src={"/VND_Banner.jpg"}
        alt="VND Banner"
        style={{ width: "100%", height: "auto" }}
        width={0}
        height={0}
        sizes="100vw"
      />
      <TableContainer style={{ overflow: "hidden", marginBottom: 2 }}>
        <Table
          style={{
            border: "2px solid black",
            margin: "0 24px",
            width: "95%",
          }}
        >
          <TableRow>
            <TableCell style={{ border: "2px solid black" }}>
              <strong>Patient Details</strong>
            </TableCell>
            <TableCell style={{ border: "2px solid black" }}>
              <strong> Health Status</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{ borderRight: "2px solid black", verticalAlign: "top" }}
            >
              <strong>Patient Name:</strong> {patient?.name}
              <br />
              <strong>Patient NRIC:</strong> {patient?.nric}
              <br />
              <strong>Condition:</strong> {patient?.condition}
            </TableCell>
            <TableCell style={{ verticalAlign: "top" }}>
              <strong>COPD:</strong> {patient?.copd}
              <br />
              <strong>Acuity Level:</strong> {patient?.acuityLevel}
              <br />
              <strong>O2 Intake:</strong> {patient?.o2Intake.toUpperCase()}
              <br />
              <strong>Consciousness:</strong>{" "}
              {patient?.consciousness.toUpperCase()}
              <br />
              <strong>Fall Risk:</strong> {patient?.fallRisk}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ border: "2px solid black" }} colSpan={2}>
              <Table>
                <TableRow>
                  <TableCell>
                    <strong>Vital Configuration</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Minimum Threshold</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Maximum Threshold</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Respiratory Rate:</TableCell>
                  <TableCell>{alertConfigs?.rrConfig[0]} bpm</TableCell>
                  <TableCell>{alertConfigs?.rrConfig[1]} bpm</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Heart Rate:</TableCell>
                  <TableCell>{alertConfigs?.hrConfig[0]} bpm</TableCell>
                  <TableCell>{alertConfigs?.hrConfig[1]} bpm</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Blood Pressure Systolic:</TableCell>
                  <TableCell>{alertConfigs?.bpSysConfig[0]} mmHg</TableCell>
                  <TableCell>{alertConfigs?.bpSysConfig[1]} mmHg</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Blood Pressure Diastolic:</TableCell>
                  <TableCell>{alertConfigs?.bpDiaConfig[0]} mmHg</TableCell>
                  <TableCell>{alertConfigs?.bpDiaConfig[1]} mmHg</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Blood Oxygen:</TableCell>
                  <TableCell>{alertConfigs?.spO2Config[0]}%</TableCell>
                  <TableCell>{alertConfigs?.spO2Config[1]}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Temperature:</TableCell>
                  <TableCell>{alertConfigs?.temperatureConfig[0]}°C</TableCell>
                  <TableCell>{alertConfigs?.temperatureConfig[1]}°C</TableCell>
                </TableRow>
              </Table>
            </TableCell>
          </TableRow>
          {patient?.infoLogs ? (
            <TableRow>
              <TableCell style={{ border: "2px solid black" }} colSpan={2}>
                <Table>
                  <TableRow>
                    <TableCell>
                      <strong>Note Log</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date Added</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Added By</strong>
                    </TableCell>
                  </TableRow>
                  {patient?.infoLogs?.map((infoLog, index) => (
                    <TableRow key={index}>
                      <TableCell>{infoLog.info}</TableCell>
                      <TableCell>
                        {getDateTime(new Date(infoLog.datetime))}
                      </TableCell>
                      <TableCell>{infoLog.addedBy}</TableCell>
                    </TableRow>
                  ))}
                </Table>
              </TableCell>
            </TableRow>
          ) : null}
        </Table>
      </TableContainer>

      {[
        "Respiratory Rate",
        "Heart Rate",
        "Blood Pressure Systolic",
        "Blood Pressure Diastolic",
        "Temperature",
        "Blood Oxygen",
      ].map((chartType, index) => (
        <div className="mb-16 mt-16" key={index}>
          <ResponsiveContainer width={"99%"} height={300}>
            <LineChart
              data={
                chartType == "Respiratory Rate"
                  ? vitals?.respRate.map((vital) => {
                      return {
                        datetime: vital.datetime.slice(0, 10),
                        reading: vital.reading,
                      };
                    })
                  : chartType == "Heart Rate"
                  ? vitals?.heartRate.map((vital) => {
                      return {
                        datetime: vital.datetime.slice(0, 10),
                        reading: vital.reading,
                      };
                    })
                  : chartType == "Blood Pressure Systolic"
                  ? vitals?.bloodPressureSys.map((vital) => {
                      return {
                        datetime: vital.datetime.slice(0, 10),
                        reading: vital.reading,
                      };
                    })
                  : chartType == "Blood Pressure Diastolic"
                  ? vitals?.bloodPressureDia.map((vital) => {
                      return {
                        datetime: vital.datetime.slice(0, 10),
                        reading: vital.reading,
                      };
                    })
                  : chartType == "Temperature"
                  ? vitals?.temperature.map((vital) => {
                      return {
                        datetime: vital.datetime.slice(0, 10),
                        reading: vital.reading,
                      };
                    })
                  : chartType == "Blood Oxygen"
                  ? vitals?.spO2.map((vital) => {
                      return {
                        datetime: vital.datetime.slice(0, 10),
                        reading: vital.reading,
                      };
                    })
                  : []
              }
            >
              <Line
                type="monotone"
                dataKey="reading"
                stroke={colours[chartType]}
                strokeWidth={3}
              />
              <CartesianGrid stroke="#ccc" strokeDasharray="1" />
              <XAxis dataKey="datetime"></XAxis>
              <YAxis type="number" domain={["dataMin", "dataMax"]} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
          <h3 className="text-center text-lg font-bold mb-2">{chartType}</h3>
        </div>
      ))}
      <h2 className="mb-8">Alert History</h2>
      <PatientAlerts patient={patient} forDischargeReport={true} />
    </Box>
  );
}
