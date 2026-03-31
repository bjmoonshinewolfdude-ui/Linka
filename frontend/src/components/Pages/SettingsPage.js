import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Avatar,
  Badge,
  useToast,
  Alert,
  AlertIcon,
  Flex,
} from "@chakra-ui/react";
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
    <Box
      bg="var(--dark-bg)"
      minH="100vh"
      display="flex"
      justifyContent="center"
      p={4}
    >
      <Box 
        py={6} 
        px={4} 
        maxW="450px" 
        mx="auto"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { background: 'var(--surface-dark)' },
          '&::-webkit-scrollbar-thumb': { background: 'var(--surface-medium)', borderRadius: '4px' },
        }}
      >
        <VStack spacing={6} align="center" mx="auto" textAlign="center">
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
          <Heading color="var(--acid-yellow)" size="lg">
            Settings
          </Heading>
          <Button
            onClick={() => history.push("/chats")}
            bg="var(--surface-dark)"
            color="var(--text-primary)"
            _hover={{ bg: "var(--surface-medium)" }}
            size="sm"
          >
            Back
          </Button>
        </Flex>

        {/* Profile Section */}
        <Box bg="var(--surface-dark)" p={4} borderRadius="lg" borderWidth="1px">
          <VStack spacing={3} align="center">
            <Avatar
              size="lg"
              src={user?.pic}
              name={user?.name}
              border="3px solid var(--accent-cyan)"
            />
            <Box textAlign="center">
              <Heading size="sm">{user?.name}</Heading>
              <Text color="var(--text-secondary)" fontSize="sm">{user?.email}</Text>
              <Badge
                mt={1}
                bg={user?.role === "admin" ? "var(--accent-pink)" : "var(--accent-cyan)"}
                color="var(--dark-bg)"
                size="sm"
              >
                {user?.role === "admin" ? "Admin" : "User"}
              </Badge>
            </Box>
          </VStack>
        </Box>

        {/* Change Password Section */}
        <Box bg="var(--surface-dark)" p={4} borderRadius="lg" borderWidth="1px">
          <Heading size="sm" mb={3} color="var(--accent-cyan)">
            Change Password
          </Heading>

          <Alert status="info" mb={3} bg="var(--surface-medium)" borderRadius="md" size="sm">
            <AlertIcon boxSize={4} />
            <Text fontSize="xs">
              8+ chars, uppercase, lowercase, number, special char.
            </Text>
          </Alert>

          <VStack spacing={3}>
            <FormControl>
              <FormLabel fontSize="sm">Current Password</FormLabel>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                bg="var(--dark-bg)"
                borderColor="var(--border-color)"
                color="var(--text-primary)"
                size="sm"
                _focus={{ borderColor: "var(--accent-cyan)" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">New Password</FormLabel>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                bg="var(--dark-bg)"
                borderColor="var(--border-color)"
                color="var(--text-primary)"
                size="sm"
                _focus={{ borderColor: "var(--accent-cyan)" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Confirm New Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                bg="var(--dark-bg)"
                borderColor="var(--border-color)"
                color="var(--text-primary)"
                size="sm"
                _focus={{ borderColor: "var(--accent-cyan)" }}
              />
            </FormControl>

            <Button
              onClick={handlePasswordChange}
              bg="var(--accent-cyan)"
              color="var(--dark-bg)"
              width="100%"
              _hover={{ bg: "var(--acid-yellow)" }}
              size="sm"
            >
              Update Password
            </Button>
          </VStack>
        </Box>

        {/* Session Management */}
        <Box bg="var(--surface-dark)" p={4} borderRadius="lg" borderWidth="1px">
          <Heading size="sm" mb={2} color="var(--accent-pink)">
            Session
          </Heading>
          <Button
            onClick={handleLogout}
            bg="var(--accent-pink)"
            color="var(--dark-bg)"
            width="100%"
            _hover={{ bg: "red.400" }}
            size="sm"
          >
            Logout
          </Button>
        </Box>

        {/* Data Storage Notice */}
        <Box bg="var(--surface-dark)" p={3} borderRadius="lg" borderWidth="1px" borderStyle="dashed">
          <Text fontSize="xs" color="var(--text-secondary)">
            <strong>Note:</strong> Uses localStorage for prototyping.
          </Text>
        </Box>
      </VStack>
      </Box>
    </Box>
  );
};

export default SettingsPage;
