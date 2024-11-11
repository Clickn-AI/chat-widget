import React, { useState, useEffect } from "react";
import {
  Widget,
  toggleWidget,
  deleteMessages,
  renderCustomComponent,
  addResponseMessage,
} from "react-chat-widget";
import ChatNotification from "./ChatNotification";
import "react-chat-widget/lib/styles.css";
import "./ChatWidget.css";
import { useWebSocket } from "./useWebSocket";
import { ThreeDots } from "react-loader-spinner";
function LoadingAvatar() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      <img
        src="/Logo.png"
        alt="Loading Avatar"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          alignSelf: "flex-end",
        }}
      />
      <ThreeDots width="20" height="20" color="#5556BB" />
    </div>
  );
}
function App() {
  const [showChatNotification, setShowChatNotification] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(""); // To handle streaming text
  const { messages, sendMessage, openConnection } = useWebSocket("wss://api-stg.hams.ai/chat");
  // Function to simulate the auto-typing effect
  const typeMessage = (message) => {
    let i = 0;
    setCurrentMessage("");
    const interval = setInterval(() => {
      setCurrentMessage((prev) => prev + message[i]);
      i += 1;
      if (i === message.length) {
        clearInterval(interval); // Clear the interval when the message is fully typed
        setLoading(false); // Stop loading when typing completes
      }
    }, 50); // Adjust the speed here (50 ms per character)
  };
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage && !latestMessage.isUserMessage) {
      if (loading) {
        // deleteMessages(1);
        setLoading(false);
      }
      typeMessage(latestMessage.text);
    }
  }, [messages]);
  // Render each typed character as it updates in currentMessage
  useEffect(() => {
    if (currentMessage) {
      deleteMessages(1);
      addResponseMessage(currentMessage);
    }
  }, [currentMessage]);
  useEffect(() => {
    setShowChatNotification(true);
  }, []);
  const handleNewUserMessage = (message) => {
    console.log(`New message incoming! ${message}`);
    sendMessage(message);
    setLoading(true);
    renderCustomComponent(LoadingAvatar); // Show loading avatar
  };
  const openChat = () => {
    openConnection();
    setIsChatOpen(true);
    setShowChatNotification(false);
    toggleWidget();
  };
  const closeChat = () => {
    setIsChatOpen(false);
    setShowChatNotification(false);
    toggleWidget();
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Chat Application</h1>
      </header>
      {!isChatOpen && (
        <>
          {showChatNotification && <ChatNotification onClick={openChat} />}
          <button
            onClick={openChat}
            className="custom-chat-launcher"
            style={{ width: "60px", height: "60px" }}
          >
            <img
              src="/Logo.png"
              alt="Chat Icon"
              style={{ width: "40px", height: "40px" }}
            />
            <div className="notification-dot"></div>
          </button>
        </>
      )}
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title={
          <div className=" text-header-chat">
            <div>مرحبًا</div>
            <p>مساعد أكسبرو الذكي باستخدام الذكاء التوليدي</p>
            <span className=" text-connect">
            <div class="circle-dot"></div>
              نحن نرد في الحال
              </span>
            <div className="chat-header">
              <button className="close-chat-button" onClick={closeChat}>
                ✕
              </button>
            </div>
          </div>
        }
        subtitle=""
        profileAvatar="/Logo.png"
        // profileClientAvatar="/user.svg"
        emojis={true}
        launcher={() => null}
        senderPlaceHolder="اكتب رسالتك هنا..."
      />
    </div>
  );
}
export default App;