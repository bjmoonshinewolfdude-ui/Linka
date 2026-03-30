import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="var(--surface-dark)"
      border="1px solid var(--border-color)"
      _hover={{ 
        background: "var(--surface-medium)", 
        color: "var(--accent-cyan)",
        borderColor: "var(--accent-cyan)",
        transform: "translateX(2px)"
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="var(--text-primary)"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
      transition="all 0.2s ease"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
        border="2px solid var(--border-color)"
      />
      <Box>
        <Text fontWeight="500">{user.name}</Text>
        <Text fontSize="xs" color="var(--text-secondary)">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
