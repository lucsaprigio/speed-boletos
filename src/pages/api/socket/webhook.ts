import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types/ServerIO";
import getRawBody from 'raw-body';

export const config = {
    api: {
        bodyParser: false
    }
}

async function ioHandler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (!res.socket.server.io) {
        const path = "/api/socket/webhook";
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, { path });

        res.socket.server.io = io;

        io.on("connection", (socket) => {

            console.log(`User connected: ${socket.id}`);

            socket.on("disconnect", () => {
                console.log(`User disconnected: ${socket.id}`);
            });
        });
    }

    if (req.method === 'POST') {
        try {
            const rawBody = await getRawBody(req);
            const event = JSON.parse(rawBody.toString('utf-8'));
            console.log(event)

            const io = res.socket.server.io;

            if (event.action === 'payment.created') {
                // console.log(`📤 Emitindo evento: payment.${event.data.id}.created`);
                io.emit(`payment.created`);
            }

            if (event.action === 'payment.updated') {
                // console.log(`📤 Emitindo evento: payment.${event.data.id}.updated`);
                io.emit(`payment.updated`);
            }

            res.status(200).json({ received: true });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Ocorreu um erro" })
        }

    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default ioHandler;