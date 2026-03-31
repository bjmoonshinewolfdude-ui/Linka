import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Icon,
  Card,
  CardBody,
  keyframes,
} from "@chakra-ui/react";
import { LockIcon, ArrowLeftIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";

// Pulse animation for the lock icon
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 20px rgba(255, 0, 128, 0.4); }
  50% { box-shadow: 0 0 40px rgba(255, 0, 128, 0.6); }
  100% { box-shadow: 0 0 20px rgba(255, 0, 128, 0.4); }
`;

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
      p={{ base: 4, md: 8 }}
      position="relative"
      overflow="hidden"
    >
      {/* Background decorative elements */}
      <Box
        position="absolute"
        top="20%"
        left="10%"
        w="200px"
        h="200px"
        bg="var(--accent-pink)"
        opacity="0.03"
        borderRadius="full"
        filter="blur(60px)"
      />
      <Box
        position="absolute"
        bottom="20%"
        right="10%"
        w="300px"
        h="300px"
        bg="var(--accent-cyan)"
        opacity="0.03"
        borderRadius="full"
        filter="blur(80px)"
      />

      <Card
        bg="var(--surface-dark)"
        borderWidth="2px"
        borderColor="var(--accent-pink)"
        borderRadius="2xl"
        maxW="600px"
        w="full"
        boxShadow="0 0 60px rgba(255, 0, 128, 0.15)"
        position="relative"
        overflow="hidden"
      >
        {/* Top accent bar */}
        <Box
          h="4px"
          w="full"
          bg="linear-gradient(90deg, var(--accent-pink), var(--acid-yellow))"
        />

        <CardBody p={{ base: 8, md: 12 }}>
          <VStack spacing={8} textAlign="center">
            {/* Animated Lock Icon */}
            <Box
              p={6}
              borderRadius="full"
              bg="var(--surface-medium)"
              border="3px solid"
              borderColor="var(--accent-pink)"
              animation={`${pulse} 2s ease-in-out infinite, ${glow} 2s ease-in-out infinite`}
            >
              <Icon
                as={LockIcon}
                boxSize={16}
                color="var(--accent-pink)"
              />
            </Box>

            {/* Error Code */}
            <Text
              fontSize="6xl"
              fontWeight="bold"
              color="var(--accent-pink)"
              lineHeight="1"
              fontFamily="monospace"
            >
              403
            </Text>

            {/* Heading */}
            <VStack spacing={2}>
              <Heading 
                color="var(--accent-pink)" 
                size="xl"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Access Denied
              </Heading>
              <Box
                h="2px"
                w="60px"
                bg="linear-gradient(90deg, var(--accent-pink), transparent)"
                mx="auto"
              />
            </VStack>

            {/* Description */}
            <VStack spacing={4} maxW="400px">
              <Text fontSize="lg" color="var(--text-secondary)" lineHeight="1.6">
                You do not have permission to access this page. This area is restricted to authorized administrators only.
              </Text>
              <Text fontSize="sm" color="var(--text-muted)" fontStyle="italic">
                If you believe this is an error, please contact your system administrator.
              </Text>
            </VStack>

            {/* Action Buttons */}
            <VStack spacing={3} w="full" maxW="300px">
              <Button
                leftIcon={<ArrowLeftIcon />}
                onClick={() => history.push("/chats")}
                bg="var(--accent-cyan)"
                color="var(--dark-bg)"
                size="lg"
                w="full"
                py={6}
                fontWeight="bold"
                _hover={{ 
                  bg: "var(--acid-yellow)",
                  transform: "translateY(-2px)",
                }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
              >
                Return to Chats
              </Button>
              <Button
                variant="ghost"
                onClick={() => history.push("/")}
                color="var(--text-secondary)"
                w="full"
                _hover={{ color: "var(--text-primary)" }}
              >
                Go to Home Page
              </Button>
            </VStack>

            {/* Security footer */}
            <Box
              pt={6}
              borderTop="1px solid"
              borderColor="var(--border-color)"
              w="full"
            >
              <Text fontSize="xs" color="var(--text-muted)">
                This access attempt has been logged for security purposes.
              </Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default AccessDenied;
