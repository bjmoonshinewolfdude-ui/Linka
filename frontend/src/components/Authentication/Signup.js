import {
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
  Text,
  Input,
} from "@chakra-ui/react";
import React from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Signup = () => {
  const [show, setShow] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [pic, setPic] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const history = useHistory();
  const { setUser } = ChatState();

  const handleClick = () => setShow(!show);
  const postDetails = (pics) => {
    if (!pics) return; // No image selected, use default

    if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
      toast({
        title: "Please Select a JPEG or PNG Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "LINKER");
    data.append("cloud_name", "dmrdwv8d0");
    axios
      .post("https://api.cloudinary.com/v1_1/dmrdwv8d0/image/upload", data)
      .then((response) => {
        console.log("Cloudinary response:", response);
        setPic(response.data.url.toString());
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
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config,
      );
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "An error occurred while signing up.",
        description: error.response?.data?.message || "Registration failed",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <div className="auth-scroll-container hide-scrollbar">
      <VStack spacing="15px" color="var(--text-primary)">
        <FormControl id="first-name" isRequired>
        <FormLabel color="var(--text-primary)" fontWeight="600">
          Username
        </FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter your username"
            maxLength={30}
            onChange={(e) => setName(e.target.value)}
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
          <Text fontSize="xs" color="var(--text-secondary)" mt={1}>
            {" "}
            {name.length}/30{" "}
          </Text>
        </InputGroup>
      </FormControl>
      
      <FormControl id="email" isRequired>
        <FormLabel color="var(--text-primary)" fontWeight="600">
          Email
        </FormLabel>
        <InputGroup>
          <Input
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
      
      <FormControl id="confirm-password" isRequired>
        <FormLabel color="var(--text-primary)" fontWeight="600">
          Confirm Password
        </FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
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
      
      <FormControl id="pic">
        <FormLabel color="var(--text-primary)" fontWeight="600">
          Upload your Picture (Optional)
        </FormLabel>
        <InputGroup>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
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
      
      <Button
        className="btn-primary"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
        loadingText="Signing up..."
      >
        Sign Up
      </Button>
      </VStack>
    </div>
  );
};

export default Signup;
