import { Message } from "@/models/message";
import { VirtualNurse } from "@/models/virtualNurse";
import { darkIndigo, lighterIndigo, indigo } from "@/styles/colorTheme";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type ChatBubbleProps = {
  message: Message;
  virtualNurse: VirtualNurse | undefined;
  handleDeleteMessage: (message: Message) => void;
  handleEditMessage: (message: Message) => void;
};

const ChatBubble = ({
  message,
  virtualNurse,
  handleDeleteMessage,
  handleEditMessage,
}: ChatBubbleProps) => {
  const isMsgFromVirtualNurse = message.createdBy === virtualNurse?._id;
  const [hoverChatBubble, setHoverChatBubble] = useState(false);

  return (
    <Box
      sx={{
        alignSelf: isMsgFromVirtualNurse ? "flex-end" : "flex-start",
        maxWidth: "60%",
        position: "relative",
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        setHoverChatBubble((prevState) => !prevState);
      }}
    >
      {hoverChatBubble && (
        <>
          <IconButton
            sx={{
              margin: isMsgFromVirtualNurse
                ? "0px 20px 0px 0px"
                : "0px 0px 0px 20px",
              position: "absolute",
              bottom: "15px",
              left: isMsgFromVirtualNurse ? "-55px" : undefined,
              right: isMsgFromVirtualNurse ? undefined : "-55px",
            }}
            onClick={() => handleDeleteMessage(message)}
          >
            <DeleteIcon sx={{ fontSize: "20", color: darkIndigo }} />
          </IconButton>
          {isMsgFromVirtualNurse && (
            <IconButton
              sx={{
                margin: isMsgFromVirtualNurse
                  ? "0px 20px 0px 0px"
                  : "0px 0px 0px 20px",
                position: "absolute",
                bottom: "15px",
                left: isMsgFromVirtualNurse ? "-105px" : undefined,
                right: isMsgFromVirtualNurse ? undefined : "-105px",
              }}
              onClick={() => {
                setHoverChatBubble((prevState) => !prevState);
                handleEditMessage(message);
              }}
            >
              <EditIcon sx={{ fontSize: "20", color: darkIndigo }} />
            </IconButton>
          )}
        </>
      )}
      <Box
        sx={{
          padding: "10px",
          backgroundColor: isMsgFromVirtualNurse ? indigo : lighterIndigo,
          borderRadius: isMsgFromVirtualNurse
            ? "15px 15px 0px 15px"
            : "15px 15px 15px 0px",
          maxWidth: "100%",
          marginBottom: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "inline-block",
            marginBottom: "10px",
            alignSelf: isMsgFromVirtualNurse ? "flex-end" : "flex-start",
          }}
        >
          <Typography>{message.content}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignSelf: isMsgFromVirtualNurse ? "flex-end" : "flex-start",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              alignSelf: isMsgFromVirtualNurse ? "flex-end" : "flex-start",
            }}
          >
            {new Date(message.createdAt).toDateString()}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              alignSelf: isMsgFromVirtualNurse ? "flex-end" : "flex-start",
            }}
          >
            {new Date(message.createdAt)
              .toLocaleTimeString()
              .slice(
                0,
                new Date(message.createdAt).toLocaleTimeString().length - 6
              )}
            {new Date(message.createdAt)
              .toLocaleTimeString()
              .slice(
                new Date(message.createdAt).toLocaleTimeString().length - 2
              )
              .toLowerCase()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBubble;