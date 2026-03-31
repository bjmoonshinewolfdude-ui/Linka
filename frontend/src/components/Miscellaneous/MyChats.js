import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { Box } from "@chakra-ui/layout";
import { useEffect } from "react";
import { Button } from "@chakra-ui/button";
import { AddIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/layout";
import { Stack } from "@chakra-ui/layout";
import { getSender } from "../../Config/ChatLogics";
import GroupChatModal from "./GroupChatModal";
import io from "socket.io-client";

const ENDPOINT = process.env.NODE_ENV === "production" ? window.location.origin : "http://localhost:5000";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = React.useState();
  const { setSelectedChat, chats, user, setChats, selectedChat } = ChatState();
  const toast = useToast();
  const socketRef = React.useRef();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred while loading chats!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // Separate effect for socket setup - runs once
  useEffect(() => {
    if (!user?._id) return;
    
    // Setup socket for real-time chat updates
    socketRef.current = io(ENDPOINT);
    socketRef.current.emit("setup", { userId: user._id });

    socketRef.current.on("connected", () => {
      console.log("MyChats socket connected");
    });

    socketRef.current.on("chat created", (newChat) => {
      console.log("New chat received via socket:", newChat);
      setChats((prevChats) => {
        if (!prevChats) return [newChat];
        const exists = prevChats.find((c) => c._id === newChat._id);
        if (exists) return prevChats;
        return [newChat, ...prevChats];
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // Effect for fetching chats - runs when fetchAgain changes
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"var(--surface-dark)"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
      borderColor={"var(--border-color)"}
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.3)"
    >
      <Box
        pb={3}
        px={3}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        flexDir="row"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          w="100%"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >
          <Text 
            fontSize={{ base: "26px", md: "30px" }} 
            whiteSpace="nowrap"
            color="var(--acid-yellow)"
            fontWeight="bold"
            textShadow="0 0 8px rgba(255, 215, 0, 0.3)"
          >
            My Chats
          </Text>

          <GroupChatModal>
            <Button
              className="btn-primary"
              size={{ base: "sm", md: "md" }}
              rightIcon={<AddIcon />}
              flexShrink={0}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>
      </Box>

      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"var(--surface-medium)"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        <Stack overflowY={"scroll"}>
          {(chats || [])
            .filter((chat) => chat && chat._id && chat.users && chat.users.length > 0)
            .map((chat) => (
            <Box
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedChat === chat ? "var(--accent-cyan)" : "var(--surface-dark)"}
              color={selectedChat === chat ? "var(--dark-bg)" : "var(--text-primary)"}
              px={3}
              py={2}
              borderRadius="lg"
              border="1px solid var(--border-color)"
              _hover={{
                bg: selectedChat === chat ? "var(--accent-cyan)" : "var(--surface-medium)",
                borderColor: "var(--accent-yellow)",
                transform: "translateX(2px)",
              }}
              transition="all 0.2s ease"
            >
              <Text fontWeight={selectedChat === chat ? "bold" : "normal"}>
                {!chat.isGroupChat
                  ? loggedUser
                    ? getSender(loggedUser, chat.users)
                    : "Loading..."
                  : chat.chatName}
              </Text>
            </Box>
          ))}
          {(!chats || chats.length === 0) && (
            <Box textAlign="center" py={8}>
              <Text color="var(--text-secondary)" fontSize="lg" mb={2}>
                No chats yet
              </Text>
              <Text color="var(--text-muted)" fontSize="sm" mb={4}>
                Start a new chat or create a group!
              </Text>
              <GroupChatModal>
                <Button
                  className="btn-primary"
                  size="sm"
                >
                  New Group Chat
                </Button>
              </GroupChatModal>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default MyChats;
