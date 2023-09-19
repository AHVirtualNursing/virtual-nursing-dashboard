import axios from "axios";

export const fetchAllWards = async () => {
  try {
    const res = await axios.get("http://localhost:3001/ward");
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
