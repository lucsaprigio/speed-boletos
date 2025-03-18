import { io } from 'socket.io-client';

const url = process.env.NEXT_PUBLIC_SOCKET_URL;

export const socket = io(url, {
    path: '/api/socket/webhook',
    transports: ["websocket"]
})
