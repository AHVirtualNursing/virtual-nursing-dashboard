import axios from "axios";

export const fetchAllWards = async () => {
  try {
    const res = await axios.get("http://localhost:3001/ward");
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchBedsByWardId = async (wardId: string) => {
  try {
    const res = await axios.get(
      `http://localhost:3001/ward/${wardId}/smartbeds`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
