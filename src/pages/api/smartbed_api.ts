import axios from "axios";

export const updateSmartbedByBedId = async (bedId : string | string[] | undefined, patientId: string) => {
  try {
    const res = await axios.put(`http://localhost:3001/smartbed/${bedId}/`, {
        patient: patientId
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};