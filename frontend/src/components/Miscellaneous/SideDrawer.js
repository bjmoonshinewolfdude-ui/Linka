import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  Avatar,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { MenuList, MenuItem, MenuDivider } from "@chakra-ui/react";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";
import { Spinner } from "@chakra-ui/spinner";
import { getSender } from "../../Config/ChatLogics";

const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingChat, setLoadingChat] = React.useState(false);
  const {
    user,
    chats,
    setChats,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
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
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id))
        setChats([data, ...(chats || [])]);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"var(--surface-dark)"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"1px"}
        borderColor={"var(--border-color)"}
        boxShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button
            className="btn-secondary"
            variant="ghost"
            onClick={onOpen}
            _hover={{
              bg: "var(--surface-medium)",
              color: "var(--accent-cyan)",
            }}
          >
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize={"3xl"}
          fontFamily={"Work Sans"}
          fontWeight={"bold"}
          color={"var(--acid-yellow)"}
          textShadow="0 0 10px rgba(255, 215, 0, 0.4)"
        >
          Linka
        </Text>
        <div>
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              bg="transparent"
              color="var(--text-primary)"
              _hover={{
                bg: "var(--surface-medium)",
                color: "var(--accent-pink)",
              }}
              _active={{
                bg: "var(--surface-medium)",
                color: "var(--accent-pink)",
              }}
            >
              <BellIcon fontSize={"2xl"} m={1} />

              {notification.length > 0 && (
                <Box
                  position="absolute"
                  top="2px"
                  right="2px"
                  bg="var(--accent-pink)"
                  color="var(--text-primary)"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="bold"
                  px={2}
                  py={0.5}
                  minW="18px"
                  textAlign="center"
                >
                  {notification.reduce((acc, notif) => acc + (notif.count || 1), 0)}
                </Box>
              )}
            </MenuButton>
            <MenuList
              bg="var(--surface-dark)"
              border="1px solid var(--border-color)"
              color="var(--text-primary)"
              px={4}
              py={2}
              minWidth="200px"
              boxShadow="0 4px 6px rgba(0, 0, 0, 0.3)"
            >
              {!notification.length && (
                <Box px={2} py={3} color="var(--text-secondary)">
                  No New Messages
                </Box>
              )}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  px={4}
                  py={3}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                  bg="var(--surface-dark)"
                  color="var(--text-primary)"
                  _hover={{
                    bg: "var(--surface-medium)",
                    color: "var(--accent-cyan)",
                  }}
                  _active={{
                    bg: "var(--surface-medium)",
                    color: "var(--accent-cyan)",
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              bg="transparent"
              color="var(--text-primary)"
              rightIcon={<i className="fas fa-chevron-down"></i>}
              _hover={{
                bg: "var(--surface-medium)",
                color: "var(--accent-cyan)",
              }}
              _active={{
                bg: "var(--surface-medium)",
                color: "var(--accent-cyan)",
              }}
            >
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
                border="2px solid var(--border-color)"
              />
            </MenuButton>
            <MenuList 
              bg="var(--surface-dark)" 
              border="1px solid var(--border-color)"
              color="var(--text-primary)"
              boxShadow="0 4px 6px rgba(0, 0, 0, 0.3)"
            >
              <ProfileModal user={user}>
                <MenuItem 
                  bg="var(--surface-dark)"
                  color="var(--text-primary)"
                  _hover={{
                    bg: "var(--surface-medium)",
                    color: "var(--accent-cyan)",
                  }}
                  _active={{
                    bg: "var(--surface-medium)",
                    color: "var(--accent-cyan)",
                  }}
                >
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuItem 
                bg="var(--surface-dark)"
                color="var(--text-primary)"
                onClick={() => history.push("/settings")}
                _hover={{
                  bg: "var(--surface-medium)",
                  color: "var(--accent-cyan)",
                }}
                _active={{
                  bg: "var(--surface-medium)",
                  color: "var(--accent-cyan)",
                }}
              >
                Settings
              </MenuItem>
              <MenuDivider borderColor="var(--border-color)" />
              <MenuItem 
                bg="var(--surface-dark)"
                color="var(--text-primary)"
                onClick={logoutHandler}
                _hover={{
                  bg: "var(--surface-medium)",
                  color: "var(--accent-pink)",
                }}
                _active={{
                  bg: "var(--surface-medium)",
                  color: "var(--accent-pink)",
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
          {/* <MenuList></MenuList> */}
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay bg="rgba(0, 0, 0, 0.8)" />
        <DrawerContent 
          bg="var(--surface-dark)" 
          border="1px solid var(--border-color)"
        >
          <DrawerHeader 
            borderBottomWidth={"1px"} 
            borderColor="var(--border-color)"
            color="var(--text-primary)"
          >
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              <Button 
                className="btn-primary"
                onClick={handleSearch}
              >
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} d={"flex"} color="var(--accent-cyan)" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
