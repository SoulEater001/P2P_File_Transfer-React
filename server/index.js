import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/auth.js';
import transferHistoryRoutes from './routes/transferHistory.js';
import TransferHistory from './models/history.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        transports: ['websocket', 'polling'],
    },
});

// Map of userId => socketId
const userPeerMapping = {};
app.locals.userPeerMapping = userPeerMapping;

app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => res.send('Welcome to P2P File Transfer Server'));

// Auth & transfer routes
app.use('/api/auth', authRoutes);
app.use('/api/transfer', transferHistoryRoutes);

// Protected test route
app.get('/api/protected', async (req, res) => res.status(200).json({ message: 'Protected route' }));

// --- SOCKET.IO LOGIC ---
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Authenticate socket with JWT
    socket.on('authenticate', (data) => {
        const { token } = data;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userPeerMapping[decoded.id] = socket.id;
            socket.userId = decoded.id;
            console.log(`User ${decoded.id} connected via socket ${socket.id}`);
        } catch (err) {
            console.log('Socket authentication failed:', err.message);
            socket.disconnect();
        }
    });

    // Start transfer: create DB record and return transferId
    socket.on('transfer-start', async (data) => {
        const { targetUserId, fileName, fileType, fileSize, senderName } = data;
        try {
            const transferHistory = new TransferHistory({
                sender: socket.userId,
                receiver: targetUserId,
                fileName,
                fileType,
                fileSize,
                status: 'Pending',
                transferDate: new Date()
            });
            await transferHistory.save();

            const transferId = transferHistory._id.toString();

            // Send transferId back to sender
            socket.emit('transfer-initiated', { transferId });

            // Notify receiver
            const targetSocketId = userPeerMapping[targetUserId];
            if (targetSocketId) {
                io.to(targetSocketId).emit('incoming-transfer', {
                    transferId,
                    senderUserId: socket.userId,
                    senderName,
                    fileName,
                    fileSize,
                    fileType
                });
            }

            console.log(`Transfer started: ${transferId}`);
        } catch (err) {
            console.error('Error saving transfer history:', err);
            socket.emit('transfer-error', { message: 'Could not start transfer' });
        }
    });

    // Offer
    socket.on('offer', (data) => {
        const targetSocketId = userPeerMapping[data.targetUserId];
        if (!targetSocketId) return;
        io.to(targetSocketId).emit('offer', {
            senderUserId: socket.userId,
            offer: data.offer,
            senderName: data.senderName,
            transferId: data.transferId,
        });
    });

    // Answer
    socket.on('answer', (data) => {
        const targetSocketId = userPeerMapping[data.targetUserId];
        if (!targetSocketId) return;
        io.to(targetSocketId).emit('answer', {
            senderUserId: socket.userId,
            answer: data.answer,
            transferId: data.transferId,
        });
    });

    // ICE Candidate
    socket.on('ice-candidate', (data) => {
        const targetSocketId = userPeerMapping[data.targetUserId];
        if (!targetSocketId) return;
        io.to(targetSocketId).emit('ice-candidate', {
            candidate: data.candidate,
            transferId: data.transferId,
        });
    });

    // File received
    socket.on('file-received', async (data) => {
        const { transferId, fileName, senderUserId } = data;
        try {
            if (transferId) {
                await TransferHistory.findByIdAndUpdate(
                    { _id: transferId, status: 'Pending' },
                    { status: 'Received' },
                    { new: true }
                );
                console.log(`Transfer ${transferId} marked as Received`);
            } else {
                await TransferHistory.findOneAndUpdate(
                    { fileName, sender: senderUserId, status: 'Pending' },
                    { status: 'Received' },
                    { new: true }
                );
                console.log(`File "${fileName}" marked as received (fallback)`);
            }
        } catch (err) {
            console.error('Error updating transfer status:', err);
        }
    });

    // Transfer failed
    socket.on('transfer-failed', async ({ transferId }) => {
        try {
            if (transferId) {
                await TransferHistory.findByIdAndUpdate(transferId, { status: 'Failed' });
                console.log(`Transfer ${transferId} marked as Failed`);
            }
        } catch (err) {
            console.error('Error marking transfer as Failed:', err);
        }
    });

    // Transfer cancelled
    socket.on('transfer-cancelled', async ({ transferId }) => {
        try {
            if (transferId) {
                await TransferHistory.findByIdAndUpdate(transferId, { status: 'Cancelled' });
                console.log(`Transfer ${transferId} marked as Cancelled`);
            }
        } catch (err) {
            console.error('Error marking transfer as Cancelled:', err);
        }
    });


    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (socket.userId) delete userPeerMapping[socket.userId];
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
