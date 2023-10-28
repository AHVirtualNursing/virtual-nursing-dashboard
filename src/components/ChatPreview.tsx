import { Chat } from "@/models/chat";
import {
  darkerIndigo,
  lightIndigo,
  indigo,
  darkIndigo,
  lighterIndigo,
} from "@/styles/colorTheme";
import { Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

type ChatPreviewProps = {
  chat: Chat;
  onClickChatPreview: () => void;
  isSelected: boolean;
  handleDeleteChat: () => void
};

const ChatPreview = ({
  chat,
  onClickChatPreview,
  isSelected,
  handleDeleteChat
}: ChatPreviewProps) => {
  const [rightClickEvent, setRightClickedEvent] = useState(false);
  return (
    <Box
      key={chat.bedsideNurse.name}
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingRight: "10px",
        paddingLeft: "20px",
        backgroundColor: isSelected ? darkerIndigo : "transparent",
        "&:hover": {
          backgroundColor: darkerIndigo,
        },
        position: "relative",
      }}
      onClick={onClickChatPreview}
      onContextMenu={(e) => {
        e.preventDefault();
        setRightClickedEvent((prevState) => !prevState);
      }}
    >
      {rightClickEvent && (
        <>
          <IconButton
            sx={{
              position: "absolute",
              right: "20px",
              backgroundColor: lightIndigo,
              width: "50px",
              height: "50px",
              "&:hover": {
                backgroundColor: lighterIndigo,
              },
              zIndex: "100"
            }}
            onClick={handleDeleteChat}
          >
            <DeleteIcon sx={{ fontSize: "20", color: darkIndigo }} />
          </IconButton>
        </>
      )}
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: "100%",
          backgroundColor: lightIndigo,
        }}
      ></Box>
      <Box sx={{ marginLeft: "20px" }}>
        <Typography sx={{ fontWeight: "bold", color: lightIndigo }}>
          {chat.bedsideNurse.name}
        </Typography>
        <Typography
          sx={{
            color: indigo,
            width: "14vw",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {chat.messages[0]?.content}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatPreview;
