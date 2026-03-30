import {
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
  Input,
} from "@chakra-ui/react";
import React from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [show, setShow] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const history = useHistory();
  const { setUser } = ChatState();

  const handleClick = () => setShow(!show);
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config,
      );
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      setUser(data);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Invalid credentials",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <div className="auth-scroll-container hide-scrollbar">
      <VStack spacing="15px" color="var(--text-primary)">
        <FormControl id="email" isRequired>
        <FormLabel color="var(--text-primary)" fontWeight="600">
          Email
        </FormLabel>
        <InputGroup>
          <Input
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            variant="filled"
            bg="var(--surface-dark)"
            border="1px solid var(--border-color)"
            color="var(--text-primary)"
            _focus={{
              borderColor: "var(--accent-cyan)",
              boxShadow: "0 0 0 1px var(--accent-cyan)",
            }}
            _hover={{
              borderColor: "var(--medium-grey)",
            }}
          />
        </InputGroup>
      </FormControl>
      
      <FormControl id="password" isRequired>
        <FormLabel color="var(--text-primary)" fontWeight="600">
          Password
        </FormLabel>
        <InputGroup>
          <Input
            value={password}
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            variant="filled"
            bg="var(--surface-dark)"
            border="1px solid var(--border-color)"
            color="var(--text-primary)"
            _focus={{
              borderColor: "var(--accent-cyan)",
              boxShadow: "0 0 0 1px var(--accent-cyan)",
            }}
            _hover={{
              borderColor: "var(--medium-grey)",
            }}
          />
          <InputRightElement width="4.5rem">
            <Button 
              h="1.75rem" 
              size="sm" 
              onClick={handleClick}
              className="btn-secondary"
              variant="ghost"
              color="var(--text-secondary)"
              _hover={{
                color: "var(--accent-cyan)",
                bg: "var(--surface-medium)",
              }}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      
      <Button
        className="btn-primary"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
        loadingText="Signing in..."
      >
        Log in
      </Button>
      
      <Button
        className="btn-secondary"
        width="100%"
        onClick={() => {
          setEmail("test@test.com");
          setPassword("test");
        }}
        _hover={{
          borderColor: "var(--accent-pink)",
          color: "var(--accent-pink)",
        }}
      >
        Get Guest User Credentials
      </Button>
      </VStack>
    </div>
  );
};

export default Login;
