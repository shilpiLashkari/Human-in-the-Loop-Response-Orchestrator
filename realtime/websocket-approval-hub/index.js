require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity in this demo
        methods: ["GET", "POST"]
    }
});

// Store connected clients if needed, but for broadcast we don't strictly need it
io.on('connection', (socket) => {
    console.log(`🔌 Client Connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`❌ Client Disconnected: ${socket.id}`);
    });
});

// API for other services (Orchestrator) to trigger broadcasts
app.post('/api/broadcast', (req, res) => {
    const { event, data } = req.body;

    if (!event || !data) {
        return res.status(400).json({ error: 'Missing event or data' });
    }

    console.log(`📢 Broadcasting Event: ${event}`);
    io.emit(event, data);
    res.json({ success: true });
});

server.listen(PORT, () => {
    console.log(`🚀 WebSocket Approval Hub running on port ${PORT}`);
});
