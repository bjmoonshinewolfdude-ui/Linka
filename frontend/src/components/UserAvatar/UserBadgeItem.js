import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction, isAdmin }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      variant={"solid"}
      fontSize={12}
      bgColor={isAdmin ? "var(--accent-yellow)" : "var(--neon-pink)"}
      color={isAdmin ? "var(--dark-bg)" : "var(--text-primary)"}
      cursor={"pointer"}
      onClick={handleFunction}
      fontWeight="bold"
      border="1px solid var(--border-color)"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: isAdmin 
          ? "0 2px 8px rgba(255, 215, 0, 0.4)"
          : "0 2px 8px rgba(255, 20, 147, 0.4)",
      }}
      transition="all 0.2s ease"
    >
      {user.name}
      <CloseIcon pl={1} boxSize={3} />
    </Box>
  );
};

export default UserBadgeItem;
