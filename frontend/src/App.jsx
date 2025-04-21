import React, { useState, useEffect } from "react";
import axios from "axios";
import Message from "./components/Message";
import InputArea from "./components/InputArea";
import "./App.css";

function App() {
  // State to hold the conversation history
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = "https://sharp-gpt.onrender.com";

  // Fetch chat history when component mounts
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/history`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchHistory();
  }, []);

  const handleSendMessage = async (messageText) => {
    // 1. Add user message to state immediately
    const newUserMessage = {
      sender: "user",
      text: messageText,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setLoading(true);

    try {
      // 2. Send message to backend
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: messageText,
      });

      // 3. Add bot response to state (backend already saved to DB)
      const botResponse = {
        sender: "bot",
        text: response.data.response,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optional: Add an error message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "Error: Could not get a response.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="app-container">
      <h1>Sharp GPT 💯</h1>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} />
        ))}
        {loading && <div className="loading">Sharp GPT is typing...</div>}{" "}
      </div>
      <InputArea onSendMessage={handleSendMessage} />
    </div>
  );
}

export default App;
