import {
  darkIndigo,
  darkerIndigo,
  indigo,
  lightIndigo,
  lighterIndigo,
  midIndigo,
} from "@/styles/colorTheme";
import {
  Typography,
  Box,
  Modal,
  IconButton,
  Select,
  Button,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import { VirtualNurse } from "@/models/virtualNurse";
import { fetchVirtualNurseByNurseId } from "@/pages/api/nurse_api";
import { useSession } from "next-auth/react";
import { FormControl, MenuItem } from "@mui/material";
import {
  addNewMessageToChat,
  createChat,
  deleteMessageFromChat,
  fetchBedsideNursesByBedId,
  fetchChatsForVirtualNurse,
  updateMessageContent,
} from "@/pages/api/chat_api";
import { BedSideNurse } from "@/models/bedsideNurse";
import { SmartBed } from "@/models/smartBed";
import { fetchBedsByWardId } from "@/pages/api/wards_api";
import DoneIcon from "@mui/icons-material/Done";
import { Chat } from "@/models/chat";
import { Message } from "@/models/message";
import ChatBubble from "./ChatBubble";
import EditIcon from "@mui/icons-material/Edit";
import Search from "./ChatSearch";

type ChatBoxModalProps = {
  open: boolean;
  handleClose: () => void;
};

const ChatBoxModal = ({ open, handleClose }: ChatBoxModalProps) => {
  const [selectedChat, setSelectedChat] = useState<Chat>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [hoverCreateButton, setHoverCreateButton] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const { data: sessionData } = useSession();
  const [virtualNurse, setVirtualNurse] = useState<VirtualNurse>();
  const [openCreateChat, setOpenCreateChat] = useState(false);
  const handleCloseCreateChat = () => setOpenCreateChat(false);
  const handleOpenCreateChat = () => setOpenCreateChat(true);
  const [selectedBedWithPatientId, setSelectedBedWithPatientId] = useState("");
  const [selectedBedsideNurseId, setSelectedBedsideNurseId] = useState("");
  const [bedsWithPatientsData, setBedsWithPatientsData] =
    useState<SmartBed[]>();
  const [bedsideNursesForSelectedPatient, setBedsideNursesForSelectedPatient] =
    useState<BedSideNurse[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [messageInEditMode, setMessageInEditMode] = useState<Message>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchVirtualNurseByNurseId(sessionData?.user.id).then((res) => {
      setVirtualNurse(res.data);

      getChatsForVirtualNurse(res.data);
      getPatients(res.data);
    });

    // Set an interval to call myFunction every 1000 milliseconds (1 second)
    const refreshChats = setInterval(() => {
      getChatsForVirtualNurse(virtualNurse);
    }, 5000);

    if (textMessage) {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
      }
    }

    // Cleanup the interval when the component is unmounted or when the effect is re-run
    return () => clearInterval(refreshChats);
  }, [sessionData?.user.id, textMessage]);

  const getChatsForVirtualNurse = async (nurse: VirtualNurse | undefined) => {
    if (nurse === undefined) return;
    const chatsRes: Chat[] = await fetchChatsForVirtualNurse(nurse!._id);

    if (chatsRes === undefined) return;
    setChats([...chatsRes]);
  };

  const getPatients = async (virtualNurse: any) => {
    let beds: SmartBed[] = await fetchBedsByWardId(virtualNurse.wards);

    beds = beds.filter(
      (bed) => bed.patient !== undefined && bed.patient !== null
    );

    setBedsWithPatientsData(beds);
  };

  const getBedsideNursesByBedId = async (bedId: string) => {
    fetchBedsideNursesByBedId(bedId).then((bedsideNurses) => {
      if (bedsideNurses !== null) {
        setBedsideNursesForSelectedPatient(bedsideNurses);
      }
    });
  };
  const handleSendMessage = () => {
    if (textMessage === "") return;
    if (selectedChat === undefined) return;
    //capture textMessage

    addNewMessageToChat(selectedChat._id, textMessage, virtualNurse!._id).then(
      (updatedChat) => {
        if (updatedChat === undefined) return;
        //capture selected Chat
        setSelectedChat(updatedChat);

        //update chats
        const updatedChats = chats.filter(
          (chat) => chat._id !== updatedChat._id
        );
        setChats([...updatedChats, updatedChat]);

        //Send to websocket

        //reset
        setTextMessage("");
      }
    );
  };

  const handleUpdateMessage = () => {
    if (!messageInEditMode) return;
    if (textMessage === "") {
      handleDeleteMessage(messageInEditMode);
      handleCloseEditButton();
      return;
    }

    updateMessageContent(
      selectedChat!._id,
      messageInEditMode._id,
      textMessage
    ).then((updatedChat) => {
      if (updatedChat === undefined) return;

      //update chats
      const updatedChats = chats.filter((chat) => chat._id !== updatedChat._id);
      setChats([...updatedChats, updatedChat]);
      setSelectedChat(updatedChat);
      handleCloseEditButton();
    });
  };

  const handleEditMessage = (message: Message) => {
    if (selectedChat === undefined) return;
    setIsEditMode(true);
    setMessageInEditMode(message);
    setTextMessage(message.content);
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.focus();
    }
  };

  const handleDeleteMessage = (message: Message) => {
    if (selectedChat === undefined) return;

    deleteMessageFromChat(selectedChat._id, message._id).then((updatedChat) => {
      if (updatedChat === undefined) return;
      setSelectedChat(updatedChat);
      //update chats
      const updatedChats = chats.filter((chat) => chat._id !== updatedChat._id);
      setChats([...updatedChats, updatedChat]);
    });
  };

  const handleCreateChat = () => {
    //check for existing chat
    chats.forEach((chat) => {
      if (chat.bedsideNurse._id === selectedBedsideNurseId) {
        setSelectedChat(chat);
        handleCloseCreateChat();
        setSelectedBedWithPatientId("");
        setSelectedBedsideNurseId("");
        return;
      }
    });

    //new chat
    createChat(virtualNurse!._id, selectedBedsideNurseId).then((newChat) => {
      if (newChat !== null) {
        setSelectedChat(newChat);
        setChats([...chats, newChat]);
        handleCloseCreateChat();
        setSelectedBedWithPatientId("");
        setSelectedBedsideNurseId("");
      }
    });
  };

  const handleCloseEditButton = () => {
    setIsEditMode(false);
    setMessageInEditMode(undefined);
    setTextMessage("");
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
    }
  };

  const handleTextMessageKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default behavior (form submission)
      // Add your submit logic here
      if (!isEditMode) {
        handleSendMessage();
      } else {
        handleUpdateMessage();
      }
      const target = event.target as HTMLTextAreaElement; // Get the target element
      target.style.height = "auto"; // Reset height
    }
  };

  const handleTextMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextMessage(event.target.value);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "5%",
            width: "60%",
            minWidth: 900,
            height: "80%",
            bgcolor: lightIndigo,
            borderRadius: 5,
            overflow: "hidden",
            display: "flex",
            border: "none",
            outline: "none",
          }}
        >
          <Box
            sx={{
              flex: 1,
              bgcolor: midIndigo,
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingLeft: "20px",
                paddingRight: "20px",
              }}
            >
              <Typography
                sx={{ fontSize: 20, fontWeight: "bold", color: lightIndigo }}
              >
                Chats
              </Typography>
              <IconButton
                onMouseOver={() => setHoverCreateButton(true)}
                onMouseOut={() => setHoverCreateButton(false)}
                onClick={handleOpenCreateChat}
              >
                {hoverCreateButton ? (
                  <AddCircleIcon sx={{ color: lightIndigo, fontSize: 30 }} />
                ) : (
                  <AddCircleOutlineIcon
                    sx={{ color: lightIndigo, fontSize: 30 }}
                  />
                )}
              </IconButton>
            </Box>
            <Search
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              chats={chats}
            />
          </Box>
          <Box sx={{ flex: 2, padding: "20px" }}>
            {selectedChat ? (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: indigo,
                    borderRadius: "10px",
                    height: "6vh",
                    minHeight: "50px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                  }}
                >
                  <Typography
                    sx={{
                      color: darkerIndigo,
                      fontWeight: "bold",
                      fontSize: "22px",
                    }}
                  >
                    {selectedChat?.bedsideNurse.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column-reverse",
                    height: "100%",
                    marginBottom: "20px",
                    paddingTop: "20px",
                    overflowY: "scroll",
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  {selectedChat.messages
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .map((message) => {
                      return (
                        <ChatBubble
                          key={new Date(message.createdAt).getTime()}
                          message={message}
                          virtualNurse={virtualNurse}
                          handleDeleteMessage={handleDeleteMessage}
                          handleEditMessage={handleEditMessage}
                        />
                      );
                    })}
                </Box>
                {isEditMode && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: indigo,
                      borderRadius: "10px 10px 0px 0px",
                      paddingTop: "5px",
                      paddingBottom: "5px",
                      width: "100%",
                    }}
                  >
                    <EditIcon
                      sx={{
                        fontSize: "20",
                        color: darkerIndigo,
                        flex: "1",
                      }}
                    />
                    <Box
                      sx={{
                        flex: "9",
                        maxWidth: "33vw",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: darkerIndigo,
                        }}
                      >
                        Edit Message
                      </Typography>
                      <Typography
                        sx={{
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 3,
                        }}
                      >
                        {messageInEditMode?.content}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: "1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconButton onClick={handleCloseEditButton}>
                        <CloseIcon
                          sx={{ fontSize: "20", color: darkerIndigo }}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                )}
                <Box
                  sx={{
                    backgroundColor: lighterIndigo,
                    borderRadius: isEditMode ? "0px 0px 10px 10px" : "10px",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    paddingTop: "5px",
                  }}
                >
                  <textarea
                    ref={textareaRef}
                    className="input-message"
                    onChange={handleTextMessageChange}
                    onKeyDown={handleTextMessageKeyDown}
                    value={textMessage}
                    placeholder="Write a message..."
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: darkIndigo,
                      outline: "none",
                      fontSize: 16,
                      width: "100%",
                      fontFamily: "Arial, sans-serif",
                      resize: "none",
                      overflow: "hidden",
                      height: "auto",
                    }}
                  ></textarea>
                  {isEditMode ? (
                    <IconButton onClick={handleUpdateMessage}>
                      <DoneIcon sx={{ color: midIndigo, fontSize: 30 }} />
                    </IconButton>
                  ) : (
                    <IconButton onClick={handleSendMessage}>
                      <ArrowCircleUpIcon
                        sx={{ color: midIndigo, fontSize: 30 }}
                      />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    cursor: "default",
                    userSelect: "none",
                    fontWeight: 600,
                    color: darkIndigo,
                  }}
                >
                  Select a chat to start messaging
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openCreateChat}
        onClose={handleCloseCreateChat}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "10%",
            width: "40%",
            height: "50%",
            bgcolor: lightIndigo,
            borderRadius: 5,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "none",
            outline: "none",
            padding: "20px",
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "bold",
              color: darkIndigo,
              marginBottom: "20px",
            }}
          >
            Create Chat
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "bold",
              color: darkIndigo,
            }}
          >
            Patient
          </Typography>
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <Select
              value={selectedBedWithPatientId}
              onChange={(event) => {
                setSelectedBedWithPatientId(event.target.value);
                getBedsideNursesByBedId(event.target.value);
              }}
            >
              {bedsWithPatientsData?.map((bedWithPatient) => {
                return (
                  <MenuItem key={bedWithPatient._id} value={bedWithPatient._id}>
                    {bedWithPatient?.patient?.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "bold",
              color: darkIndigo,
            }}
          >
            Bedside Nurse
          </Typography>
          <FormControl fullWidth>
            <Select
              value={selectedBedsideNurseId}
              onChange={(event) =>
                setSelectedBedsideNurseId(event.target.value)
              }
            >
              {bedsideNursesForSelectedPatient?.map((bedsideNurse) => {
                return (
                  <MenuItem key={bedsideNurse._id} value={bedsideNurse._id}>
                    {bedsideNurse.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{
              marginTop: "20px",
              borderRadius: "20px",
              backgroundColor: darkIndigo,
              alignSelf: "flex-end",
              "&:hover": {
                backgroundColor: darkerIndigo,
              },
            }}
            onClick={handleCreateChat}
          >
            Create
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ChatBoxModal;