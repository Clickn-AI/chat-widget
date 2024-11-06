import React, { useState, useEffect } from 'react';
import { Widget, addResponseMessage, toggleWidget, deleteMessages } from 'react-chat-widget';
import ChatNotification from './ChatNotification';
import 'react-chat-widget/lib/styles.css';
import './ChatWidget.css';
import { useWebSocket } from './useWebSocket';

// Loader component to show a spinner while waiting for the response
// const Loader = () => (
//   <div className="loader-message">
//     <img src="/loading.gif" alt="Loading..." style={{ width: '24px', height: '24px' }} />
//   </div>
// );


function App() {
  const [showChatNotification, setShowChatNotification] = useState(false); 
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { messages, sendMessage } = useWebSocket('wss://api-stg.hams.ai/chat');

  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage && !latestMessage.isUserMessage) {
      if (loading) {
        deleteMessages(1); 
        setLoading(false);
      }
      addResponseMessage(latestMessage.text); 
    }
 
  }, [messages]);

  useEffect(() => {
    setShowChatNotification(true);
  }, []);

  const handleNewUserMessage = (message) => {
    console.log(`New message incoming! ${message}`);
    sendMessage(message);
    setLoading(true);
    addResponseMessage("Loading...");
  };

  const openChat = () => {
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
      {/* Conditionally render the notification */}
      {/* {showNotification && <ChatNotification onClick={openChat}/>} */}
      {!isChatOpen && (
        <>
          {showChatNotification && <ChatNotification onClick={openChat} />}
          {/* Custom button below the notification */}
          <button onClick={openChat} className="custom-chat-launcher">
            <img src="/Logo.png" alt="Chat Icon" style={{ width: '30px', height: '30px'}} />
            <div className="notification-dot"></div>
          </button>
        </>
      )}
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title={
          <div className="chat-header">
            <button className="close-chat-button" onClick={closeChat}>✕</button>
          </div>
        }
        // title="مرحبا بكم"  
        subtitle=" مساعد أكسبرو الذكي باستخدام الذكاء التوليدي"   
        profileAvatar="/Logo.png"
        profileClientAvatar="/user.svg"
        emojis={true}
        launcher={() => null}
        // showChatIcon={loading ? <img src="/loading.gif" alt="loading" /> : null}
      />
      {/* {loading && (<Loader />)}  */}
    </div>
  );
}

export default App;
