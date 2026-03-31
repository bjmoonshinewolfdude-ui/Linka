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
  Card,
  CardBody,
  CardHeader,
  Icon,
  Flex,
  Stack,
  keyframes,
} from "@chakra-ui/react";
import { ArrowBackIcon, SettingsIcon, LockIcon, LogOutIcon } from "@chakra-ui/icons";
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
    <Box bg="var(--dark-bg)" minH="100vh" py={8} px={{ base: 4, md: 8, lg: 12 }}>
      <VStack spacing={8} align="stretch" maxW="700px" mx="auto">
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <HStack spacing={4}>
            <Icon as={SettingsIcon} boxSize={8} color="var(--acid-yellow)" />
            <Heading color="var(--acid-yellow)" size="xl">
              Settings & Profile
            </Heading>
          </HStack>
          <Button
            leftIcon={<ArrowBackIcon />}
            onClick={() => history.push("/chats")}
            bg="var(--surface-dark)"
            color="var(--text-primary)"
            borderWidth="1px"
            borderColor="var(--border-color)"
            px={6}
            py={5}
            _hover={{ 
              bg: "var(--surface-medium)",
              borderColor: "var(--accent-cyan)"
            }}
          >
            Back to Chats
          </Button>
        </Flex>

        {/* Profile Section */}
        <Card bg="var(--surface-dark)" borderWidth="1px" borderColor="var(--border-color)" borderRadius="xl" overflow="hidden">
          <CardHeader 
            bg="var(--surface-medium)" 
            borderBottomWidth="1px" 
            borderColor="var(--border-color)" 
            py={6} 
            px={8}
          >
            <HStack spacing={3}>
              <Avatar
                size="lg"
                src={user?.pic}
                name={user?.name}
                border="3px solid var(--accent-cyan)"
              />
              <VStack align="start" spacing={1}>
                <Heading size="md" color="var(--text-primary)">{user?.name}</Heading>
                <Text color="var(--text-secondary)" fontSize="sm">{user?.email}</Text>
              </VStack>
            </HStack>
          </CardHeader>
          <CardBody p={8}>
            <Stack direction={{ base: "column", md: "row" }} spacing={8} align="center" justify="center">
              <VStack spacing={4} align="center">
                <Avatar
                  size="2xl"
                  src={user?.pic}
                  name={user?.name}
                  border="4px solid var(--accent-cyan)"
                  boxShadow="0 0 20px rgba(0, 255, 255, 0.2)"
                />
                <Badge
                  px={4}
                  py={1}
                  borderRadius="full"
                  fontSize="0.9em"
                  bg={user?.role === "admin" ? "var(--accent-pink)" : "var(--accent-cyan)"}
                  color="var(--dark-bg)"
                  fontWeight="bold"
                >
                  {user?.role === "admin" ? "ADMINISTRATOR" : "STANDARD USER"}
                </Badge>
              </VStack>
              
              <VStack align="start" spacing={3} flex={1} w="full">
                <HStack justify="space-between" w="full" py={2} borderBottom="1px solid" borderColor="var(--border-color)">
                  <Text color="var(--text-secondary)">Full Name</Text>
                  <Text color="var(--text-primary)" fontWeight="medium">{user?.name}</Text>
                </HStack>
                <HStack justify="space-between" w="full" py={2} borderBottom="1px solid" borderColor="var(--border-color)">
                  <Text color="var(--text-secondary)">Email Address</Text>
                  <Text color="var(--text-primary)" fontWeight="medium">{user?.email}</Text>
                </HStack>
                <HStack justify="space-between" w="full" py={2} borderBottom="1px solid" borderColor="var(--border-color)">
                  <Text color="var(--text-secondary)">Account Role</Text>
                  <Badge 
                    bg={user?.role === "admin" ? "var(--accent-pink)" : "var(--accent-cyan)"}
                    color="var(--dark-bg)"
                  >
                    {user?.role}
                  </Badge>
                </HStack>
                <HStack justify="space-between" w="full" py={2}>
                  <Text color="var(--text-secondary)">Member Since</Text>
                  <Text color="var(--text-primary)" fontWeight="medium">
                    {new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Text>
                </HStack>
              </VStack>
            </Stack>
          </CardBody>
        </Card>

        {/* Change Password Section */}
        <Card bg="var(--surface-dark)" borderWidth="1px" borderColor="var(--border-color)" borderRadius="xl" overflow="hidden">
          <CardHeader bg="var(--surface-medium)" borderBottomWidth="1px" borderColor="var(--border-color)" py={5} px={8}>
            <HStack spacing={3}>
              <Icon as={LockIcon} color="var(--accent-cyan)" />
              <Heading size="md" color="var(--accent-cyan)">
                Change Password
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody p={8}>
            <Alert status="info" mb={6} bg="var(--surface-medium)" borderRadius="lg" borderLeft="4px solid" borderLeftColor="var(--accent-cyan)">
              <AlertIcon color="var(--accent-cyan)" />
              <Text fontSize="sm" lineHeight="1.6">
                <strong>Password Requirements:</strong><br />
                • Minimum 8 characters<br />
                • At least one uppercase letter (A-Z)<br />
                • At least one lowercase letter (a-z)<br />
                • At least one number (0-9)<br />
                • At least one special character (!@#$%^&*)
              </Text>
            </Alert>

            <VStack spacing={5}>
              <FormControl>
                <FormLabel fontWeight="medium" color="var(--text-secondary)">Current Password</FormLabel>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  bg="var(--dark-bg)"
                  borderColor="var(--border-color)"
                  color="var(--text-primary)"
                  size="lg"
                  py={6}
                  _hover={{ borderColor: "var(--medium-grey)" }}
                  _focus={{ borderColor: "var(--accent-cyan)", boxShadow: "0 0 0 2px rgba(0, 255, 255, 0.2)" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="medium" color="var(--text-secondary)">New Password</FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  bg="var(--dark-bg)"
                  borderColor="var(--border-color)"
                  color="var(--text-primary)"
                  size="lg"
                  py={6}
                  _hover={{ borderColor: "var(--medium-grey)" }}
                  _focus={{ borderColor: "var(--accent-cyan)", boxShadow: "0 0 0 2px rgba(0, 255, 255, 0.2)" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="medium" color="var(--text-secondary)">Confirm New Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  bg="var(--dark-bg)"
                  borderColor="var(--border-color)"
                  color="var(--text-primary)"
                  size="lg"
                  py={6}
                  _hover={{ borderColor: "var(--medium-grey)" }}
                  _focus={{ borderColor: "var(--accent-cyan)", boxShadow: "0 0 0 2px rgba(0, 255, 255, 0.2)" }}
                />
              </FormControl>

              <Button
                onClick={handlePasswordChange}
                bg="var(--accent-cyan)"
                color="var(--dark-bg)"
                width="100%"
                size="lg"
                py={6}
                fontWeight="bold"
                _hover={{ bg: "var(--acid-yellow)", transform: "translateY(-2px)" }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
              >
                Update Password
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Session Management */}
        <Card bg="var(--surface-dark)" borderWidth="1px" borderColor="var(--border-color)" borderRadius="xl" overflow="hidden">
          <CardHeader bg="var(--surface-medium)" borderBottomWidth="1px" borderColor="var(--border-color)" py={5} px={8}>
            <HStack spacing={3}>
              <Icon as={LogOutIcon} color="var(--accent-pink)" />
              <Heading size="md" color="var(--accent-pink)">
                Session Management
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody p={8}>
            <Text mb={4} color="var(--text-secondary)">
              Logging out will end your current session and clear your authentication token. You will need to log in again to access your account.
            </Text>
            <Button
              onClick={handleLogout}
              bg="var(--accent-pink)"
              color="var(--dark-bg)"
              width="100%"
              size="lg"
              py={6}
              fontWeight="bold"
              _hover={{ bg: "red.400", transform: "translateY(-2px)" }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
            >
              Logout
            </Button>
          </CardBody>
        </Card>

        {/* Data Storage Notice */}
        <Card bg="var(--surface-dark)" borderWidth="1px" borderColor="var(--border-color)" borderStyle="dashed" borderRadius="xl">
          <CardBody p={6}>
            <Text fontSize="sm" color="var(--text-secondary)" lineHeight="1.6">
              <strong style={{ color: "var(--accent-cyan)" }}>Data Storage Notice:</strong> This application uses localStorage for prototype data persistence. In a production environment, all data would be stored securely on server-side databases with proper encryption and access controls.
            </Text>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default SettingsPage;
