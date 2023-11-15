import axios from "axios";

export const fetchAllAlerts = async () => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + `/alert`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const redelegateAlert = async (
  alertId: string | string[] | undefined
) => {
  try {
    const res = await axios.put(process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + `/alert/redelegate/${alertId}`, {
      id: alertId
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};