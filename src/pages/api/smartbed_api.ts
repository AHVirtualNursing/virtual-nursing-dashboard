import axios from "axios";

export const fetchAllSmartBeds = async () => {
  try {
    const res = await axios.get("http://localhost:3001/smartbed/");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchBedByBedId = async (bedId: string | string[] | undefined) => {
  try {
    const res = await axios.get(`http://localhost:3001/smartbed/${bedId}`);
    // console.log(res);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateSmartbedByBedId = async (
  bedId: string | string[] | undefined,
  patientId: string
) => {
  try {
    const res = await axios.put(`http://localhost:3001/smartbed/${bedId}/`, {
      patient: patientId,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const updateProtocolBreachReason = async (
  bedId: string | string[] | undefined,
  reason: string
) => {
  try {
    const res = await axios.put(`http://localhost:3001/smartbed/${bedId}/`, {
      bedAlarmProtocolBreachReason: reason,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};
