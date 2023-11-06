import { BedSideNurse } from "@/models/bedsideNurse";
import { Message } from "@/models/message";
import axios from "axios";

export const fetchChatsForVirtualNurse = async (virtualNurseId: string) => {
  try {
    const url =
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/chat/vn/" + virtualNurseId;
    if (url) {
      const res = await axios.get(url);
      return res.data.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const addNewMessageToChat = async (
  chatId: string,
  content: string,
  createdBy: string
) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/chat/message";
    if (url) {
      const res = await axios.post(url, {
        chatId: chatId,
        content: content,
        createdBy: createdBy,
      });

      const data = await res.data;

      return data.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const addNewPatientMessageToChat = async (
  chatId: string,
  message: Message,
  createdBy: string,
  content: string
) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/chat/message";
    if (url) {
      const res = await axios.post(url, {
        chatId: chatId,
        patient: message.patient?._id,
        createdBy: createdBy,
        content: content
      });

      const data = await res.data;

      return data.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteMessageFromChat = async (chatId: string, msgId: string) => {
  try {
    const url =
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV +
      "/chat/message/" +
      chatId +
      "/" +
      msgId;
    if (url) {
      const res = await axios.delete(url);
      return res.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchBedsideNursesByBedId = async (
  bedId: string
): Promise<BedSideNurse[] | null> => {
  try {
    const url =
      process.env.NEXT_PUBLIC_API_ENDPOINT_DEV +
      "/smartbed/" +
      bedId +
      "/nurses";
    if (url) {
      const res = await axios.get(url);

      return res.data;
    }
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const reopenChat = async (chatId: string) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/chat";
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: chatId,
        isArchived: false,
      }),
    });
    const json = await response.json();
    console.log("REOPENED", json);
    return json;
  } catch (error) {
    console.error(error);
  }

  return null;
}

export const createChat = async (
  virtualNurseId: string,
  bedsideNurseId: string
) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/chat";
    if (url) {
      const res = await axios.post(url, {
        virtualNurseId: virtualNurseId,
        bedsideNurseId: bedsideNurseId,
      });

      return res.data.data;
    }
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const updateMessageContent = async (
    chatId: string,
    msgId: string,
    content: string
  ) => {
    try {
      const url = process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/chat/message";
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: chatId,
          msgId: msgId,
          content: content,
        }),
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  
    return null;
  };

  export const deleteChat = async (chatId: string) => {
    try {
      const url = process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/chat/";
      const response = await fetch(url + chatId, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  
    return null;
  }

  export const getFileByPresignedURL = async (
    imageUrl: string
  ): Promise<string | null> => {
    const url = process.env.NEXT_PUBLIC_API_ENDPOINT_DEV + "/s3";
    const bucket = "ah-virtual-nursing";
    const presignedURL = imageUrl.split("uploads/")[1];
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bucket: bucket,
          key: "uploads/" + presignedURL,
        }),
      });
      const json = await response.json();
      console.log("retrieved file by presigned url", json.url);
      return json.url;
    } catch (error) {
      console.error(error);
    }
  
    return null;
  };