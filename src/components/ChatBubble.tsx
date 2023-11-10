import { Message } from "@/types/message";
import { VirtualNurse } from "@/models/virtualNurse";
import {
  darkIndigo,
  lighterIndigo,
  indigo,
  lightIndigo,
} from "@/styles/colorTheme";
import { Box, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getFileByPresignedURL } from "@/pages/api/chat_api";
import Image from "next/image";

type ChatBubbleProps = {
  message: Message | undefined;
  virtualNurse: VirtualNurse | undefined;
  handleDeleteMessage: (message: Message) => void;
  handleEditMessage: (message: Message) => void;
  enableActionsUponRightClick?: boolean;
  showImageFullScreenModal: (imageUrl: string) => void;
};

const ChatBubble = ({
  message,
  virtualNurse,
  handleDeleteMessage,
  handleEditMessage,
  enableActionsUponRightClick,
  showImageFullScreenModal,
}: ChatBubbleProps) => {
  const isMsgFromVirtualNurse = message?.createdBy === virtualNurse?._id;
  const [hoverChatBubble, setHoverChatBubble] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageUri, setImageUri] = useState<string>();
  const [patientImageLoading, setPatientImageLoading] = useState(false);

  useEffect(() => {
    if (message?.patient && message.patient.picture && imageUri === undefined) {
      getFileByPresignedURL(message.patient.picture).then((url) => {
        if (url === null) return "";
        setImageUri(url);
      });
    }
  }, [message, imageUri]);

  useEffect(() => {
    if (message === undefined) return;
    if (message.imageUrl) {
      getFileByPresignedURL(message.imageUrl).then((url) => {
        if (url === null) return "";

        setPhotoUrl(url);
      });
    }
  }, [message]);

  const renderChatMessage = () => {
    let chatMessageRender = () => {
      return (
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
      );
    };

    if (message?.patient) {
      chatMessageRender = () => {
        return (
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
                  marginBottom: "10px",
                }}
              >
                {imageUri ? (
                  <>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: lightIndigo,
                        borderRadius: "100%",
                        display: !patientImageLoading ? "none" : undefined,
                      }}
                    ></Box>

                    <Image
                      onLoadStart={() => setPatientImageLoading(true)}
                      onLoad={() => setPatientImageLoading(false)}
                      src={imageUri}
                      alt="Picture"
                      width={80}
                      height={80}
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                        display: patientImageLoading ? "none" : undefined,
                      }}
                    />
                  </>
                ) : (
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "100%",
                      backgroundColor: lightIndigo,
                    }}
                  ></Box>
                )}
                <Box>
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Patient
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-line", fontSize: "20px" }}>
                    {message?.patient?.name}
                  </Typography>
                </Box>
              </Box>

              <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                Condition
              </Typography>
              <Typography style={{ whiteSpace: "pre-line" }}>
                {message?.patient?.condition}
              </Typography>
              <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                NEWS2 Score
              </Typography>
              <Typography style={{ whiteSpace: "pre-line" }}>
                {message?.patient?.news2Score}
              </Typography>
              <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                Content
              </Typography>
              <Typography style={{ whiteSpace: "pre-line" }}>
                {message.content}
              </Typography>
            </Box>
          </Box>
        );
      };
    }

    if (message?.alert) {
      chatMessageRender = () => {
        return (
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
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  marginBottom: "10px",
                }}
              >
                Patient Alert
              </Typography>
              <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                Description
              </Typography>
              <Typography style={{ whiteSpace: "pre-line" }}>
                {message.alert?.description}
              </Typography>
              <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                Status
              </Typography>
              <Typography style={{ whiteSpace: "pre-line" }}>
                {message?.alert!.status.substring(0, 1).toUpperCase() +
                  message?.alert!.status.substring(1)}
              </Typography>
              <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                Patient
              </Typography>
              <Typography style={{ whiteSpace: "pre-line" }}>
                {message?.alert?.patient.name}
              </Typography>
              <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                Created On
              </Typography>
              <Typography style={{ whiteSpace: "pre-line" }}>
                {new Date(
                  message?.alert?.createdAt as string
                ).toLocaleDateString()}{" "}
                {new Date(
                  message?.alert?.createdAt as string
                ).toLocaleTimeString()}
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
        );
      };
    }

    return chatMessageRender();
  };
  return (
    <Box
      sx={{
        alignSelf: isMsgFromVirtualNurse ? "flex-end" : "flex-start",
        maxWidth: photoUrl ? "100%" : "60%",
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
          {isMsgFromVirtualNurse && (
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
                onClick={() => handleDeleteMessage(message!)}
              >
                <DeleteIcon sx={{ fontSize: "20", color: darkIndigo }} />
              </IconButton>
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
                  handleEditMessage(message!);
                }}
              >
                <EditIcon sx={{ fontSize: "20", color: darkIndigo }} />
              </IconButton>
            </>
          )}
        </>
      )}
      {photoUrl ? (
        <>
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
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              onClick={() => showImageFullScreenModal(photoUrl)}
            >
              {imageLoading && (
                <>
                  <Typography>Loading...</Typography>
                </>
              )}
              <Image
                onLoadStart={() => setImageLoading(true)}
                onLoad={() => setImageLoading(false)}
                src={photoUrl}
                alt="Image"
                width={375}
                height={500}
                style={{ borderRadius: "10px" }}
              />
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
        </>
      ) : (
        <>{renderChatMessage()}</>
      )}
    </Box>
  );
};

export default ChatBubble;
