import { Chat } from "@/types/chat";
import { white, lightBlue, darkBlue, lighterBlue } from "@/styles/colorTheme";
import { Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getFileByPresignedURL } from "@/pages/api/chat_api";
import { BedSideNurse } from "@/types/bedsideNurse";

type ChatPreviewProps = {
  chat: Chat;
  onClickChatPreview: () => void;
  isSelected: boolean;
  handleDeleteChat: () => void;
};

const ChatPreview = ({
  chat,
  onClickChatPreview,
  isSelected,
  handleDeleteChat,
}: ChatPreviewProps) => {
  const [rightClickEvent, setRightClickedEvent] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string>();

  useEffect(() => {
    if (
      (chat.bedsideNurse as BedSideNurse)?.picture &&
      imageUri === undefined
    ) {
      getFileByPresignedURL((chat.bedsideNurse as BedSideNurse).picture)
        .then((url) => {
          if (url === null) return "";

          setImageUri(url);
        })
        .catch((e) => console.error(e));
    }
  }, [chat, imageUri]);
  return (
    <Box
      key={(chat.bedsideNurse as BedSideNurse)?.name}
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingRight: "10px",
        paddingLeft: "20px",
        backgroundColor: isSelected ? darkBlue : "transparent",
        "&:hover": {
          backgroundColor: darkBlue,
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
              backgroundColor: white,
              width: "50px",
              height: "50px",
              "&:hover": {
                backgroundColor: lighterBlue,
              },
              zIndex: "100",
            }}
            onClick={handleDeleteChat}
          >
            <DeleteIcon sx={{ fontSize: "20", color: darkBlue }} />
          </IconButton>
        </>
      )}
      {imageUri ? (
        <>
          <Box
            sx={{
              width: 50,
              height: 50,
              backgroundColor: white,
              borderRadius: "100%",
              display: !imageLoading ? "none" : undefined,
            }}
          >
            {imageLoading && <Typography>Loading Image...</Typography>}
          </Box>

          <Image
            onLoadStart={() => setImageLoading(true)}
            onLoad={() => setImageLoading(false)}
            src={imageUri}
            alt="Picture"
            width={50}
            height={50}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              display: imageLoading ? "none" : undefined,
            }}
          />
        </>
      ) : (
        <Image
          src="/profilepic.png"
          alt="Picture"
          width={50}
          height={50}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      )}

      <Box sx={{ marginLeft: "20px" }}>
        <Typography sx={{ fontWeight: "bold", color: white }}>
          {(chat.bedsideNurse as BedSideNurse)?.name}
        </Typography>
        <Typography
          sx={{
            color: lightBlue,
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
