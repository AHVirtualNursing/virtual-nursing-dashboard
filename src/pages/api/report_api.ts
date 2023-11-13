import axios from "axios";

export const callCreateReportApi = async (
  patientId: string,
  reportName: string,
  reportType: string,
  file: File
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patient", patientId);
    formData.append("name", reportName);
    formData.append("type", reportType);

    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/report",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const callFetchAllReportsApi = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/report"
    );

    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const callFetchDischargeReportsApi = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/report/discharge"
    );

    return response.data;
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
