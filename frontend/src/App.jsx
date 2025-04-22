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
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setMessages(parsedHistory);
        } else {
          console.error(
            "Invalid data format in local storage. Clearing History."
          );
          localStorage.removeItem("chatHistory"); //Clear bad data
          setMessages([]); // Start with empty chat
        }
      } catch (e) {
        console.error("Failed to parse chat history from local storage", e);
        localStorage.removeItem("chatHistory"); //Clear bad data
        setMessages([]); // Start with empty chat
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat hsitory to Local Storage", e);
      alert("Warning: Chat history could not be saved to your browser.");
    }
  }, [messages]); // Dependency array: This effect runs everytime `messages` state array change

  const handleSendMessage = async (messageText) => {
    // 1. Add user message to state immediately
    const newUserMessage = {
      sender: "user",
      text: messageText,
      timestamp: new Date().toISOString(),
    };
    // Update state using a function to ensure we have the latest state
    setMessages((prevMessages) => [...prevMessages, newUserMessage]); // The save effect will trigger here
    setLoading(true);

    try {
      // 2. Send message to backend
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: messageText,
      });

      // 3. Add bot response to state
      const botResponse = {
        sender: "bot",
        text: response.data.response,
        timestamp: new Date().toISOString(),
      };
      // Update state using a function to ensure we have the latest state
      setMessages((prevMessages) => [...prevMessages, botResponse]); // The save effect will trigger here
    } catch (error) {
      console.error("Error sending message:", error);
      // Optional: Add an error message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "Error: Could not get a response.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="app-container">
      <h1>Sharp GPT 🤖</h1>
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
