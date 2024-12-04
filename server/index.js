import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import transferHistoryRoutes from './routes/transferHistory.js';
import authMiddleware from './middleware/auth.js';
import TransferHistory from './models/history.js';
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
app.use('/api/transfer', transferHistoryRoutes);

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for custom events
    socket.on('offer', async (data) => {

        io.to(data.target).emit('offer', { sender: socket.id, offer: data.offer });
    });

    socket.on('transfer-start', async (data) => {
        const { fileName, fileType, fileSize } = data;
        try {
            const transferHistory = new TransferHistory({
                sender: socket.id, // Use socket.id as sender's unique identifier
                receiver: data.target,  // Target user's socket.id as receiver's unique identifier
                fileName: fileName,  // File name
                fileType: fileType,  // File type (MIME type)
                fileSize: fileSize,  // File size in bytes
                status: 'Pending',   // Initially, the status is 'Pending'
                transferDate: new Date().toUTCString(), // Current date and time of transfer
            });

            // Save the transfer history entry
            await transferHistory.save();
            console.log('Transfer history saved successfully.');


        } catch (error) {
            console.error('Error saving transfer history:', error);
        }
    });

    socket.on('file-received', async (data) => {
        const { fileName, sender } = data;

        try {
            // Find the relevant transfer history entry and update the status to 'Received'
            const transfer = await TransferHistory.findOneAndUpdate(
                { fileName: fileName, sender: sender, status: "Pending" },
                { status: 'Received' },
                { new: true }
            );
            if (transfer) {
                console.log(`Transfer for file "${fileName}" marked as Received.`);
            } else {
                console.log('No matching received transfer found to update.');
            }
        } catch (error) {
            console.error('Error updating transfer status to Received:', error);
        }
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
