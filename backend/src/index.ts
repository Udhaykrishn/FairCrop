import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import "reflect-metadata";
import http from "http";
import app from "./app";
import { connectDB } from "./config/db.config";
import { initSocket } from "./socket/socket.gateway";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
	await connectDB();

    // Wrap Express in a raw HTTP server so Socket.IO can share the same port
    const httpServer = http.createServer(app);

    initSocket(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Socket.IO is ready on ws://localhost:${PORT}`);
    });
};

startServer();