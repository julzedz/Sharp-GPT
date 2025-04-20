import React from "react";
import "./Message.css";

function Message({ sender, text }) {
  const messageClass = sender === "user" ? "user-message" : "bot-message";

  // Function to parse text and wrap words between ** with <strong>, ``` with <pre><code>, ` with <code>, and numbers followed by a period on a new line
  const parseText = (text) => {
    const parts = text.split(
      /(\*\*[^*]+\*\*|\* [^*]+ \*|```[\s\S]*?```|`[^`]+`|\d+\.)/g
    ); // Split text by **..., * ... *, ```...```, `...`, or numbers followed by a period
    return parts.map((part, index) => {
      if (/^\*\*[^*]+\*\*$/.test(part)) {
        // Match **...** with any characters, ensuring no stack overflow
        return <strong key={index}>{part.slice(2, -2).trim()}</strong>; // Remove ** and wrap in <strong>
      } else if (/^\* [^*]+ \*$/.test(part)) {
        // Match * ... * with any characters including punctuation
        return part.slice(2, -2).trim();
      } else if (/^```[\s\S]*```$/.test(part)) {
        // Match ```...```
        return (
          <pre key={index}>
            <code>{part.slice(3, -3).trim()}</code>{" "}
            {/* Remove ``` and wrap in <pre><code> */}
          </pre>
        );
      } else if (/^`[^`]+`$/.test(part)) {
        // Match `...`
        return <code key={index}>{part.slice(1, -1).trim()}</code>; // Remove ` and wrap in <code>
      } else if (/^\d+\.$/.test(part)) {
        // Match numbers followed by a period
        return (
          <>
            <br key={`${index}-number-before`} />
            {part.trim()}
          </>
        );
      }
      return part; // Return normal text
    });
  };

  return (
    <div className={`message ${messageClass}`}>
      <div className="message-bubble">
        <strong>{sender === "user" ? "You:" : "Bot:"}</strong> {parseText(text)}
      </div>
    </div>
  );
}

export default Message;
