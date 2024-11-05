import React,{ useEffect, useState, useRef } from 'react';

export function useWebSocket(url) {
  const [messages, setMessages] = useState([]); 
  const [status, setStatus] = useState('disconnected');
  const [loading, setLoading] = useState(false);
  const messageBuffer = React.useRef("");
  const websocket = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    websocket.current = new WebSocket(url);
    setStatus('connecting');

    websocket.current.onopen = () => {
      setStatus('connected');
      console.log('Connected to WebSocket');
    };

    websocket.current.onclose = () => {
      setStatus('disconnected');
      console.log('Disconnected from WebSocket');
    };

    websocket.current.onmessage = (event) => {
      // Handle streaming responses and check for the end marker
      const message = event.data;
      if (message === '<ENDED/>') {
        setMessages((prev) => [
          ...prev,
          { text: messageBuffer.current, isStreamEnd: true }
        ]);
        setLoading(false); 
        messageBuffer.current = "";
      } else {
        messageBuffer.current += message;
        setLoading(true);
      }
    };

    return () => {
      websocket.current.close();
    };
  }, [url]);

  // Function to send messages to the WebSocket
  const sendMessage = (msg) => {
    if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
      websocket.current.send(msg);
      setMessages((prev) => [...prev, { text: msg, isUserMessage: true }]);
      // setLoading(true); 
    } else {
      console.warn('WebSocket is not connected.');
    }
  };

  return { messages, sendMessage, loading };
}
