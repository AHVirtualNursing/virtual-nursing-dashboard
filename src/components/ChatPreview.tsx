import { Chat } from "@/models/chat";
import { darkerIndigo, lightIndigo, indigo } from "@/styles/colorTheme";
import { Box, Typography } from "@mui/material";

type ChatPreviewProps = {
  chat: Chat;
  onClickChatPreview: () => void;
  isSelected: boolean;
};

const ChatPreview = ({
  chat,
  onClickChatPreview,
  isSelected,
}: ChatPreviewProps) => {
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
      }}
      onClick={onClickChatPreview}
    >
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
