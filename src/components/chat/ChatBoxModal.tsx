import {
  darkBlue,
  lightBlue,
  white,
  lighterBlue,
  blue,
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
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useContext, useEffect, useRef, useState } from "react";
import { VirtualNurse } from "@/types/virtualNurse";
import { fetchVirtualNurseByNurseId } from "@/pages/api/nurse_api";
import { useSession } from "next-auth/react";
import { FormControl, MenuItem } from "@mui/material";
import {
  addNewMessageToChat,
  addNewPatientMessageToChat,
  createChat,
  deleteChat,
  deleteMessageFromChat,
  fetchBedsideNursesByBedId,
  fetchChatsForVirtualNurse,
  reopenChat,
  updateMessageContent,
} from "@/pages/api/chat_api";
import { BedSideNurse } from "@/types/bedsideNurse";
import { SmartBed } from "@/types/smartbed";
import { fetchBedsByWardId } from "@/pages/api/wards_api";
import DoneIcon from "@mui/icons-material/Done";
import { Chat } from "@/types/chat";
import { Message } from "@/types/chat";
import ChatBubble from "./ChatBubble";
import EditIcon from "@mui/icons-material/Edit";
import Search from "./ChatSearch";
import Image from "next/image";
import { getVitalByPatientId } from "@/pages/api/patients_api";
import { Patient } from "@/types/patient";
import { SocketContext } from "@/pages/layout";

type ChatBoxModalProps = {
  open: boolean;
  handleClose: () => void;
};

const ChatBoxModal = ({ open, handleClose }: ChatBoxModalProps) => {
  const socket = useContext(SocketContext);
  const [selectedChat, setSelectedChat] = useState<Chat>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [archivedAndUnarchivedChats, setArchivedAndUnarchivedChats] = useState<
    Chat[]
  >([]);
  const [hoverCreateButton, setHoverCreateButton] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const { data: sessionData } = useSession();
  const [virtualNurse, setVirtualNurse] = useState<VirtualNurse>();
  const [openCreateChat, setOpenCreateChat] = useState(false);
  const handleCloseCreateChat = () => {
    setOpenCreateChat(false);
    setSelectedBedWithPatientId("");
    setSelectedBedsideNurseId("");
    setBedsideNursesForSelectedPatient([]);
  };
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
  const [isAddingPatientToChat, setIsAddingPatientToChat] = useState(false);
  const handleOpenSharingPatientToChat = () => {
    const bedSideNurse = selectedChat?.bedsideNurse as BedSideNurse;
    const totalAssignedBeds = bedSideNurse.smartBeds as any[];
    const assignedBeds = bedsWithPatientsData!.filter((bed) => {
      const idx = totalAssignedBeds?.indexOf(bed._id);
      return idx >= 0;
    });
    setAssignedBedsToSelectedChatBedsideNurse(assignedBeds);
    setIsAddingPatientToChat(true);
  };
  const handleCloseSharingPatientToChat = () => {
    setShareToSelectedChatBedWithPatientId("");
    setPatientPreviewMessage(undefined);
    setAssignedBedsToSelectedChatBedsideNurse([]);
    setIsAddingPatientToChat(false);
  };

  //This is for image loading and handling for full size
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageFulLScreenVisible, setImageFullScreenVisible] = useState(false);
  const showImageFullScreenModal = (imageUrl: string) => {
    setImageUrl(imageUrl);
    setImageFullScreenVisible(true);
  };
  const hideImageFullScreenModal = () => setImageFullScreenVisible(false);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  //This is to get the assigned patients that intersects bedside nurse and virtual nurse
  const [
    assignedBedsToSelectedChatBedsideNurse,
    setAssignedBedsToSelectedChatBedsideNurse,
  ] = useState<SmartBed[]>([]);

  //This is to select the patient that we want to share to the bedside nurse
  const [
    shareToSelectedChatBedWithPatientId,
    setShareToSelectedChatBedWithPatientId,
  ] = useState("");

  //This is to show patient preview message
  const [patientPreviewMessage, setPatientPreviewMessage] = useState<Message>();

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

    // Cleanup the interval when the component is unmounted or when the effect is re-run
    return () => clearInterval(refreshChats);
  }, [sessionData?.user.id]);

  useEffect(() => {
    if (textMessage) {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
      }
    }
  }, [textMessage]);

  useEffect(() => {
    if (shareToSelectedChatBedWithPatientId !== "") {
      createPatientPreviewMessage().then((msg) => {
        setPatientPreviewMessage(msg);
      });
    }
  }, [shareToSelectedChatBedWithPatientId]);

  useEffect(() => {
    const calculateDimensions = () => {
      const screenHeight = window.innerHeight * 0.9;
      const screenWidth = (screenHeight / 4) * 3;
      setImageWidth(screenWidth);
      setImageHeight(screenHeight);
    };

    calculateDimensions();

    // Add event listener for window resize
    window.addEventListener("resize", calculateDimensions);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", calculateDimensions);
    };
  }, []);

  useEffect(() => {
    console.log("Start receiving updates from BedSide Nurse Chat");
    socket.on("updateVirtualNurseChat", (updatedChat: Chat) => {
      //update chats
      console.log("Received an update from bedside nurse");
      setSelectedChat((prevState) => {
        if (prevState?._id === updatedChat._id) {
          return updatedChat;
        } else {
          return prevState;
        }
      });
      getChatsForVirtualNurse(updatedChat.virtualNurse as VirtualNurse);
    });
  }, []);

  const getChatsForVirtualNurse = async (nurse: VirtualNurse | undefined) => {
    if (nurse === undefined) return;
    const chatsRes: Chat[] = await fetchChatsForVirtualNurse(nurse!._id);

    if (chatsRes === undefined) return;

    const unarchivedChats = chatsRes.filter((chat) => !chat.isArchived);
    setChats([...unarchivedChats]);
    setArchivedAndUnarchivedChats([...chatsRes]);
  };

  const getPatients = async (virtualNurse: any) => {
    let beds: SmartBed[] = [];
    for (const ward of virtualNurse.wards) {
      const smartbeds: SmartBed[] = await fetchBedsByWardId(ward);
      beds.push(...smartbeds);
    }
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

  const handleSharePatientToSelectedChat = () => {
    handleSendPatientMessage();
    handleCloseSharingPatientToChat();
  };

  const handleSendPatientMessage = () => {
    if (patientPreviewMessage === undefined || selectedChat === undefined)
      return;

    createPatientPreviewMessage().then((msg) => {
      const content = msg.content;
      addNewPatientMessageToChat(
        selectedChat._id,
        patientPreviewMessage,
        virtualNurse!._id,
        content
      ).then((updatedChat) => {
        if (updatedChat === undefined) return;
        setSelectedChat(updatedChat);
        const updatedChats = chats.filter(
          (chat) => chat._id !== updatedChat._id
        );
        setChats([...updatedChats, updatedChat]);

        updatedChat.messages.sort(
          (a: Message, b: Message) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        socket.emit("virtualToBedsideNurseChatUpdate", updatedChat);
      });
    });
  };

  const handleSendMessage = () => {
    if (textMessage === "") return;
    if (selectedChat === undefined) return;
    const trimmedTextMessage = textMessage.trim();
    addNewMessageToChat(
      selectedChat._id,
      trimmedTextMessage,
      virtualNurse!._id
    ).then((updatedChat) => {
      if (updatedChat === undefined) return;
      setSelectedChat(updatedChat);

      const updatedChats = chats.filter((chat) => chat._id !== updatedChat._id);
      setChats([...updatedChats, updatedChat]);

      updatedChat.messages.sort(
        (a: Message, b: Message) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      socket.emit("virtualToBedsideNurseChatUpdate", updatedChat);

      //reset
      setTextMessage("");
    });
  };

  const handleUpdateMessage = () => {
    if (!messageInEditMode) return;
    if (textMessage === "") {
      handleDeleteMessage(messageInEditMode);
      handleCloseEditButton();
      return;
    }
    const trimmedTextMessage = textMessage.trim();
    updateMessageContent(
      selectedChat!._id,
      messageInEditMode._id,
      trimmedTextMessage
    ).then((updatedChat) => {
      if (updatedChat === undefined) return;

      //update chats
      const updatedChats = chats.filter((chat) => chat._id !== updatedChat._id);
      setChats([...updatedChats, updatedChat]);
      setSelectedChat(updatedChat);

      //Send to websocket
      updatedChat.messages.sort(
        (a: Message, b: Message) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      socket.emit("virtualToBedsideNurseChatUpdate", updatedChat);

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

  const handleDeleteChat = (chat: Chat) => {
    if (chat === undefined) return;

    deleteChat(chat._id).then((deletedChat) => {
      if (deletedChat === null) return;

      setSelectedChat(undefined);
      //update chats
      const updatedChats = chats.filter((chat) => chat._id !== deletedChat._id);
      setChats([...updatedChats]);
    });
  };

  const handleDeleteMessage = (message: Message) => {
    if (selectedChat === undefined) return;

    deleteMessageFromChat(selectedChat._id, message._id).then((updatedChat) => {
      if (updatedChat === undefined) return;
      setSelectedChat(updatedChat);
      //update chats
      const updatedChats = chats.filter((chat) => chat._id !== updatedChat._id);
      setChats([...updatedChats, updatedChat]);

      //Send to websocket
      updatedChat.messages.sort(
        (a: Message, b: Message) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      socket.emit("virtualToBedsideNurseChatUpdate", updatedChat);
    });
  };

  const handleCreateChat = () => {
    //check for existing chat
    for (const chat of chats) {
      const bedSideNurse = chat.bedsideNurse as BedSideNurse;
      if (bedSideNurse._id === selectedBedsideNurseId) {
        setSelectedChat(chat);
        handleCloseCreateChat();
        setSelectedBedWithPatientId("");
        setSelectedBedsideNurseId("");
        return;
      }
    }
    for (const chat of archivedAndUnarchivedChats) {
      const bedSideNurse = chat.bedsideNurse as BedSideNurse;
      if (bedSideNurse._id === selectedBedsideNurseId) {
        reopenChat(chat._id).then((reopenedChat) => {
          if (reopenedChat === null) return;
          setSelectedChat(chat);
          setChats([...chats, reopenedChat]);
          handleCloseCreateChat();
          setSelectedBedWithPatientId("");
          setSelectedBedsideNurseId("");
          return;
        });
      }
    }

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

  const createPatientPreviewMessage = async (): Promise<Message> => {
    if (bedsWithPatientsData === undefined || virtualNurse === undefined) {
      const newMsg: Message = {
        _id: "123",
        content: "Please check on patient.",
        createdAt: new Date(Date.now()).toLocaleString(),
        createdBy: "123",
      };
      return newMsg;
    }

    const chosenBeds = bedsWithPatientsData.filter(
      (bed) => bed._id === shareToSelectedChatBedWithPatientId
    );
    if (chosenBeds.length === 0) {
      const newMsg: Message = {
        _id: "123",
        content: "Please check on patient.",
        createdAt: new Date(Date.now()).toLocaleString(),
        createdBy: "123",
      };
      return newMsg;
    }

    const patient = chosenBeds[0]!.patient as Patient;
    let patientVitalsMsg = "Please check on patient.";
    const vital = await getVitalByPatientId(patient._id);
    if (vital !== null) {
      const respRate =
        vital?.respRate && vital?.respRate[vital?.respRate.length - 1]?.reading
          ? vital?.respRate[vital?.respRate.length - 1].reading
          : "NA";
      const temp =
        vital?.temperature &&
        vital?.temperature[vital?.temperature.length - 1]?.reading
          ? vital?.temperature[vital?.temperature.length - 1].reading
          : "NA";
      const heartRate =
        vital?.heartRate &&
        vital?.heartRate[vital?.heartRate.length - 1]?.reading
          ? vital?.heartRate[vital?.heartRate.length - 1].reading
          : "NA";
      const bpSys =
        vital?.bloodPressureSys &&
        vital?.bloodPressureSys[vital?.bloodPressureSys.length - 1]?.reading
          ? vital?.bloodPressureSys[vital?.bloodPressureSys.length - 1].reading
          : "NA";
      const bpDia =
        vital?.bloodPressureDia &&
        vital?.bloodPressureDia[vital?.bloodPressureDia.length - 1]?.reading
          ? vital?.bloodPressureDia[vital?.bloodPressureDia.length - 1].reading
          : "NA";
      const spO2 =
        vital?.spO2 && vital?.spO2[vital?.spO2.length - 1]?.reading
          ? vital?.spO2[vital?.spO2.length - 1].reading
          : "NA";
      const news2 =
        vital?.news2Score &&
        vital?.news2Score[vital?.news2Score.length - 1]?.reading
          ? vital?.news2Score[vital?.news2Score.length - 1].reading
          : "NA";

      patientVitalsMsg = "Virtual Nurse shared a Patient vitals with you.";
      patientVitalsMsg += "\nRR: " + respRate;
      patientVitalsMsg += "\nTemp: " + temp;
      patientVitalsMsg += "\nHR: " + heartRate;
      patientVitalsMsg += "\nBP Sys/Dia: " + bpSys + "/" + bpDia;
      patientVitalsMsg += "\nNews2: " + news2;
    }

    const newMsg: Message = {
      _id: "123",
      patient: chosenBeds[0]!.patient,
      content: patientVitalsMsg,
      createdAt: new Date(Date.now()).toLocaleString(),
      createdBy: virtualNurse!._id,
    };
    return newMsg;
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
            bgcolor: white,
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
              bgcolor: blue,
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
                sx={{ fontSize: 20, fontWeight: "bold", color: white }}
              >
                Chats
              </Typography>
              <IconButton
                onMouseOver={() => setHoverCreateButton(true)}
                onMouseOut={() => setHoverCreateButton(false)}
                onClick={handleOpenCreateChat}
              >
                {hoverCreateButton ? (
                  <AddCircleIcon sx={{ color: white, fontSize: 30 }} />
                ) : (
                  <AddCircleOutlineIcon sx={{ color: white, fontSize: 30 }} />
                )}
              </IconButton>
            </Box>
            <Search
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              chats={chats}
              handleDeleteChat={handleDeleteChat}
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
                    backgroundColor: lightBlue,
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
                      color: darkBlue,
                      fontWeight: "bold",
                      fontSize: "22px",
                    }}
                  >
                    {(selectedChat?.bedsideNurse as BedSideNurse)?.name}
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
                          showImageFullScreenModal={showImageFullScreenModal}
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
                      backgroundColor: lightBlue,
                      borderRadius: "10px 10px 0px 0px",
                      paddingTop: "5px",
                      paddingBottom: "5px",
                      width: "100%",
                    }}
                  >
                    <EditIcon
                      sx={{
                        fontSize: "20",
                        color: darkBlue,
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
                          color: darkBlue,
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
                        <CloseIcon sx={{ fontSize: "20", color: darkBlue }} />
                      </IconButton>
                    </Box>
                  </Box>
                )}
                <Box
                  sx={{
                    backgroundColor: lighterBlue,
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
                      color: darkBlue,
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
                      <DoneIcon sx={{ color: blue, fontSize: 30 }} />
                    </IconButton>
                  ) : (
                    <>
                      <IconButton onClick={handleOpenSharingPatientToChat}>
                        <PersonOutlineIcon sx={{ color: blue, fontSize: 30 }} />
                      </IconButton>
                      <IconButton onClick={handleSendMessage}>
                        <ArrowCircleUpIcon sx={{ color: blue, fontSize: 30 }} />
                      </IconButton>
                    </>
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
                    color: darkBlue,
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
            bgcolor: white,
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
              color: darkBlue,
              marginBottom: "20px",
            }}
          >
            Create Chat
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "bold",
              color: darkBlue,
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
                    {(bedWithPatient?.patient as Patient)?.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "bold",
              color: darkBlue,
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
              backgroundColor: darkBlue,
              alignSelf: "flex-end",
              "&:hover": {
                backgroundColor: darkBlue,
              },
            }}
            onClick={handleCreateChat}
          >
            Create
          </Button>
        </Box>
      </Modal>
      <Modal
        open={isAddingPatientToChat}
        onClose={handleCloseSharingPatientToChat}
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
            bgcolor: white,
            borderRadius: 5,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "none",
            outline: "none",
            padding: "20px",
            overflowY: "scroll",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "bold",
              color: darkBlue,
            }}
          >
            Share Patient to Bedside Nurse
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            Patients below are assigned to{" "}
            {(selectedChat?.bedsideNurse as BedSideNurse)?.name}, select one to
            share vitals.
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "bold",
              color: darkBlue,
            }}
          >
            Patient
          </Typography>

          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <Select
              value={shareToSelectedChatBedWithPatientId}
              onChange={(event) => {
                setShareToSelectedChatBedWithPatientId(event.target.value);
              }}
            >
              {assignedBedsToSelectedChatBedsideNurse?.map((bedWithPatient) => {
                return (
                  <MenuItem key={bedWithPatient._id} value={bedWithPatient._id}>
                    {(bedWithPatient?.patient as Patient)?.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: "bold",
                color: darkBlue,
              }}
            >
              Preview
            </Typography>
            <Box
              sx={{
                height: "20vh",
                backgroundColor: lighterBlue,
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column-reverse",
                paddingTop: "10px",
                paddingRight: "20px",
                overflowY: "scroll",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {patientPreviewMessage && (
                <ChatBubble
                  message={patientPreviewMessage}
                  virtualNurse={virtualNurse}
                  handleDeleteMessage={() => {}}
                  handleEditMessage={() => {}}
                  enableActionsUponRightClick={false}
                  showImageFullScreenModal={showImageFullScreenModal}
                />
              )}
            </Box>
          </Box>
          <Button
            variant="contained"
            sx={{
              marginTop: "20px",
              borderRadius: "20px",
              backgroundColor: darkBlue,
              alignSelf: "flex-end",
              "&:hover": {
                backgroundColor: darkBlue,
              },
            }}
            onClick={handleSharePatientToSelectedChat}
          >
            Share
          </Button>
        </Box>
      </Modal>
      <Modal
        open={imageFulLScreenVisible}
        onClose={hideImageFullScreenModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "20px",
            width: imageWidth,
            height: imageHeight,
            bgcolor: white,
            borderRadius: 5,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "none",
            outline: "none",
            padding: "20px",
            overflowY: "scroll",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {imageLoading && (
            <>
              <Typography>Loading...</Typography>
            </>
          )}
          {imageUrl && (
            <Image
              onLoadStart={() => setImageLoading(true)}
              onLoad={() => setImageLoading(false)}
              src={imageUrl}
              alt="Image"
              width={imageWidth}
              height={imageHeight}
              style={{ borderRadius: "10px" }}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ChatBoxModal;