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

export const callUploadFileToS3Api = async (file: File, folder?: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }

    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/s3/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.url;
  } catch (error) {
    console.error(error);
  }
};

export const callRetrieveFileWithPresignedUrl = async (url: string) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/s3",
      {
        url: url,
      }
    );
    return response.data.presignedUrl;
  } catch (error) {
    console.error(error);
  }
};