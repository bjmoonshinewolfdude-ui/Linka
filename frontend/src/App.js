import { Route } from "react-router-dom/cjs/react-router-dom.min";
import "./App.css";
import { HStack } from "@chakra-ui/react";
import { useEffect } from "react";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";

function App() {
  useEffect(() => {
    // Add escape key listener to close any open modals
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        // Find and close any open modals by clicking their close buttons
        const closeButtons = document.querySelectorAll('[aria-label="Close"]');
        closeButtons.forEach(button => {
          if (button.offsetParent !== null) { // Only click visible close buttons
            button.click();
          }
        });
        
        // Also try to close any open menus
        const menuButtons = document.querySelectorAll('[aria-expanded="true"]');
        menuButtons.forEach(button => {
          button.click();
        });
      }
    };

    // Add double-click escape as emergency reset
    const handleDoubleClick = (e) => {
      if (e.key === 'Escape') {
        // Force close all modals by removing their DOM elements
        const modals = document.querySelectorAll('.chakra-modal__content');
        const overlays = document.querySelectorAll('.chakra-modal__overlay');
        modals.forEach(modal => modal.remove());
        overlays.forEach(overlay => overlay.remove());
        
        // Force reload if stuck
        window.location.reload();
      }
    };

    let escapeCount = 0;
    let escapeTimeout;
    
    const handleSingleEscape = (e) => {
      if (e.key === 'Escape') {
        escapeCount++;
        if (escapeCount === 1) {
          handleEscapeKey(e);
          escapeTimeout = setTimeout(() => {
            escapeCount = 0;
          }, 500);
        } else if (escapeCount === 2) {
          clearTimeout(escapeTimeout);
          handleDoubleClick(e);
        }
      }
    };

    document.addEventListener('keydown', handleSingleEscape);
    return () => {
      document.removeEventListener('keydown', handleSingleEscape);
    };
  }, []);

  return (
    <div className="App">
      <HStack>
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={Chatpage} />
      </HStack>
    </div>
  );
}

export default App;
