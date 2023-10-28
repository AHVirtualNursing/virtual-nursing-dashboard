import { Chat } from "@/models/chat";
import { lightIndigo } from "@/styles/colorTheme";
import { Box } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import ChatPreview from "./ChatPreview";

type SearchProps = {
  selectedChat: Chat | undefined;
  setSelectedChat: Dispatch<SetStateAction<Chat | undefined>>;
  chats: Chat[] | undefined;
  handleDeleteChat: (chat: Chat) => void
};

const Search = ({ selectedChat, setSelectedChat, chats, handleDeleteChat }: SearchProps) => {
  const [searchNurse, setSearchNurse] = useState("");

  return (
    <>
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: lightIndigo,
          height: 30,
          marginTop: "10px",
          marginBottom: "20px",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        <input
          className="input-search"
          onChange={(e) => setSearchNurse(e.target.value)}
          value={searchNurse}
          placeholder="Search for nurse"
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: lightIndigo,
            outline: "none",
            fontSize: 14,
          }}
        ></input>
      </Box>
      <Box
        sx={{
          height: "100%",
          overflowY: "scroll",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {chats &&
          chats
            .sort((chatA, chatB) => {
              if (chatA.messages.length === 0) return 1;
              if (chatB.messages.length === 0) return -1;
              // Get the latest message in each chat
              const latestMessageA = chatA.messages[0];
              const latestMessageB = chatB.messages[0];

              // Compare the createdAt property of the latest messages
              return (
                new Date(latestMessageB.createdAt).getTime()- new Date(latestMessageA.createdAt).getTime()
              );
            })
            .filter((chat) => {
              if (searchNurse === "") return true;

              const chatName = chat.bedsideNurse.name.toUpperCase();
              const query = searchNurse.toUpperCase();
              return chatName.indexOf(query) > -1;
            })
            .map((chat) => {
              return (
                <ChatPreview
                  key={chat.bedsideNurse.name}
                  chat={chat}
                  isSelected={
                    selectedChat?.bedsideNurse.name === chat.bedsideNurse.name
                  }
                  onClickChatPreview={() => {
                    setSelectedChat(chat);
                    setSearchNurse("");
                  }}
                  handleDeleteChat={() => {
                    handleDeleteChat(chat);
                  }}
                />
              );
            })}
      </Box>
    </>
  );
};

export default Search;
