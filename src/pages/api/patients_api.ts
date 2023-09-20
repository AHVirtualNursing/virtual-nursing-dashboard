import axios from "axios";

export const fetchPatientByPatientId = async (patientId : string | string[] | undefined) => {
  try {
    const res = await axios.get(`http://localhost:3001/patient/${patientId}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};