import React from "react";
import { Stack, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <Stack>
      <SkeletonCircle size="10" />
      <SkeletonText mt="4" noOfLines={4} spacing="4" />
    </Stack>
  );
};

export default ChatLoading;
