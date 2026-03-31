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
  Flex,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const SettingsPage = () => {
  const { user, setUser } = ChatState();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newName, setNewName] = useState(user?.name || "");
  const [newPic, setNewPic] = useState(user?.pic || "");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  // Password validation rules
  const passwordRequirements = [
    { label: "8+ characters", test: (p) => p.length >= 8 },
    { label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
    { label: "Number", test: (p) => /\d/.test(p) },
    { label: "Special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  const isPasswordValid = passwordRequirements.every((req) => req.test(newPassword));

  const handlePasswordChange = () => {
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
    if (!isPasswordValid) {
      toast({
        title: "Invalid Password",
        description: "Password does not meet all requirements",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: "Password Updated",
      description: "This is a demo. In production, this would update your password securely.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    logAuditAction("PASSWORD_CHANGE", user.name, "User changed password");
  };

  const handleProfileUpdate = () => {
    const updatedUser = { ...user, name: newName, pic: newPic };
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast({
      title: "Profile Updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    logAuditAction("PROFILE_UPDATE", user.name, "User updated profile");
  };

  const postDetails = (pics) => {
    if (!pics) return;
    setLoading(true);
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "LINKER");
    data.append("cloud_name", "dmrdwv8d0");
    axios
      .post("https://api.cloudinary.com/v1_1/dmrdwv8d0/image/upload", data)
      .then((response) => {
        setNewPic(response.data.url.toString());
        setLoading(false);
        toast({
          title: "Image uploaded successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      })
      .catch((error) => {
        console.log("Cloudinary error:", error);
        setLoading(false);
      });
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
      w="100%"
    >
      <Box
        maxW="450px"
        mx="auto"
        maxH="calc(100vh - 32px)"
        overflowY="auto"
        mt={4}
        mb={4}
        css={{
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { background: 'var(--surface-dark)' },
          '&::-webkit-scrollbar-thumb': { background: 'var(--surface-medium)', borderRadius: '4px' },
        }}
      >
        <VStack spacing={6} align="center" textAlign="center" w="100%" py={6} px={4}>
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={2} w="100%">
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
        <Box bg="var(--surface-dark)" p={4} borderRadius="lg" borderWidth="1px" w="100%">
          <VStack spacing={3} align="center">
            <Avatar
              size="lg"
              src={newPic || user?.pic}
              name={newName || user?.name}
              border="3px solid var(--accent-cyan)"
            />
            <FormControl>
              <FormLabel fontSize="sm">Profile Picture URL</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
                bg="var(--dark-bg)"
                borderColor="var(--border-color)"
                color="var(--text-primary)"
                size="sm"
                p={1}
                _focus={{ borderColor: "var(--accent-cyan)" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Name</FormLabel>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={user?.name}
                bg="var(--dark-bg)"
                borderColor="var(--border-color)"
                color="var(--text-primary)"
                size="sm"
                _focus={{ borderColor: "var(--accent-cyan)" }}
              />
            </FormControl>
            <Button
              onClick={handleProfileUpdate}
              bg="var(--accent-cyan)"
              color="var(--dark-bg)"
              width="100%"
              _hover={{ bg: "var(--acid-yellow)" }}
              size="sm"
              isLoading={loading}
            >
              Update Profile
            </Button>
            <Box textAlign="center">
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
        <Box bg="var(--surface-dark)" p={4} borderRadius="lg" borderWidth="1px" w="100%">
          <Heading size="sm" mb={3} color="var(--accent-cyan)">
            Change Password
          </Heading>

          <VStack spacing={3}>
            <FormControl>
              <FormLabel fontSize="sm">Current Password</FormLabel>
              <InputGroup>
                <Input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  bg="var(--dark-bg)"
                  borderColor="var(--border-color)"
                  color="var(--text-primary)"
                  size="sm"
                  _focus={{ borderColor: "var(--accent-cyan)" }}
                />
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="xs" 
                    onClick={() => setShowCurrent(!showCurrent)}
                    bg="transparent"
                    color="var(--text-secondary)"
                    _hover={{ color: "var(--accent-cyan)" }}
                  >
                    {showCurrent ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">New Password</FormLabel>
              <InputGroup>
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  bg="var(--dark-bg)"
                  borderColor="var(--border-color)"
                  color="var(--text-primary)"
                  size="sm"
                  _focus={{ borderColor: "var(--accent-cyan)" }}
                />
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="xs" 
                    onClick={() => setShowNew(!showNew)}
                    bg="transparent"
                    color="var(--text-secondary)"
                    _hover={{ color: "var(--accent-cyan)" }}
                  >
                    {showNew ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {newPassword.length > 0 && (
                <Box mt={2} p={2} bg="var(--dark-bg)" borderRadius="md" borderWidth="1px" borderColor="var(--border-color)">
                  <Text fontSize="sm" color="var(--text-secondary)" mb={1}>
                    Password must have:
                  </Text>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    {passwordRequirements.map((req) => (
                      <Text
                        key={req.label}
                        fontSize="xs"
                        color={req.test(newPassword) ? "var(--accent-cyan)" : "var(--text-muted)"}
                        fontWeight={req.test(newPassword) ? "bold" : "normal"}
                      >
                        {req.test(newPassword) ? "✓" : "○"} {req.label}
                      </Text>
                    ))}
                  </Box>
                </Box>
              )}
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Confirm New Password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  bg="var(--dark-bg)"
                  borderColor="var(--border-color)"
                  color="var(--text-primary)"
                  size="sm"
                  _focus={{ borderColor: "var(--accent-cyan)" }}
                />
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="xs" 
                    onClick={() => setShowConfirm(!showConfirm)}
                    bg="transparent"
                    color="var(--text-secondary)"
                    _hover={{ color: "var(--accent-cyan)" }}
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
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
        <Box bg="var(--surface-dark)" p={4} borderRadius="lg" borderWidth="1px" w="100%">
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
        <Box bg="var(--surface-dark)" p={3} borderRadius="lg" borderWidth="1px" borderStyle="dashed" w="100%">
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
