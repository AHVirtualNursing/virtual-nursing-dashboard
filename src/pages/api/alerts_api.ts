import axios from "axios";

export const fetchAllAlerts = async () => {
  try {
    const res = await axios.get("http://localhost:3001/alert");
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
