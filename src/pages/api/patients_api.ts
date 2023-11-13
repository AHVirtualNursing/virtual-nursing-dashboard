import { Vital } from "@/types/vital";
import axios from "axios";
import { Layout, Layouts } from "react-grid-layout";

export const fetchAllPatients = async () => {
  try {
    const res = await axios.get("http://localhost:3001/patient/");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchAlertsByPatientId = async (
  patientId: string | string[] | undefined
) => {
  try {
    const res = await axios.get(
      `http://localhost:3001/patient/${patientId}/alerts`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchPatientByPatientId = async (
  patientId: string | string[] | undefined
) => {
  try {
    const res = await axios.get(`http://localhost:3001/patient/${patientId}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchPatientByPatientNRIC = async (
  patientNRIC: string | string[] | undefined
) => {
  try {
    const res = await axios.get(`http://localhost:3001/patient/nric/${patientNRIC}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const updatePatientConditionByPatientId = async (
  patientId: string | string[] | undefined,
  condition: string
) => {
  try {
    const res = await axios.put(`http://localhost:3001/patient/${patientId}`, {
      condition: condition,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const updatePatientLayoutByPatientId = async (
  patientId: string | string[] | undefined,
  order: string[]
) => {
  try {
    const res = await axios.put(`http://localhost:3001/patient/${patientId}`, {
      order: order,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const createNewPatient = async (
  patientName: string,
  patientNric: string,
  condition: string,
  smartbedId: string
) => {
  try {
    const res = await axios.post(`http://localhost:3001/patient`, {
      name: patientName,
      nric: patientNric,
      condition: condition,
      smartbed: smartbedId,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const getVitalByPatientId = async (
  patientId: string
): Promise<Vital | null> => {
  var vital: Vital | null = null;
  try {
    const response = await fetch(
      `http://localhost:3001/patient/${patientId}/vital`,
      {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }
    );
    const json = await response.json();
    vital = json;
  } catch (error) {
    console.error(error);
  }

  return vital;
};
