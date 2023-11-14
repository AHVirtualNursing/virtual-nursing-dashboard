import axios from "axios";

export const callFetchAllAlertConfigsApi = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/alertConfig"
    );

    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const callFetchAlertConfigByIdApi = async (alertConfigId: string) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/alertConfig/" + alertConfigId
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
