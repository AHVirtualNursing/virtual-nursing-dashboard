import axios from "axios";

export const callUploadAndParseMockDataFromS3Api = async (
  file: File,
  patientId?: string
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (patientId) {
      formData.append("patientId", patientId);
    }

    await axios.post(
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/s3/mockdata",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
};
