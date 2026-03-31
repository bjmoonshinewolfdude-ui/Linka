import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import { ArrowBackIcon } from "@chakra-ui/icons";

const ENDPOINT = process.env.NODE_ENV === "production" ? window.location.origin : "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  // Fetch messages
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config,
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", (room) => {
      // Convert both to strings for comparison
      if (room && selectedChat?._id && room.toString() === selectedChat._id.toString()) {
        setIsTyping(true);
      }
    });
    socket.on("stop typing", (room) => {
      // Convert both to strings for comparison
      if (room && selectedChat?._id && room.toString() === selectedChat._id.toString()) {
        setIsTyping(false);
      }
    });

    // eslint-disable-next-line
  }, [selectedChat]);

  // Track previous chat to leave room when switching
  const prevChatRef = React.useRef(null);

  useEffect(() => {
    // Leave previous chat room if exists
    if (prevChatRef.current && prevChatRef.current._id !== selectedChat?._id) {
      socket.emit("leave chat", prevChatRef.current._id);
    }
    
    fetchMessages();
    selectedChatCompare = selectedChat;
    // Clear typing indicator when switching chats
    setIsTyping(false);
    
    // Update previous chat ref
    prevChatRef.current = selectedChat;
    
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      // Check if user is part of this chat
      const isUserInChat = newMessageRecieved.chat.users.some(
        (u) => u._id === user._id
      );
      
      if (!isUserInChat) return; // Don't process messages from chats user isn't in

      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // Check if we already have a notification for this chat
        const existingNotifIndex = notification.findIndex(
          (n) => n.chat._id === newMessageRecieved.chat._id
        );
        
        if (existingNotifIndex === -1) {
          // New chat notification - add with count 1
          setNotification([{ ...newMessageRecieved, count: 1 }, ...notification]);
        } else {
          // Existing chat - increment the count
          const updatedNotifications = [...notification];
          updatedNotifications[existingNotifIndex] = {
            ...updatedNotifications[existingNotifIndex],
            count: (updatedNotifications[existingNotifIndex].count || 1) + 1
          };
          setNotification(updatedNotifications);
        }
        setFetchAgain(!fetchAgain);
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  // Debounce timer for typing
  const typingTimeoutRef = React.useRef(null);

  // Send message
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage && !isSending) {
      setIsSending(true);
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config,
        );
        setMessages((prev) => [...prev, data]);
        socket.emit("new message", data);
        setNewMessage("");
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } finally {
        setIsSending(false);
      }
    }
  };

  // Typing indicator with debounce
  const typingHandler = (event) => {
    setNewMessage(event.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, 3000);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            bg="var(--surface-dark)"
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            p={4}
            borderWidth="1px 0px"
            borderColor="var(--border-color)"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
              className="btn-secondary"
              variant="ghost"
              _hover={{
                bg: "var(--surface-medium)",
                color: "var(--accent-cyan)",
              }}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <Text
                    fontSize={{ base: "20px", md: "24px" }}
                    fontFamily="Work sans"
                    fontWeight="bold"
                    color="var(--acid-yellow)"
                    display="flex"
                    alignItems="center"
                    flex={1}
                    textAlign="center"
                    justifyContent="center"
                  >
                    {getSender(user, selectedChat.users)}
                    <Box position="absolute" right={4}>
                      <ProfileModal
                        user={getSenderFull(user, selectedChat.users)}
                      />
                    </Box>
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    fontSize={{ base: "20px", md: "24px" }}
                    fontFamily="Work sans"
                    fontWeight="bold"
                    color="var(--acid-yellow)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flex={1}
                    textAlign="center"
                  >
                    {selectedChat.chatName.toUpperCase()}
                    <Box position="absolute" right={4}>
                      <UpdateGroupChatModal
                        fetchMessages={fetchMessages}
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                      />
                    </Box>
                  </Text>
                </>
              ))}
          </Box>

          {/* Messages & Input */}
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            pl={4} // extra left padding
            pr={4} // extra right padding
            bg="var(--surface-medium)"
            w="100%"
            flex={1} // fills remaining space
            borderRadius="lg"
            overflow="hidden" // changed from auto to hidden
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
                {istyping && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    px={3}
                    py={2}
                    mt={2}
                  >
                    <Box
                      bg="var(--surface-dark)"
                      border="1px solid var(--border-color)"
                      borderRadius="20px"
                      padding="8px 16px"
                      display="flex"
                      alignItems="center"
                      gap="4px"
                    >
                      {selectedChat.isGroupChat && (
                        <Text fontSize="xs" color="var(--text-secondary)" mr={2}>
                          Someone is typing
                        </Text>
                      )}
                      <Box
                        width="8px"
                        height="8px"
                        bg="var(--accent-cyan)"
                        borderRadius="50%"
                        animation="bounce 1.4s infinite ease-in-out both"
                      />
                      <Box
                        width="8px"
                        height="8px"
                        bg="var(--accent-cyan)"
                        borderRadius="50%"
                        animation="bounce 1.4s infinite ease-in-out both"
                        animationDelay="0.16s"
                      />
                      <Box
                        width="8px"
                        height="8px"
                        bg="var(--accent-cyan)"
                        borderRadius="50%"
                        animation="bounce 1.4s infinite ease-in-out both"
                        animationDelay="0.32s"
                      />
                    </Box>
                  </Box>
                )}
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="var(--surface-dark)"
                border="1px solid var(--border-color)"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
                className="input-field"
                color="var(--text-primary)"
                _focus={{
                  borderColor: "var(--accent-cyan)",
                  boxShadow: "0 0 0 1px var(--accent-cyan)",
                }}
                _hover={{
                  borderColor: "var(--medium-grey)",
                }}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          h="100%"
          bg="var(--dark-bg)"
        >
          <Text 
            fontSize="3xl" 
            pb={3} 
            fontFamily="Work sans"
            color="var(--text-secondary)"
            textAlign="center"
          >
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
