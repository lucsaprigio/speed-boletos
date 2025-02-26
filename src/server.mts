import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";

const app = next({ dev, hostname: "http://localhost", port: 3000 });

const handle = app.getRequestHandler();

app.prepare().then(() => {

    const httpServer = createServer(handle);
    const io = new Server(httpServer);
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);
    })
})