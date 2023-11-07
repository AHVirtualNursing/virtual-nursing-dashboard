import axios from "axios";

export const callCreateReportApi = async (
  patientId: string,
  reportName: string,
  reportType: string,
  url: string,
  content?: string
) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/report",
      {
        patient: patientId,
        name: reportName,
        type: reportType,
        content: content,
        url: url,
      }
    );

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const callFetchReportApi = async (reportId: string) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/report/" + reportId
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const callDeleteReportApi = async (reportId: string) => {
  try {
    await axios.delete(
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/report/" + reportId
    );
  } catch (error) {
    console.error(error);
  }
};
