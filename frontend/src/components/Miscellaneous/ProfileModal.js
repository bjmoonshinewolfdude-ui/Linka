import React from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { IconButton } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton 
          d={{ base: "flex" }} 
          icon={<ViewIcon />} 
          onClick={onOpen}
          className="btn-secondary"
          variant="ghost"
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered>
        <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
        <ModalContent 
          h={"410px"}
          bg="var(--surface-dark)"
          border="1px solid var(--border-color)"
          color="var(--text-primary)"
          zIndex={1400}
        >
          <ModalHeader
            fontSize={"40px"}
            fontFamily={"Work Sans"}
            display={"flex"}
            justifyContent={"center"}
            color="var(--acid-yellow)"
            borderBottom="1px solid var(--border-color)"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton 
            color="var(--text-secondary)"
            _hover={{ color: "var(--accent-pink)" }}
          />
          <ModalBody
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Image
              borderRadius={"full"}
              boxSize={"150px"}
              src={user.pic}
              alt={user.name}
              border="3px solid var(--accent-cyan)"
            />
            <Text 
              fontSize={"20px"} 
              fontFamily={"Work Sans"}
              color="var(--text-primary)"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter borderTop="1px solid var(--border-color)">
            <Button 
              className="btn-primary"
              mr={3} 
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
