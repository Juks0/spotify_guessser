import express from 'express';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { forntendUrl } from "@/lib/urls/forntendUrl.js";
import cookieParser from "cookie-parser";

const app = express();
const __dirname = import.meta.dirname;

app.use(express.static(__dirname + '/public'))
    .use(cors({
        origin: forntendUrl,
        credentials: true
    }))
    .use(cookieParser());

const httpsOptions = {
    key: fs.readFileSync('192.168.0.8-key.pem'),
    cert: fs.readFileSync('192.168.0.8.pem'),
};

const httpsServer = https.createServer(httpsOptions, app);

const io = new Server(httpsServer, {
    cors: {
        origin: forntendUrl,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const rooms: { [key: string]: string[] } = {};

const questions = [
    { id: 1, text: "What is 2 + 2?", options: ["3", "4", "5"], answer: 1 },
    { id: 2, text: "Capital of France?", options: ["Berlin", "Paris", "Madrid"], answer: 1 },
];

io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);

    socket.on('createRoom', (callback) => {
        const roomCode = uuidv4().slice(0, 6);
        rooms[roomCode] = [socket.id];
        socket.join(roomCode);
        callback({ roomCode });
        console.log(`Room created: ${roomCode}`);
    });

    socket.on('joinRoom', (roomCode, callback) => {
        const room = rooms[roomCode];
        if (room && room.length < 2) {
            room.push(socket.id);
            socket.join(roomCode);
            callback({ success: true });
            if (room.length === 2) {
                io.to(roomCode).emit('startGame', { roomCode });
                io.to(roomCode).emit('sendQuestions', questions);
            }
            console.log(`Socket ${socket.id} joined room ${roomCode}`);
        } else {
            callback({ success: false, message: 'Room full or does not exist' });
        }
    });

    socket.on('disconnect', () => {
        for (const roomCode of Object.keys(rooms)) {
            rooms[roomCode] = rooms[roomCode].filter(id => id !== socket.id);
            if (rooms[roomCode].length === 0) {
                delete rooms[roomCode];
                console.log(`Room ${roomCode} deleted`);
            }
        }
    });
});

httpsServer.listen(3001, () => {
    console.log('HTTPS Server with Socket.IO listening on port 3001');
});
