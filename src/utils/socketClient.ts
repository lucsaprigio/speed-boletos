import { io } from 'socket.io-client';

const url = "http://localhost:3000";

export const socket = io(url, {
    path: '/api/socket/webhook',
    transports: ["websocket"]
})
