import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender } from "../Config/ChatLogics";
import { Tooltip } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { isSameSenderMargin } from "../Config/ChatLogics";
import "./styles.css";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      <div style={{ padding: "0 8px" }}>
        {messages &&
          messages.map((message, index) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                gap: "8px",
              }}
              key={message._id}
              className="message"
            >
              {(isSameSender(messages, message, index, user._id) ||
                isLastMessage(messages, index, user._id)) && (
                <Tooltip
                  label={message.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={0} // removed margin since we're using gap
                    size="sm"
                    cursor="pointer"
                    name={message.sender.name}
                    src={message.sender.pic}
                    flexShrink={0}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor:
                    message.sender._id === user._id ? "var(--accent-cyan)" : "var(--surface-dark)",
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(
                    messages,
                    message,
                    index,
                    user._id,
                  ),
                  marginTop: 8,
                  wordWrap: "break-word",
                  display: "inline-block",
                  border: message.sender._id === user._id ? "none" : "1px solid var(--border-color)",
                  color: message.sender._id === user._id ? "var(--dark-bg)" : "var(--text-primary)",
                  boxShadow: message.sender._id === user._id 
                    ? "0 2px 4px rgba(0, 206, 209, 0.3)" 
                    : "0 2px 4px rgba(0, 0, 0, 0.3)",
                }}
              >
                {message.content}
              </span>
            </div>
          ))}
      </div>
    </ScrollableFeed>
  );
};

export default ScrollableChat;
