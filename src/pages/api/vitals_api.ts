import axios from "axios";

export const fetchAllVitals = async () => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + `/vital`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchVitalByVitalId = async (vitalId: string | undefined) => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + `/vital/${vitalId}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
