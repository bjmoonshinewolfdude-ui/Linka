import React from "react";
import {
  Icon,
  Modal,
  useDisclosure,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Box,
  FormControl,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { ChatState } from "../../Context/ChatProvider";
import { useToast } from "@chakra-ui/react";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { Input, Button } from "@chakra-ui/react";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [renameLoading, setRenameLoading] = React.useState(false);
  const { selectedChat, setSelectedChat, user } = ChatState();

  const toast = useToast();

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config,
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to remove user from group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config,
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to add user to group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config,
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to rename the chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }

    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        onClick={onOpen}
        icon={<Icon as={FaEdit} />}
        className="btn-secondary"
        variant="ghost"
        _hover={{
          color: "var(--accent-cyan)",
          bg: "var(--surface-medium)",
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
        <ModalContent 
          bg="var(--surface-dark)"
          border="1px solid var(--border-color)"
          color="var(--text-primary)"
        >
          <ModalHeader
            fontSize={"35px"}
            display={"flex"}
            justifyContent={"center"}
            color="var(--acid-yellow)"
            borderBottom="1px solid var(--border-color)"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton 
            color="var(--text-secondary)"
            _hover={{ color: "var(--accent-pink)" }}
          />
          <ModalBody>
            <Box
              w={"100%"}
              display={"flex"}
              flexWrap={"wrap"}
              alignItems={"center"}
            >
              {(selectedChat.users || []).map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                  isAdmin={selectedChat.groupAdmin._id === u._id}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                maxLength={40}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                className="input-field"
                variant="filled"
                bg="var(--surface-medium)"
                border="1px solid var(--border-color)"
                color="var(--text-primary)"
                _focus={{
                  borderColor: "var(--accent-cyan)",
                  boxShadow: "0 0 0 1px var(--accent-cyan)",
                }}
                _hover={{
                  borderColor: "var(--medium-grey)",
                }}
              />
              <Text fontSize="xs" color="var(--text-secondary)" mt={1}>
                {" "}
                {groupChatName.length}/40{" "}
              </Text>
              <Button
                className="btn-primary"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
                className="input-field"
                variant="filled"
                bg="var(--surface-medium)"
                border="1px solid var(--border-color)"
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
            {loading ? (
              <Spinner size={"lg"} color="var(--accent-cyan)" />
            ) : (
              <Box>
                {searchResult?.map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleAddUser(u)}
                  />
                ))}
              </Box>
            )}
          </ModalBody>
          <ModalFooter borderTop="1px solid var(--border-color)">
            <Button 
              onClick={() => handleRemove(user)} 
              className="btn-secondary"
              _hover={{
                borderColor: "var(--accent-pink)",
                color: "var(--accent-pink)",
              }}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
