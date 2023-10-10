import axios from "axios";

export const fetchAllVitals = async () => {
  try {
    const res = await axios.get("http://localhost:3001/vital");
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchVitalByVitalId = async (vitalId: string | undefined) => {
  try {
    const res = await axios.get(`http://localhost:3001/vital/${vitalId}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};