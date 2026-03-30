import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { use, useState } from "react";
import SideDrawer from "../components/Miscellaneous/SideDrawer";
import MyChats from "../components/Miscellaneous/MyChats";
import Chatbox from "../components/Miscellaneous/Chatbox";

const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%", background: "var(--dark-bg)", minHeight: "100vh" }}>
      {user && <SideDrawer />}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h={"91.5vh"}
        p={"10px"}
        pb={"20px"}
        bg="var(--dark-bg)"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
