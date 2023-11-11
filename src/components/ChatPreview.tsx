import { Chat } from "@/types/chat";
import {
  darkerIndigo,
  lightIndigo,
  indigo,
  darkIndigo,
  lighterIndigo,
} from "@/styles/colorTheme";
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
              zIndex: "100",
            }}
            onClick={handleDeleteChat}
          >
            <DeleteIcon sx={{ fontSize: "20", color: darkIndigo }} />
          </IconButton>
        </>
      )}
      {imageUri ? (
        <>
          <Box
            sx={{
              width: 50,
              height: 50,
              backgroundColor: lightIndigo,
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
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: "100%",
            backgroundColor: lightIndigo,
          }}
        ></Box>
      )}

      <Box sx={{ marginLeft: "20px" }}>
        <Typography sx={{ fontWeight: "bold", color: lightIndigo }}>
          {(chat.bedsideNurse as BedSideNurse)?.name}
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
