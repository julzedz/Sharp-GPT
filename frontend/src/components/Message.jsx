import React from "react";
import "./Message.css";
import showdown from "showdown";

function Message({ sender, text }) {
  const messageClass = sender === "user" ? "user-message" : "bot-message";
  const converter = new showdown.Converter();

  return (
  <div className={`message ${messageClass}`}>
    <div className="message-bubble">
      <strong>{sender === "user" ? "You:" : "Sharp-GPT:"}</strong>
      <span dangerouslySetInnerHTML={{ __html: converter.makeHtml(text) }} />
    </div>
  </div>
)};
export default Message;