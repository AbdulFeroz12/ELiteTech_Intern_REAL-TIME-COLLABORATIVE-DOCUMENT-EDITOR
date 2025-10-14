import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import StatusBar from "../components/StatusBar";
import PresenceBar from "../components/PresenceBar";
import ChatSidebar from "../components/ChatSidebar";
import { createDoc } from "../utils/api";
import { useTheme } from "../context/ThemeContext";

const SERVER = "https://elitetech-intern-real-time-collaborative-gczw.onrender.com";



export default function EditorPage() {
  const { theme, toggleTheme } = useTheme();

  const [docId, setDocId] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("doc") || "default-doc";
  });
  const [status, setStatus] = useState("Connecting...");
  const [content, setContent] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [username] = useState("User" + Math.floor(Math.random() * 1000));

  const socketRef = useRef(null);
  const clientIdRef = useRef(Math.random().toString(36).slice(2, 9));
  const emitTimer = useRef(null);

  // Socket connection
  useEffect(() => {
    const socket = io(SERVER);
    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("Connected");
      socket.emit("join-doc", {
        docId,
        clientId: clientIdRef.current,
        username,
      });
    });

    socket.on("disconnect", () => setStatus("Disconnected"));

    socket.on("doc-load", ({ content }) => {
      setContent(content || "");
      setStatus("Loaded");
    });

    socket.on("doc-update", ({ content, clientId }) => {
      if (clientId !== clientIdRef.current) {
        setContent(content || "");
        setStatus("Synced (updated)");
      }
    });

    socket.on("presence-update", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.disconnect();
  }, [docId, username]);

  // Emit updates
  function scheduleEmit(newContent) {
    setContent(newContent);
    if (emitTimer.current) clearTimeout(emitTimer.current);
    emitTimer.current = setTimeout(() => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("doc-update", {
          docId,
          content: newContent,
          clientId: clientIdRef.current,
        });
        setStatus("Synced");
      }
    }, 400);
  }

  // Create new document
  async function createNew() {
    try {
      const res = await createDoc();
      const newId = res.docId;
      const u = new URL(window.location.href);
      u.searchParams.set("doc", newId);
      window.history.pushState({}, "", u.toString());
      setDocId(newId);
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Failed to create document");
    }
  }

  // Save current document
  async function saveDoc() {
    try {
      const res = await fetch(`${SERVER}/api/save/${docId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setStatus("Document Saved ");
        setTimeout(() => setStatus("Synced"), 2000);
      } else {
        alert("Save failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error while saving document.");
    }
  }

  // Quill toolbar modules
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, false] }],
      [{ color: [] }, { background: [] }],
      ["link", "clean"],
    ],
  };

  return (
    <div className="container">
      {/* ---------- TOPBAR ---------- */}
      <header className="topbar">
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={createNew} className="btn">New Document</button>
          <button onClick={saveDoc} className="btn save-btn">Save</button>
          <div className="label">Document Id:</div>
          <input
            value={docId}
            onChange={(e) => setDocId(e.target.value)}
            className="docinput"
          />
          <div className="status">{status}</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={toggleTheme}
            className="btn small"
            style={{ minWidth: "100px" }}
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </header>

      {/* ---------- PRESENCE ---------- */}
      <PresenceBar users={onlineUsers} />

      {/* ---------- MAIN ---------- */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", minHeight: "400px" }}>
        <div style={{ flex: 1 }}>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={scheduleEmit}
            modules={modules}
            style={{
              height: "400px",
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
          />
        </div>

        <ChatSidebar
          socket={socketRef.current}
          docId={docId}
          username={username}
        />
      </div>

      {/* ---------- FOOTER ---------- */}
      <footer className="foot">
        <StatusBar status={status} />
        Share URL to collaborate: <code>{window.location.href}</code>
      </footer>
    </div>
  );
}

/*
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import StatusBar from "../components/StatusBar";
import PresenceBar from "../components/PresenceBar";
import ChatSidebar from "../components/ChatSidebar";
import { createDoc } from "../utils/api";
import { useTheme } from "../context/ThemeContext";

const SERVER = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

export default function EditorPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [docId, setDocId] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("doc") || "default-doc";
  });
  const [status, setStatus] = useState("Connecting...");
  const [content, setContent] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [username, setUsername] = useState("");

  const socketRef = useRef(null);
  const clientIdRef = useRef(Math.random().toString(36).slice(2, 9));
  const emitTimer = useRef(null);

  // Check login on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.name) {
      navigate("/login");
    } else {
      setUsername(user.name);
    }
  }, [navigate]);

  // Socket connection (only after username is ready)
  useEffect(() => {
    if (!username) return; // wait until username is loaded

    const socket = io(SERVER);
    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("Connected");
      socket.emit("join-doc", {
        docId,
        clientId: clientIdRef.current,
        username,
      });
    });

    socket.on("disconnect", () => setStatus("Disconnected"));

    socket.on("doc-load", ({ content }) => {
      setContent(content || "");
      setStatus("Loaded");
    });

    socket.on("doc-update", ({ content, clientId }) => {
      if (clientId !== clientIdRef.current) {
        setContent(content || "");
        setStatus("Synced (updated)");
      }
    });

    socket.on("presence-update", (users) => {
      setOnlineUsers(users);
    });

    socket.on("chat-message", (msg) => {
      // Optional: handle chat messages here
      console.log("Chat message:", msg);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [docId, username]);

  // Emit updates
  function scheduleEmit(newContent) {
    setContent(newContent);
    if (emitTimer.current) clearTimeout(emitTimer.current);
    emitTimer.current = setTimeout(() => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("doc-update", {
          docId,
          content: newContent,
          clientId: clientIdRef.current,
        });
        setStatus("Synced");
      }
    }, 400);
  }

  // Create new document
  async function createNew() {
    try {
      const res = await createDoc();
      const newId = res.docId;
      const u = new URL(window.location.href);
      u.searchParams.set("doc", newId);
      window.history.pushState({}, "", u.toString());
      setDocId(newId);
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Failed to create document");
    }
  }

  // Save current document
  async function saveDoc() {
    try {
      const res = await fetch(`${SERVER}/api/save/${docId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setStatus("Document Saved");
        setTimeout(() => setStatus("Synced"), 2000);
      } else {
        alert("Save failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error while saving document.");
    }
  }

  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, false] }],
      [{ color: [] }, { background: [] }],
      ["link", "clean"],
    ],
  };

  return (
    <div className="container">
      <header className="topbar">
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={createNew} className="btn">New Document</button>
          <button onClick={saveDoc} className="btn save-btn">Save</button>
          <div className="label">Document Id:</div>
          <input
            value={docId}
            onChange={(e) => setDocId(e.target.value)}
            className="docinput"
          />
          <div className="status">{status}</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={toggleTheme} className="btn small" style={{ minWidth: "100px" }}>
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </header>

      <PresenceBar users={onlineUsers} />

      <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", minHeight: "400px" }}>
        <div style={{ flex: 1 }}>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={scheduleEmit}
            modules={modules}
            style={{ height: "400px", backgroundColor: "#fff", borderRadius: "8px" }}
          />
        </div>

        {socketRef.current && username && (
          <ChatSidebar socket={socketRef.current} docId={docId} username={username} />
        )}
      </div>

      <footer className="foot">
        <StatusBar status={status} />
        Share URL to collaborate: <code>{window.location.href}</code>
      </footer>
    </div>
  );
}
*/
