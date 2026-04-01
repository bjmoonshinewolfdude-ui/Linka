/**
 * Chat Provider
 * React Context for global chat state management
 * Provides: User auth state, selected chat, chat list, notifications
 */

import { createContext, useContext } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";

// Create context for chat state
const ChatContext = createContext();

/**
 * ChatProvider Component
 * Wraps the app and provides chat state to all children
 * Handles user authentication persistence via localStorage
 */
const ChatProvider = ({ children }) => {
  // User authentication state
  const [user, setUser] = useState();
  // Currently selected/active chat
  const [selectedChat, setSelectedChat] = useState();
  // List of all user's chats
  const [chats, setChats] = useState([]);
  // Unread message notifications
  const [notification, setNotification] = useState([]);
  const history = useHistory();

  /**
   * Effect: Load user from localStorage on mount
   * Redirects to homepage if no user found
   */
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      history.push("/");
    }
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

/**
 * Custom hook to access chat context
 * Usage: const { user, chats, setChats } = ChatState();
 */
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
