// socket.js
import { io } from 'socket.io-client';

// Create the socket instance and export it
const socket = io('http://localhost:5000', {
    transports: ['websocket', 'polling'],
});

export default socket;
