import React, { useState, useEffect } from 'react';
import { Widget, addResponseMessage, toggleWidget } from 'react-chat-widget';
import ChatNotification from './ChatNotification';
import 'react-chat-widget/lib/styles.css';
import './ChatWidget.css';
import { useWebSocket } from './useWebSocket';

function App() {
  const [showNotification, setShowNotification] = useState(true); 
  // const { messages, sendMessage, status } = useWebSocket('ws://localhost:3000/chat');

  // Send a welcome message once the component mounts
  useEffect(() => {
    addResponseMessage("مرحبا! كيف يمكنني مساعدتك؟");
  }, []);

  // useEffect(() => {
  //   messages.forEach((message) => {
  //     if (!message.isUserMessage) {
  //       addResponseMessage(message.text); 
  //     }
  //   });
  // }, [messages]);

  const handleNewUserMessage = (message) => {
    console.log(`New message incoming! ${message}`);
    // sendMessage(message);
    // addResponseMessage('...'); 
    addResponseMessage('رسالتك قد تم استلامها وسيتم الرد عليك في اقرب وقت ممكن');
  };

  const openChat = () => {
    setShowNotification(false);
    toggleWidget(); 
  };

  const closeChat = () => {
    setShowNotification(true);
    toggleWidget(); 
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Chat Application</h1>
      </header>
      {/* Conditionally render the notification */}
      {/* {showNotification && <ChatNotification onClick={openChat}/>} */}
      {showNotification && (
        <>
          <ChatNotification onClick={openChat} />
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
      />
    </div>
  );
}

export default App;
