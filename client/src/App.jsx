/*import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Toolbar from './components/Toolbar';
import StatusBar from './components/StatusBar';
import Editor from './components/Editor';
import { createDoc } from './utils/api';
import './styles.css';

const SERVER = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export default function App() {
  const [docId, setDocId] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('doc') || 'default-doc';
  });
  const [status, setStatus] = useState('Connecting...');
  const socketRef = useRef(null);
  const clientIdRef = useRef(Math.random().toString(36).slice(2,9));
  const editorRef = useRef(null);
  const emitTimer = useRef(null);

  useEffect(() => {
    const socket = io(SERVER);
    socketRef.current = socket;

    socket.on('connect', () => {
      setStatus('Connected');
      socket.emit('join-doc', { docId, clientId: clientIdRef.current });
    });

    socket.on('disconnect', () => setStatus('Disconnected'));

    socket.on('doc-load', ({ content }) => {
      if (editorRef.current) editorRef.current.innerHTML = content;
      setStatus('Loaded');
    });

    socket.on('doc-update', ({ content, clientId }) => {
      if (clientId === clientIdRef.current) return; // ignore our own
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        setStatus('Synced (updated)');
      }
    });

    return () => socket.disconnect();
  }, [docId]);

  function scheduleEmit() {
    if (emitTimer.current) clearTimeout(emitTimer.current);
    emitTimer.current = setTimeout(() => {
      const content = editorRef.current ? editorRef.current.innerHTML : '';
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('doc-update', { docId, content, clientId: clientIdRef.current });
        setStatus('Synced');
      }
    }, 400);
  }

  function onInput() {
    setStatus('Editing...');
    scheduleEmit();
  }

  function onCmd(cmd) {
   document.execCommand(cmd);

    scheduleEmit();
  }

  async function createNew() {
    try {
      const res = await createDoc();
      const id = res.docId;
      const u = new URL(window.location.href);
      u.searchParams.set('doc', id);
      window.history.pushState({}, '', u.toString());
      setDocId(id);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to create document');
    }
  }

  return (
    <div className="container">
      <header className="topbar">
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <button onClick={createNew} className="btn">New Document</button>
          <div className="label">Document Id:</div>
          <input value={docId} onChange={e => setDocId(e.target.value)} className="docinput" />
          <div className="status">{status}</div>
        </div>
        <Toolbar onCmd={onCmd} />
      </header>

      <main>
        <Editor ref={editorRef} onInput={onInput} />
      </main>

      <footer className="foot">
        <StatusBar status={status} />
        Share URL to collaborate: <code>{window.location.href}</code>
      </footer>
    </div>
  );
}
*/

/*
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import StatusBar from './components/StatusBar';
import { createDoc } from './utils/api';
import './styles.css';

const SERVER = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export default function App() {
  // ----- state -----
  const [docId, setDocId] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('doc') || 'default-doc';
  });
  const [status, setStatus] = useState('Connecting...');
  const [content, setContent] = useState('');

  // ----- refs -----
  const socketRef = useRef(null);
  const clientIdRef = useRef(Math.random().toString(36).slice(2, 9));
  const emitTimer = useRef(null);

  // ----- socket setup -----
  useEffect(() => {
    const socket = io(SERVER);
    socketRef.current = socket;

    socket.on('connect', () => {
      setStatus('Connected');
      socket.emit('join-doc', { docId, clientId: clientIdRef.current });
    });

    socket.on('disconnect', () => setStatus('Disconnected'));

    socket.on('doc-load', ({ content }) => {
      setContent(content || '');
      setStatus('Loaded');
    });

    socket.on('doc-update', ({ content, clientId }) => {
      if (clientId !== clientIdRef.current) {
        setContent(content || '');
        setStatus('Synced (updated)');
      }
    });

    return () => socket.disconnect();
  }, [docId]);

  // ----- send updates to server -----
  function scheduleEmit(newContent) {
    setContent(newContent);
    if (emitTimer.current) clearTimeout(emitTimer.current);
    emitTimer.current = setTimeout(() => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('doc-update', {
          docId,
          content: newContent,
          clientId: clientIdRef.current
        });
        setStatus('Synced');
      }
    }, 400);
  }

  async function createNew() {
    try {
      const res = await createDoc();
      const newId = res.docId;
      const u = new URL(window.location.href);
      u.searchParams.set('doc', newId);
      window.history.pushState({}, '', u.toString());
      setDocId(newId);
      setContent('');
    } catch (err) {
      console.error(err);
      alert('Failed to create document');
    }
  }

  // ----- editor toolbar options -----
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ]
  };

  return (
    <div className="container">
      <header className="topbar">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={createNew} className="btn">New Document</button>
          <div className="label">Document Id:</div>
          <input
            value={docId}
            onChange={e => setDocId(e.target.value)}
            className="docinput"
          />
          <div className="status">{status}</div>
        </div>
      </header>

      <main>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={scheduleEmit}
          modules={modules}
          style={{ height: '400px', backgroundColor: '#fff', marginTop: '12px' }}
        />
      </main>

      <footer className="foot">
        <StatusBar status={status} />
        Share URL to collaborate: <code>{window.location.href}</code>
      </footer>
    </div>
  );
}
*/
/*

import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import StatusBar from "./components/StatusBar";
import PresenceBar from "./components/PresenceBar";
import ChatSidebar from "./components/ChatSidebar";
import { createDoc } from "./utils/api";
import { useTheme } from "./context/ThemeContext";

import "./styles.css";

const SERVER = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";


export default function App() {
 
  
  const { theme, toggleTheme } = useTheme();

  
  const [docId, setDocId] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("doc") || "default-doc";
  });
  const [status, setStatus] = useState("Connecting...");
  const [content, setContent] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [username] = useState(
    "User" + Math.floor(Math.random() * 1000) // temp random username
  );

  
  const socketRef = useRef(null);
  const clientIdRef = useRef(Math.random().toString(36).slice(2, 9));
  const emitTimer = useRef(null);

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
async function saveDoc() {
  try {
    const res = await fetch(`${SERVER}/api/save/${docId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    if (res.ok) {
      setStatus('Document Saved ✅');
      setTimeout(() => setStatus('Synced'), 2000);
    } else {
      alert('Save failed.');
    }
  } catch (err) {
    console.error(err);
    alert('Error while saving document.');
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
      {/* ---------- TOPBAR ---------- *//*
      <header className="topbar">
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={createNew} className="btn">
            New Document
          </button>
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
          <a href="/dashboard" className="btn small">
            📂 Dashboard
          </a>
        </div>
      </header>

      {/* ---------- PRESENCE ---------- *//*
      <PresenceBar users={onlineUsers} />

      {/* ---------- MAIN EDITOR & CHAT ---------- *//*
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "0.5rem",
          minHeight: "400px",
        }}
      >
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

      {/* ---------- FOOTER ---------- *//*
      <footer className="foot">
        <StatusBar status={status} />
        Share URL to collaborate: <code>{window.location.href}</code>
      </footer>
    </div>
  );
}*/

// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      {/* Top navigation bar */}
      <nav className="topbar" style={{ justifyContent: "flex-start", gap: "1rem" }}>
        <Link to="/" className="btn">📝 Editor</Link>
        <Link to="/dashboard" className="btn">📂 Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<EditorPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
/*
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Simple auth check
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      {/* Top navigation bar *//*
      <nav className="topbar" style={{ justifyContent: "flex-start", gap: "1rem" }}>
        <Link to="/" className="btn">📝 Editor</Link>
        <Link to="/dashboard" className="btn">📂 Dashboard</Link>
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn">Register</Link>
      </nav>

      <Routes>
        {/* Public Routes *//*
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes *//*
        <Route
          path="/"
          element={
            <PrivateRoute>
              <EditorPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}


*/