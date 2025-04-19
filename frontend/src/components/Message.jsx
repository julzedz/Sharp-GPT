import React from "react";
import "./Message.css";

function Message({ sender, text }) {
  const messageClass = sender === "user" ? "user-message" : "bot-message";

  return (
    <div className={`message ${messageClass}`}>
      <div className="message-bubble">
        <strong>{sender === "user" ? "You:" : "Bot:"}</strong> {text}
      </div>
    </div>
  );
}

export default Message;