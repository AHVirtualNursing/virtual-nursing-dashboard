import { BedSideNurse } from "@/models/bedsideNurse";
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
