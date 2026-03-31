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
  Badge,
  VStack,
  HStack,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Flex,
  Avatar,
} from "@chakra-ui/react";
import { ArrowBackIcon, LockIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auditLog, setAuditLog] = useState([]);
  const { user } = ChatState();
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
      console.error("Error fetching users:", error);
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
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh" bg="var(--dark-bg)">
        <Spinner size="xl" color="var(--accent-cyan)" thickness="4px" />
      </Box>
    );
  }

  return (
    <Box bg="var(--dark-bg)" minH="100vh" py={8} px={{ base: 4, md: 8, lg: 12 }}>
      <VStack spacing={8} align="stretch" maxW="1200px" mx="auto">
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <HStack spacing={4}>
            <Icon as={LockIcon} boxSize={8} color="var(--acid-yellow)" />
            <Heading color="var(--acid-yellow)" size="xl">
              Admin Panel
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

        {/* Welcome Banner */}
        <Card bg="var(--surface-dark)" borderWidth="1px" borderColor="var(--border-color)" borderRadius="lg">
          <CardBody p={6}>
            <HStack spacing={4}>
              <Avatar size="md" src={user?.pic} name={user?.name} />
              <VStack align="start" spacing={1}>
                <Text fontSize="lg" fontWeight="bold" color="var(--text-primary)">
                  Welcome, {user?.name}
                </Text>
                <Text fontSize="sm" color="var(--text-secondary)">
                  Administrator Access Granted
                </Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* User List Section */}
        <Card bg="var(--surface-dark)" borderWidth="1px" borderColor="var(--border-color)" borderRadius="lg" overflow="hidden">
          <CardHeader bg="var(--surface-medium)" borderBottomWidth="1px" borderColor="var(--border-color)" py={4} px={6}>
            <Heading size="md" color="var(--accent-cyan)">
              User Management ({users.length} users)
            </Heading>
          </CardHeader>
          <CardBody p={0}>
            <Box overflowX="auto">
              <Table variant="simple" size="md">
                <Thead bg="var(--surface-medium)">
                  <Tr>
                    <Th color="var(--text-secondary)" py={4}>Name</Th>
                    <Th color="var(--text-secondary)" py={4}>Email</Th>
                    <Th color="var(--text-secondary)" py={4}>Role</Th>
                    <Th color="var(--text-secondary)" py={4}>Joined</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((u, index) => (
                    <Tr 
                      key={u._id}
                      bg={index % 2 === 0 ? "var(--surface-dark)" : "var(--surface-medium)"}
                      _hover={{ bg: "var(--medium-grey)" }}
                      transition="background 0.2s"
                    >
                      <Td py={4}>
                        <HStack spacing={3}>
                          <Avatar size="sm" src={u.pic} name={u.name} />
                          <Text fontWeight="medium">{u.name}</Text>
                        </HStack>
                      </Td>
                      <Td py={4} color="var(--text-secondary)">{u.email}</Td>
                      <Td py={4}>
                        <Badge
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontSize="0.75em"
                          bg={u.role === "admin" ? "var(--accent-pink)" : "var(--accent-cyan)"}
                          color="var(--dark-bg)"
                          fontWeight="bold"
                        >
                          {u.role === "admin" ? "ADMIN" : "USER"}
                        </Badge>
                      </Td>
                      <Td py={4} color="var(--text-secondary)">
                        {new Date(u.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>

        {/* Audit Log Section */}
        <Card bg="var(--surface-dark)" borderWidth="1px" borderColor="var(--border-color)" borderRadius="lg" overflow="hidden">
          <CardHeader bg="var(--surface-medium)" borderBottomWidth="1px" borderColor="var(--border-color)" py={4} px={6}>
            <Heading size="md" color="var(--accent-cyan)">
              Audit Log (Last 20 Actions)
            </Heading>
          </CardHeader>
          <CardBody p={6}>
            {auditLog.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color="var(--text-secondary)">No audit logs available</Text>
              </Box>
            ) : (
              <VStack align="stretch" spacing={3} maxH="400px" overflowY="auto" pr={2}>
                {auditLog.map((log, index) => (
                  <Box
                    key={index}
                    p={4}
                    bg="var(--surface-medium)"
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderLeftColor={
                      log.action.includes("LOGIN") ? "var(--accent-cyan)" :
                      log.action.includes("MESSAGE") ? "var(--acid-yellow)" :
                      log.action.includes("PASSWORD") ? "var(--accent-pink)" :
                      "var(--medium-grey)"
                    }
                    _hover={{ bg: "var(--dark-bg)" }}
                    transition="all 0.2s"
                  >
                    <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                      <HStack spacing={3}>
                        <Badge 
                          size="sm" 
                          bg={
                            log.action.includes("LOGIN") ? "var(--accent-cyan)" :
                            log.action.includes("MESSAGE") ? "var(--acid-yellow)" :
                            log.action.includes("PASSWORD") ? "var(--accent-pink)" :
                            "var(--medium-grey)"
                          }
                          color="var(--dark-bg)"
                          px={2}
                          py={1}
                        >
                          {log.action}
                        </Badge>
                        <Text color="var(--text-primary)" fontWeight="medium">
                          {log.user}
                        </Text>
                        <Text color="var(--text-secondary)" fontSize="sm">
                          {log.details}
                        </Text>
                      </HStack>
                      <Text fontSize="xs" color="var(--text-muted)" whiteSpace="nowrap">
                        {formatDate(log.timestamp)}
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            )}
          </CardBody>
        </Card>

        {/* Security Note */}
        <Card bg="var(--surface-dark)" borderWidth="1px" borderColor="var(--border-color)" borderStyle="dashed" borderRadius="lg">
          <CardBody p={6}>
            <Text fontSize="sm" color="var(--text-secondary)">
              <strong style={{ color: "var(--accent-cyan)" }}>Security Note:</strong> This admin panel is for demonstration purposes. In a production environment, admin actions would be logged to a secure server-side database with proper access controls and encryption.
            </Text>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default AdminPanel;
