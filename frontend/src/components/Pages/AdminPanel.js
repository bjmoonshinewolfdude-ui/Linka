import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Heading,
  useToast,
  Badge,
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auditLog, setAuditLog] = useState([]);
  const { user } = ChatState();
  const toast = useToast();
  const history = useHistory();

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      history.push("/access-denied");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, history]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchUsers();
      loadAuditLog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/user", config);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching users",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const loadAuditLog = () => {
    const logs = JSON.parse(localStorage.getItem("auditLog") || "[]");
    setAuditLog(logs.slice(-20).reverse()); // Show last 20 entries
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={6} bg="var(--dark-bg)" minH="100vh" color="var(--text-primary)">
      <VStack spacing={6} align="stretch" maxW="1200px" mx="auto">
        <HStack justify="space-between">
          <Heading color="var(--acid-yellow)">Admin Panel</Heading>
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

        {/* User List Section */}
        <Box bg="var(--surface-dark)" p={6} borderRadius="lg" borderWidth="1px">
          <Heading size="md" mb={4} color="var(--accent-cyan)">
            User List ({users.length} users)
          </Heading>
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th color="var(--text-secondary)">Name</Th>
                  <Th color="var(--text-secondary)">Email</Th>
                  <Th color="var(--text-secondary)">Role</Th>
                  <Th color="var(--text-secondary)">Joined</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((u) => (
                  <Tr key={u._id}>
                    <Td>{u.name}</Td>
                    <Td>{u.email}</Td>
                    <Td>
                      <Badge
                        colorScheme={u.role === "admin" ? "red" : "green"}
                        bg={u.role === "admin" ? "var(--accent-pink)" : "var(--accent-cyan)"}
                        color="var(--dark-bg)"
                      >
                        {u.role}
                      </Badge>
                    </Td>
                    <Td>{new Date(u.createdAt).toLocaleDateString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>

        {/* Audit Log Section */}
        <Box bg="var(--surface-dark)" p={6} borderRadius="lg" borderWidth="1px">
          <Heading size="md" mb={4} color="var(--accent-cyan)">
            Audit Log (Last 20 Actions)
          </Heading>
          {auditLog.length === 0 ? (
            <Text color="var(--text-secondary)">No audit logs available</Text>
          ) : (
            <VStack align="stretch" spacing={2} maxH="400px" overflowY="auto">
              {auditLog.map((log, index) => (
                <Box
                  key={index}
                  p={3}
                  bg="var(--surface-medium)"
                  borderRadius="md"
                  fontSize="sm"
                >
                  <HStack justify="space-between">
                    <Text>
                      <Badge size="sm" mr={2} bg="var(--acid-yellow)" color="var(--dark-bg)">
                        {log.action}
                      </Badge>
                      {log.user} - {log.details}
                    </Text>
                    <Text fontSize="xs" color="var(--text-secondary)">
                      {formatDate(log.timestamp)}
                    </Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Box>

        {/* Security Note */}
        <Box bg="var(--surface-dark)" p={4} borderRadius="lg" borderWidth="1px">
          <Text fontSize="sm" color="var(--text-secondary)">
            <strong>Security Note:</strong> This admin panel is for demonstration purposes.
            In a production environment, admin actions would be logged to a secure server-side database.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default AdminPanel;
