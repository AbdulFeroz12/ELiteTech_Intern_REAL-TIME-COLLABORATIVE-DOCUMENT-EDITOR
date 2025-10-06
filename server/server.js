/*require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const docRoutes = require('./routes/docRoutes');
const Document = require('./models/Document');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collab';

// connect mongoose
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.warn('MongoDB error', err.message));

app.use('/api', docRoutes);

// Socket.IO real-time
io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);

  // join a document room
  socket.on('join-doc', async ({ docId, clientId }) => {
    if (!docId) return;
    socket.join(docId);
    socket.docId = docId;
    // load or create doc
    let doc = await Document.findById(docId);
    if (!doc) {
      doc = new Document({ _id: docId, content: `<h2>Untitled Document (${docId})</h2><p>Start typing...</p>` });
      await doc.save();
    }
    socket.emit('doc-load', { content: doc.content, updatedAt: doc.updatedAt });
    console.log(`Socket ${socket.id} joined doc ${docId}`);
  });

  // client sends update (full content)
  socket.on('doc-update', async ({ docId, content, clientId }) => {
    if (!docId) return;
    try {
      await Document.findByIdAndUpdate(docId, { content, updatedAt: new Date() }, { upsert: true });
    } catch (err) {
      console.error('Save error', err);
    }
    // broadcast to others
    socket.to(docId).emit('doc-update', { content, clientId });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
*/

/*
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const docRoutes = require('./routes/docRoutes');
const Document = require('./models/Document');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collab';


mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.warn(' MongoDB error:', err.message));

app.use('/api', docRoutes);

// Dashboard endpoint: list all documents
app.get('/api/docs', async (req, res) => {
  try {
    const docs = await Document.find({}, ' _id updatedAt').sort({ updatedAt: -1 });
    // Map to desired output
    res.json(
      docs.map(d => ({
        docId: d._id,
        updatedAt: d.updatedAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});


// { docId: { clientId: username } }
const onlineUsers = {};


io.on('connection', socket => {
  console.log('🔌 Socket connected:', socket.id);

 
  socket.on('join-doc', async ({ docId, clientId, username }) => {
    if (!docId) return;
    socket.join(docId);
    socket.docId = docId;

    // Store presence
    if (!onlineUsers[docId]) onlineUsers[docId] = {};
    onlineUsers[docId][clientId] = username || `User-${clientId.slice(0, 4)}`;

    // Load or create document
    let doc = await Document.findById(docId);
    if (!doc) {
      doc = new Document({
        _id: docId,
        content: `<h2>Untitled Document (${docId})</h2><p>Start typing...</p>`,
      });
      await doc.save();
    }

    // Send loaded content to this user
    socket.emit('doc-load', { content: doc.content, updatedAt: doc.updatedAt });

    // Notify others about presence
    io.to(docId).emit('presence-update', Object.values(onlineUsers[docId]));

    console.log(`📄 ${socket.id} joined doc ${docId}`);
  });

 
  socket.on('doc-update', async ({ docId, content, clientId }) => {
    if (!docId) return;
    try {
      await Document.findByIdAndUpdate(
        docId,
        { content, updatedAt: new Date() },
        { upsert: true }
      );
    } catch (err) {
      console.error(' Save error', err);
    }
    // Broadcast update to others in the room
    socket.to(docId).emit('doc-update', { content, clientId });
  });

 
  socket.on('chat-message', ({ docId, username, text }) => {
    if (!docId || !text) return;
    io.to(docId).emit('chat-message', { username, text });
  });

 
  socket.on('disconnect', () => {
    const { docId } = socket;
    if (docId && onlineUsers[docId]) {
      // Remove from presence
      for (const [cid] of Object.entries(onlineUsers[docId])) {
        if (cid === socket.clientId) delete onlineUsers[docId][cid];
      }
      io.to(docId).emit('presence-update', Object.values(onlineUsers[docId]));
    }
    console.log(' Socket disconnected:', socket.id);
  });
});


server.listen(PORT, () =>
  console.log(` Server running on http://localhost:${PORT}`)
);
io.on("connection", (socket) => {
  // existing events...

  socket.on("chat-file", (data) => {
    // broadcast file to all in the room
    io.to(data.docId).emit("chat-message", {
      username: data.username,
      text: `${data.username} shared a file:`,
      file: {
        fileName: data.fileName,
        fileData: data.fileData, // base64 data
      },
    });
  });
});



io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join-doc', async ({ docId }) => {
    let doc = await Document.findById(docId);
    if (!doc) {
      doc = await Document.create({ _id: docId, content: '' });
    }
    socket.join(docId);
    socket.emit('doc-load', { content: doc.content });
  });

  socket.on('doc-update', async ({ docId, content }) => {
    await Document.findByIdAndUpdate(
      docId,
      { content, updatedAt: new Date() },
      { upsert: true }
    );
    socket.to(docId).emit('doc-update', { content });
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});
*/



require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const docRoutes = require('./routes/docRoutes');
const Document = require('./models/Document');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pro-docs';

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', docRoutes);

// Endpoint to list all documents
app.get('/api/docs', async (req, res) => {
  try {
    const docs = await Document.find({}, '_id updatedAt').sort({ updatedAt: -1 });
    res.json(
      docs.map(d => ({
        docId: d._id,
        updatedAt: d.updatedAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Create HTTP server and Socket.io
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Track online users per document
const onlineUsers = {}; // { docId: { clientId: username } }

io.on('connection', socket => {
  console.log('🔌 Socket connected:', socket.id);

  // Join a document
  socket.on('join-doc', async ({ docId, clientId, username }) => {
    if (!docId) return;
    socket.join(docId);
    socket.docId = docId;
    socket.clientId = clientId;

    // Track online users
    if (!onlineUsers[docId]) onlineUsers[docId] = {};
    onlineUsers[docId][clientId] = username || `User-${clientId.slice(0, 4)}`;

    // Load or create document
    let doc = await Document.findById(docId);
    if (!doc) {
      doc = new Document({
        _id: docId,
        content: `<h2>Untitled Document (${docId})</h2><p>Start typing...</p>`,
      });
      await doc.save();
    }

    // Send document content to the user
    socket.emit('doc-load', { content: doc.content, updatedAt: doc.updatedAt });

    // Notify others about online users
    io.to(docId).emit('presence-update', Object.values(onlineUsers[docId]));

    console.log(`📄 ${socket.id} joined doc ${docId}`);
  });

  // Document updates
  socket.on('doc-update', async ({ docId, content, clientId }) => {
    if (!docId) return;
    try {
      await Document.findByIdAndUpdate(
        docId,
        { content, updatedAt: new Date() },
        { upsert: true }
      );
    } catch (err) {
      console.error('🛑 Save error:', err);
    }
    // Broadcast to other users
    socket.to(docId).emit('doc-update', { content, clientId });
  });

  // Chat messages
  socket.on('chat-message', ({ docId, username, text }) => {
    if (!docId || !text) return;
    io.to(docId).emit('chat-message', { username, text });
  });

  // Chat file sharing
  socket.on('chat-file', ({ docId, username, fileName, fileData }) => {
    if (!docId || !fileName || !fileData) return;
    io.to(docId).emit('chat-message', {
      username,
      text: `${username} shared a file:`,
      file: { fileName, fileData },
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const { docId, clientId } = socket;
    if (docId && onlineUsers[docId] && clientId) {
      delete onlineUsers[docId][clientId];
      io.to(docId).emit('presence-update', Object.values(onlineUsers[docId]));
    }
    console.log('❌ Socket disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
