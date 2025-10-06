/*import React, { useEffect, useRef, useState } from "react";

export default function ChatSidebar({ socket, docId, username }) {
  const [messages, setMessages] = useState([]);       
  const [text, setText] = useState("");               
  const fileInputRef = useRef(null);

  // listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("chat-message");
  }, [socket]);

  // send text messages
  function sendMsg() {
    if (!text.trim()) return;

    const msg = { username, text: text.trim() };
    socket.emit("chat-message", { docId, ...msg });

    // add only text messages locally
    setMessages((prev) => [...prev, msg]);
    setText("");
  }

  //  handle file uploads (NO local push — avoids duplicates)
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit("chat-file", {
        docId,
        username,
        fileName: file.name,
        fileData: reader.result,
      });
      // removed local setMessages to prevent duplicates
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="chat-sidebar">
      {/* Chat message list *//*
      <div className="messages">
        {messages.map((m, i) => {
          const isMe = m.username === username;
          return (
            <div key={i} className={`msg-row ${isMe ? "me" : "other"}`}>
              {!isMe && (
                <div className="avatar">{m.username[0].toUpperCase()}</div>
              )}
              <div className={`bubble ${isMe ? "me-bubble" : "other-bubble"}`}>
                {!isMe && <div className="sender">{m.username}</div>}
                {m.text}
                {m.file && (
                  <div className="file-link">
                    <a href={m.file.fileData} download={m.file.fileName}>
                      📎 {m.file.fileName}
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input field *//*
      <div className="chat-input">
        <button
          className="attach-btn"
          onClick={() => fileInputRef.current.click()}
        >
          📎
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && sendMsg()}
        />
        <button onClick={sendMsg}>
  <i className="fas fa-paper-plane"></i>
</button>

        
      </div>
    </div>
  );
}
*/


import React, { useEffect, useRef, useState } from "react";

export default function ChatSidebar({ socket, docId, username }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);

  //  Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("chat-message");
  }, [socket]);

  //  Send text messages
  function sendMsg() {
    if (!text.trim()) return;

    const msg = { username, text: text.trim() };

    //  Only emit to server — don’t add locally
    socket.emit("chat-message", { docId, ...msg });

    setText("");
  }

  //  Handle file uploads
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit("chat-file", {
        docId,
        username,
        fileName: file.name,
        fileData: reader.result,
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="chat-sidebar">
      <div className="messages">
        {messages.map((m, i) => {
          const isMe = m.username === username;
          return (
            <div key={i} className={`msg-row ${isMe ? "me" : "other"}`}>
              {!isMe && <div className="avatar">{m.username[0].toUpperCase()}</div>}
              <div className={`bubble ${isMe ? "me-bubble" : "other-bubble"}`}>
                {!isMe && <div className="sender">{m.username}</div>}
                {m.text}
                {m.file && (
                  <div className="file-link">
                    <a href={m.file.fileData} download={m.file.fileName}>
                      📎 {m.file.fileName}
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-input">
        <button
          className="attach-btn"
          onClick={() => fileInputRef.current.click()}
        >
          📎
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && sendMsg()}
        />
        <button onClick={sendMsg}>➤</button>
      </div>
    </div>
  );
}
