import app from './app';
import connectDB from './config/db';
import logger from './utils/logger';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust in production
        methods: ["GET", "POST"]
    }
});

// Socket.io connection handler
io.on('connection', (socket: any) => {
    logger.info(`New client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    
    // Debug AI Key Loading
    const aiKey = process.env.GOOGLE_AI_KEY;
    if (aiKey) {
        logger.info(`✅ GOOGLE_AI_KEY loaded (Length: ${aiKey.length}, Starts with: ${aiKey.substring(0, 4)}...)`);
    } else {
        logger.error(`❌ GOOGLE_AI_KEY is MISSING or UNDEFINED in process.env`);
    }
});
