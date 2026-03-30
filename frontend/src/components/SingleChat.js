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
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  // Send message
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
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
      }
    }
  };

  // Typing indicator
  const typingHandler = (event) => {
    setNewMessage(event.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
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
