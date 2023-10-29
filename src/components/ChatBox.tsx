import ChatIcon from "@mui/icons-material/Chat";
import { useState } from "react";
import ChatBoxModal from "./ChatBoxModal";

export const ChatBox = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div
        style={{ marginTop: "auto" }}
        className="flex group gap-3 hover:bg-blue-400 cursor-pointer p-4 rounded-md"
        onClick={handleOpen}
      >
        <ChatIcon sx={{ color: "white" }} />
      </div>
      <ChatBoxModal open={open} handleClose={handleClose} />
    </>
  );
};
