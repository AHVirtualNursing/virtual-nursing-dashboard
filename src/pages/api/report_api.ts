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
        reportName: reportName,
        reportType: reportType,
        content: content,
        url: url,
      }
    );

    return response;
  } catch (error) {
    console.error(error);
  }
};
