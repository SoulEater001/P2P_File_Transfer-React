const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow requests from your frontend
        methods: ['GET', 'POST'],
        transports: ['websocket', 'polling'],
    },
});

// Middleware
app.use(cors());

// Basic route for testing server
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the P2P File Transfer Server');
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for custom events
    socket.on('offer', (data) => {
        // console.log('Offer received:', data);
        io.to(data.target).emit('offer', { sender: socket.id, offer: data.offer, fileName: data.fileName });
    });

    socket.on('answer', (data) => {
        // console.log('Answer received:', data);
        io.to(data.target).emit('answer', { sender: socket.id, answer: data.answer });
    });

    socket.on('ice-candidate', (data) => {
        // console.log('ICE candidate received:', data);
        io.to(data.target).emit('ice-candidate', { candidate: data.candidate });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
