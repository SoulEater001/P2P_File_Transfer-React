import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import authMiddleware from './middleware/auth.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const app = express();
dotenv.config();
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
app.use(express.json());

// Basic route for testing server
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the P2P File Transfer Server');
});

app.use('/api/auth', authRoutes);
app.get('/api/protected', authMiddleware, (req, res) => {
    res.status(200).json({
        message: 'This is a protected route',
        user: req.user,  // User info attached by JWT
    });
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

// Database connection
mongoose.connect(process.env.MONGO_URL).then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
