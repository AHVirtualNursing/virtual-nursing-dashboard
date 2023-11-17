import { Alert } from "@/types/alert";
import axios from "axios";

export const fetchAllAlerts = async () => {
  try {
    const res = await axios.get("http://localhost:3001/alert");
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const redelegateAlert = async (
  alertId: string | string[] | undefined
) => {
  try {
    const res = await axios.put(`http://localhost:3001/alert/redelegate/${alertId}`, {
      id: alertId
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const getAlertsByPatientId = async (patientId: string) => {
  var alerts: Alert[] | null = null;
  const url = "http://localhost:3001";
  try {
    const response = await fetch(url + "/patient/" + patientId + "/alerts", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
    const json = await response.json();
    alerts = json;
  } catch (error) {
    console.error(error);
  }

  return alerts;
};
