import axios from "axios";

export const fetchAllWards = async () => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + `/ward`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchBedsByWardId = async (wardId: string) => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + `/ward/${wardId}/smartbeds`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchAlertsByWardId = async (wardId: string) => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + `/ward/${wardId}/alerts`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
