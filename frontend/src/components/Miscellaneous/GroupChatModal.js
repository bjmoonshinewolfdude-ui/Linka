import React from "react";
import {
  Button,
  useDisclosure,
  useToast,
  Input,
  FormControl,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [createLoading, setCreateLoading] = React.useState(false);

  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occurred!",
        description: "Failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setCreateLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config,
      );
      setChats([data, ...(chats || [])]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleAddUser = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
        <ModalContent 
          bg="var(--surface-dark)"
          border="1px solid var(--border-color)"
          color="var(--text-primary)"
        >
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            textAlign="center"
            color="var(--acid-yellow)"
            borderBottom="1px solid var(--border-color)"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton 
            color="var(--text-secondary)"
            _hover={{ color: "var(--accent-pink)" }}
          />
          <ModalBody display="flex" flexDir="column" alignItems="flex-start">
            <FormControl>
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
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={2}
                value={search}
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

            <Box display="flex" flexWrap="wrap" mb={2}>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                  isAdmin={u._id === user._id} // current user as admin by default
                />
              ))}
            </Box>

            {loading ? (
              <div style={{ color: "var(--text-primary)" }}>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleAddUser(u)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter borderTop="1px solid var(--border-color)">
            <Button 
              className="btn-primary"
              onClick={handleSubmit}
              isLoading={createLoading}
              loadingText="Creating..."
              isDisabled={createLoading}
            >
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
