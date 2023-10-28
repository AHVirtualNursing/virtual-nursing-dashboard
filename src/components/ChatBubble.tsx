import { Message } from "@/models/message";
import { VirtualNurse } from "@/models/virtualNurse";
import {
  darkIndigo,
  lighterIndigo,
  indigo,
  lightIndigo,
} from "@/styles/colorTheme";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type ChatBubbleProps = {
  message: Message | undefined;
  virtualNurse: VirtualNurse | undefined;
  handleDeleteMessage: (message: Message) => void;
  handleEditMessage: (message: Message) => void;
  enableActionsUponRightClick?: boolean;
};

const ChatBubble = ({
  message,
  virtualNurse,
  handleDeleteMessage,
  handleEditMessage,
  enableActionsUponRightClick,
}: ChatBubbleProps) => {
  const isMsgFromVirtualNurse = message?.createdBy === virtualNurse?._id;
  const [hoverChatBubble, setHoverChatBubble] = useState(false);

  return (
    <Box
      sx={{
        alignSelf: isMsgFromVirtualNurse ? "flex-end" : "flex-start",
        maxWidth: "60%",
        position: "relative",
      }}
      onContextMenu={(event) => {
        if (enableActionsUponRightClick === undefined) {
          event.preventDefault();
          setHoverChatBubble((prevState) => !prevState);
        }
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
      {message?.patient ? (
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                marginBottom: "10px"
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "100%",
                  backgroundColor: lightIndigo,
                }}
              ></Box>
              <Box>
                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  Patient
                </Typography>
                <Typography sx={{ whiteSpace: "pre-line", fontSize: "20px" }}>
                  {message?.patient.name}
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              Condition
            </Typography>
            <Typography style={{ whiteSpace: "pre-line" }}>
              {message?.patient.condition}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
              NEWS2 Score
            </Typography>
            <Typography style={{ whiteSpace: "pre-line" }}>
              {message?.patient.news2Score}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
              Vitals
            </Typography>
            <Typography style={{ whiteSpace: "pre-line" }}>
              ADD VITALS HERE
            </Typography>
          </Box>
        </Box>
      ) : (
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
            <Typography style={{ whiteSpace: "pre-line" }}>
              {message?.content}
            </Typography>
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
              {new Date(message!.createdAt).toDateString()}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                alignSelf: isMsgFromVirtualNurse ? "flex-end" : "flex-start",
              }}
            >
              {new Date(message!.createdAt)
                .toLocaleTimeString()
                .slice(
                  0,
                  new Date(message!.createdAt).toLocaleTimeString().length - 6
                )}
              {new Date(message!.createdAt)
                .toLocaleTimeString()
                .slice(
                  new Date(message!.createdAt).toLocaleTimeString().length - 2
                )
                .toLowerCase()}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatBubble;
