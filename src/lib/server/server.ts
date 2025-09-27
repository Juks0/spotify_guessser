import express from 'express';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import cookieParser from "cookie-parser";
const app = express();
const __dirname = import.meta.dirname;
const forntendUrl = process.env.FRONTEND_URL;
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
type Question = { id: number; text: string; options: string[]; answer: number };
type RoomState = {
    players: string[];
    host: string | null;
    questions: Question[];
    currentQuestionIndex: number;
    scores: Record<string, number>;
    answeredThisRound: Set<string>;
    timer?: NodeJS.Timeout;
    roundDeadlineTs?: number; 
    playerNames: Record<string, string>;
    playerDbIds: Record<string, number>; 
};
const rooms: Record<string, RoomState> = {};
io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);
    socket.on('createRoom', (callback) => {
        const roomCode = uuidv4().slice(0, 6);
        rooms[roomCode] = {
            players: [socket.id],
            host: socket.id,
            questions: [],
            currentQuestionIndex: -1,
            scores: { [socket.id]: 0 },
            answeredThisRound: new Set(),
            playerNames: {},
            playerDbIds: {},
        };
        socket.join(roomCode);
        callback({ roomCode });
        console.log(`Room created: ${roomCode}`);
    });
    socket.on('joinRoom', (roomCode, callback) => {
        const state = rooms[roomCode];
        if (state && state.players.length < 2) {
            state.players.push(socket.id);
            state.scores[socket.id] = 0;
            socket.join(roomCode);
            callback({ success: true });
            if (state.players.length === 2) {
                io.to(roomCode).emit('startGame', { roomCode });
            }
            console.log(`Socket ${socket.id} joined room ${roomCode}`);
        } else {
            callback({ success: false, message: 'Room full or does not exist' });
        }
    });
    socket.on('setPlayerName', (roomCode: string, name: string) => {
        const state = rooms[roomCode];
        if (!state) return;
        if (!state.players.includes(socket.id)) return;
        state.playerNames[socket.id] = String(name || '').slice(0, 80);
    });
    socket.on('setPlayerDbId', (roomCode: string, dbId: number) => {
        const state = rooms[roomCode];
        if (!state) return;
        if (!state.players.includes(socket.id)) return;
        state.playerDbIds[socket.id] = dbId;
    });
    socket.on('hostQuestions', (roomCode: string, questions: Question[]) => {
        const state = rooms[roomCode];
        if (!state) return;
        if (state.host !== socket.id) return; 
        state.questions = questions.slice(0, 10);
        state.currentQuestionIndex = -1;
        io.to(roomCode).emit('sendQuestions', state.questions);
        startNextRound(roomCode);
    });
    socket.on('submitAnswer', (roomCode: string, payload: { questionIndex: number; selectedIndex: number; answerTimeMs: number }) => {
        const state = rooms[roomCode];
        if (!state) return;
        const { questionIndex, selectedIndex, answerTimeMs } = payload;
        if (questionIndex !== state.currentQuestionIndex) return;
        if (state.answeredThisRound.has(socket.id)) return;
        const currentQuestion = state.questions[questionIndex];
        const isCorrect = selectedIndex === currentQuestion.answer;
        if (isCorrect) {
            const timeScore = Math.max(100, Math.floor(1000 * Math.exp(-Math.max(0, answerTimeMs) / 10000)));
            state.scores[socket.id] = (state.scores[socket.id] || 0) + timeScore;
        }
        state.answeredThisRound.add(socket.id);
        io.to(roomCode).emit('playerAnswered', { playerId: socket.id, isCorrect });
        if (state.answeredThisRound.size >= state.players.length) {
            clearCurrentTimer(state);
            finishRound(roomCode);
        }
    });
    socket.on('disconnect', () => {
        for (const roomCode of Object.keys(rooms)) {
            const state = rooms[roomCode];
            const idx = state.players.indexOf(socket.id);
            if (idx !== -1) {
                state.players.splice(idx, 1);
                delete state.scores[socket.id];
                state.answeredThisRound.delete(socket.id);
                if (state.players.length === 0) {
                    clearCurrentTimer(state);
                    delete rooms[roomCode];
                    console.log(`Room ${roomCode} deleted`);
                }
            }
        }
    });
});
httpsServer.listen(3001, () => {
    console.log('HTTPS Server with Socket.IO listening on port 3001');
});
function clearCurrentTimer(state: RoomState) {
    if (state.timer) {
        clearTimeout(state.timer);
        state.timer = undefined;
    }
}
async function startNextRound(roomCode: string) {
    const state = rooms[roomCode];
    if (!state) return;
    state.currentQuestionIndex += 1;
    state.answeredThisRound = new Set();
    if (state.currentQuestionIndex >= state.questions.length || state.currentQuestionIndex >= 10) {
        const players = Object.keys(state.scores);
        if (players.length === 2) {
            const player1Id = state.playerDbIds[players[0]];
            const player2Id = state.playerDbIds[players[1]];
            const player1Score = state.scores[players[0]];
            const player2Score = state.scores[players[1]];
            if (player1Id && player2Id) {
                console.log(`Game completed for room ${roomCode} - Player 1: ${player1Score}, Player 2: ${player2Score}`);
            }
        }
        const leaderboard = Object.entries(state.scores)
            .map(([playerId, score]) => ({ playerId, name: state.playerNames[playerId] || playerId, score }))
            .sort((a, b) => b.score - a.score);
        io.to(roomCode).emit('gameOver', { leaderboard });
        return;
    }
    const deadline = Date.now() + 15000; 
    state.roundDeadlineTs = deadline;
    io.to(roomCode).emit('questionStart', { index: state.currentQuestionIndex, deadline });
    clearCurrentTimer(state);
    state.timer = setTimeout(async () => {
        await finishRound(roomCode);
    }, 15000);
}
async function finishRound(roomCode: string) {
    const state = rooms[roomCode];
    if (!state) return;
    const index = state.currentQuestionIndex;
    const correctIndex = state.questions[index]?.answer;
    io.to(roomCode).emit('questionEnd', { index, correctIndex, scores: state.scores });
    await startNextRound(roomCode);
}
