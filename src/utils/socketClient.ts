import { io } from 'socket.io-client';

const url = "wss://api.speedautomac.app.br:5444"

export const socket = io(url, {
    path: '/api/socket/webhook',
    transports: ["websocket"]
})
