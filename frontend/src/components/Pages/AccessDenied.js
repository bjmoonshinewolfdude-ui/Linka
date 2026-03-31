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
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      bg="var(--dark-bg)"
      color="var(--text-primary)"
      p={4}
    >
      <VStack spacing={6} textAlign="center" maxW="500px">
        <Icon
          as={LockIcon}
          boxSize={20}
          color="var(--accent-pink)"
        />
        <Heading color="var(--accent-pink)" size="xl">
          Access Denied
        </Heading>
        <Text fontSize="lg" color="var(--text-secondary)">
          You do not have permission to access this page. 
          This area is restricted to administrators only.
        </Text>
        <Button
          onClick={() => history.push("/chats")}
          bg="var(--accent-cyan)"
          color="var(--dark-bg)"
          size="lg"
          _hover={{ bg: "var(--acid-yellow)" }}
        >
          Return to Chats
        </Button>
      </VStack>
    </Box>
  );
};

export default AccessDenied;
