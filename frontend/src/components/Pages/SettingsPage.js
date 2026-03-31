import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  Badge,
  useToast,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const SettingsPage = () => {
  const { user, setUser } = ChatState();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();
  const history = useHistory();

  // Password validation rules
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const handlePasswordChange = () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all password fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation must match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      toast({
        title: "Invalid Password",
        description: validationError,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Simulate password change (mock for school project)
    toast({
      title: "Password Updated",
      description: "This is a demo. In production, this would update your password securely.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Clear fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    // Log to audit
    logAuditAction("PASSWORD_CHANGE", user.name, "User changed password");
  };

  const logAuditAction = (action, userName, details) => {
    const logs = JSON.parse(localStorage.getItem("auditLog") || "[]");
    logs.push({
      action,
      user: userName,
      details,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("auditLog", JSON.stringify(logs));
  };

  const handleLogout = () => {
    logAuditAction("LOGOUT", user.name, "User logged out");
    localStorage.removeItem("userInfo");
    setUser(null);
    history.push("/");
  };

  return (
    <Box p={6} bg="var(--dark-bg)" minH="100vh" color="var(--text-primary)">
      <VStack spacing={6} align="stretch" maxW="600px" mx="auto">
        <HStack justify="space-between">
          <Heading color="var(--acid-yellow)">Settings & Profile</Heading>
          <Button
            leftIcon={<ArrowBackIcon />}
            onClick={() => history.push("/chats")}
            bg="var(--surface-dark)"
            color="var(--text-primary)"
            _hover={{ bg: "var(--surface-medium)" }}
          >
            Back to Chats
          </Button>
        </HStack>

        {/* Profile Section */}
        <Box bg="var(--surface-dark)" p={6} borderRadius="lg" borderWidth="1px">
          <VStack spacing={4} align="center">
            <Avatar
              size="2xl"
              src={user?.pic}
              name={user?.name}
              border="3px solid var(--accent-cyan)"
            />
            <Box textAlign="center">
              <Heading size="md">{user?.name}</Heading>
              <Text color="var(--text-secondary)">{user?.email}</Text>
              <Badge
                mt={2}
                colorScheme={user?.role === "admin" ? "red" : "green"}
                bg={user?.role === "admin" ? "var(--accent-pink)" : "var(--accent-cyan)"}
                color="var(--dark-bg)"
              >
                {user?.role === "admin" ? "Administrator" : "Standard User"}
              </Badge>
            </Box>
          </VStack>
        </Box>

        {/* Change Password Section */}
        <Box bg="var(--surface-dark)" p={6} borderRadius="lg" borderWidth="1px">
          <Heading size="md" mb={4} color="var(--accent-cyan)">
            Change Password
          </Heading>
          
          <Alert status="info" mb={4} bg="var(--surface-medium)" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">
              Password must be at least 8 characters with uppercase, lowercase, 
              number, and special character.
            </Text>
          </Alert>

          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Current Password</FormLabel>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                bg="var(--dark-bg)"
                borderColor="var(--border-color)"
                color="var(--text-primary)"
                _hover={{ borderColor: "var(--medium-grey)" }}
                _focus={{ borderColor: "var(--accent-cyan)" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                bg="var(--dark-bg)"
                borderColor="var(--border-color)"
                color="var(--text-primary)"
                _hover={{ borderColor: "var(--medium-grey)" }}
                _focus={{ borderColor: "var(--accent-cyan)" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                bg="var(--dark-bg)"
                borderColor="var(--border-color)"
                color="var(--text-primary)"
                _hover={{ borderColor: "var(--medium-grey)" }}
                _focus={{ borderColor: "var(--accent-cyan)" }}
              />
            </FormControl>

            <Button
              onClick={handlePasswordChange}
              bg="var(--accent-cyan)"
              color="var(--dark-bg)"
              width="100%"
              _hover={{ bg: "var(--acid-yellow)" }}
            >
              Update Password
            </Button>
          </VStack>
        </Box>

        {/* Session Management */}
        <Box bg="var(--surface-dark)" p={6} borderRadius="lg" borderWidth="1px">
          <Heading size="md" mb={4} color="var(--accent-cyan)">
            Session Management
          </Heading>
          <Button
            onClick={handleLogout}
            bg="var(--accent-pink)"
            color="var(--dark-bg)"
            width="100%"
            _hover={{ bg: "red.400" }}
          >
            Logout
          </Button>
        </Box>

        {/* Data Storage Notice */}
        <Box bg="var(--surface-dark)" p={4} borderRadius="lg" borderWidth="1px">
          <Text fontSize="sm" color="var(--text-secondary)">
            <strong>Data Storage Notice:</strong> This application uses localStorage 
            for prototype data persistence. In a production environment, all data would 
            be stored securely on server-side databases with proper encryption and 
            access controls.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default SettingsPage;
