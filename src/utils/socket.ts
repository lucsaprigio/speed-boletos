import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';

let io: IOServer | null = null;

export function initializeSocket(server: HttpServer) {
    if (!io) {
        io = new IOServer(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        io.on('connection', (socket) => {
            console.log('New client connected', socket.id);

            socket.on('disconnect', () => {
                console.log('Client disconnected', socket.id);
            });
        });
    }

    return io;
}

export function getSocket() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}