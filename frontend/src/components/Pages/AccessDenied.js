import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";

const AccessDenied = () => {
  const history = useHistory();

  return (
    <Box
      bg="var(--dark-bg)"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <VStack spacing={6} textAlign="center" maxW="400px">
        <Icon
          as={LockIcon}
          boxSize={16}
          color="var(--accent-pink)"
        />
        <Heading color="var(--accent-pink)" size="lg">
          Access Denied
        </Heading>
        <Text fontSize="md" color="var(--text-secondary)">
          You do not have permission to access this page. 
          This area is restricted to administrators only.
        </Text>
        <Button
          onClick={() => history.push("/chats")}
          bg="var(--accent-cyan)"
          color="var(--dark-bg)"
          size="md"
          _hover={{ bg: "var(--acid-yellow)" }}
        >
          Return to Chats
        </Button>
      </VStack>
    </Box>
  );
};

export default AccessDenied;
