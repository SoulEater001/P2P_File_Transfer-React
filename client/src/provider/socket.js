// socket.js
import { io } from 'socket.io-client';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const socket = io(`${API_BASE_URL}`, {
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
