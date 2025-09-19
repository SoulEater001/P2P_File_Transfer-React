// socket.js
import { io } from 'socket.io-client';

// Create the socket instance and export it
// const socket = io('https://p2pfiletransfer-react-backend-production.up.railway.app', {
const socket = io('http://localhost:5000', {
    transports: ['websocket', 'polling'],
    autoConnect:false,
});

export const connectSocket = (token) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit("authenticate", { token });
  }
}; 

export default socket;
