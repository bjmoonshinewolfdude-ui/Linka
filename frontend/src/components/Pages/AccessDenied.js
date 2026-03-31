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
      justifyContent="center"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { background: 'var(--surface-dark)' },
        '&::-webkit-scrollbar-thumb': { background: 'var(--surface-medium)', borderRadius: '4px' },
      }}
      w="full"
      mx="auto"
    >
      <Box py={6} px={4} w="full" maxW="450px">
        <VStack spacing={6} align="stretch" w="full" textAlign="center">
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
    </Box>
  );
};

export default AccessDenied;
