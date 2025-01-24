// socket.js
import { io } from 'socket.io-client';

// Create the socket instance and export it
const socket = io('https://p2pfiletransfer-react-backend-production.up.railway.app', {
    transports: ['websocket', 'polling'],
});

export default socket;
