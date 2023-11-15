import { AlertConfig } from "@/types/alertConfig";
import axios from "axios";

export const fetchAlertConfigByPatientId = async (
  patientId: string | string[] | undefined
) => {
  try {
    const response1 = await axios.get(
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + `/patient/${patientId}`
    );
    const configId = response1.data.alertConfig;
    const response2 = await axios.get(
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + `/alertConfig/${configId}`
    );
    return Promise.resolve(response2);
  } catch (error) {
    console.error(error);
  }
};

export const updateAlertConfig = async (
  configId: string | string[] | undefined,
  alertConfig: AlertConfig
) => {
  try {
    const res = await axios.put(
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + `/alertConfig/${configId}`,
      alertConfig
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
