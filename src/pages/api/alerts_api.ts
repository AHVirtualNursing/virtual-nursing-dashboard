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