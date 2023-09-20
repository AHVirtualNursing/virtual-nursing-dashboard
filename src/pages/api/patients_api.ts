import axios from "axios";

export const fetchPatientByPatientId = async (patientId : string | string[] | undefined) => {
  try {
    const res = await axios.get(`http://localhost:3001/patient/${patientId}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const updatePatientByPatientId = async (patientId : string | string[] | undefined, condition: string) => {
  try {
    const res = await axios.put(`http://localhost:3001/patient/${patientId}`, {
      condition: condition,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const createNewPatient = async (patientName : string, patientNric : string, condition : string) => {
  try {
    const res = await axios.post(`http://localhost:3001/patient`, {
      name: patientName,
      nric: patientNric,
      condition: condition,
    })
    return res;
  } catch (error) {
    console.error(error);
  }
}