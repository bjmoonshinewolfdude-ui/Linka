import {
  Box,
  Container,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import React from "react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/Signup";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <Container maxW={"xl"} centerContent className="App">
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="var(--surface-dark)"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="var(--border-color)"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.3)"
      >
        <Text
          fontSize="2xl"
          fontFamily="Open Sans"
          fontWeight="bold"
          color="var(--acid-yellow)"
          textShadow="0 0 10px rgba(255, 215, 0, 0.5)"
        >
          Linker
        </Text>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        p={4}
        bg="var(--surface-dark)"
        w="100%"
        mb="40px"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="var(--border-color)"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.3)"
        maxH="70vh"
        overflow="auto"
        className="hide-scrollbar"
      >
        <Tabs variant="soft-rounded" colorScheme="yellow" w="100%">
          <TabList mb={"1em"} bg="var(--surface-medium)" borderRadius="md" p={1}>
            <Tab 
              width={"50%"} 
              _selected={{ 
                bg: "var(--acid-yellow)", 
                color: "var(--dark-bg)",
                fontWeight: "bold"
              }}
              color="var(--text-secondary)"
              _hover={{ color: "var(--text-primary)" }}
            >
              Login
            </Tab>
            <Tab 
              width={"50%"} 
              _selected={{ 
                bg: "var(--acid-yellow)", 
                color: "var(--dark-bg)",
                fontWeight: "bold"
              }}
              color="var(--text-secondary)"
              _hover={{ color: "var(--text-primary)" }}
            >
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
