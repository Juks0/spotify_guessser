import React, {useEffect, useMemo, useRef, useState} from 'react';
import {io, Socket} from 'socket.io-client';
import {serverBackendApiUrl} from "@/lib/urls/serverBackendApiUrl.ts";
import {backendApiUrl} from "@/lib/urls/backendApiUrl.js";
import {Artist} from "@/components/models/Artist.js";
import {SpotifyArtist} from "@/components/models/SpotifyData.js";

const backendApi = backendApiUrl;

interface Question {
    id: number;
    text: string;
    options: string[];
    answer: number;
}

const socket: Socket = io(serverBackendApiUrl, {
    secure: true,
    rejectUnauthorized: false, // Remove after setting proper SSL !!!
});
// const questions = [
//     { id: 1, text: "How many albums does this artist have?", options: ["3", "4", "5"], answer: 1 },
//     { id: 2, text: "Capital of France?", options: ["Berlin", "Paris", "Madrid"], answer: 1 },
// ];
type SimplifiedAlbum = { id: string; name: string; total_tracks: number };
type SimplifiedTrack = { id: string; name: string; albumId: string };

const fetchTopArtists = async (): Promise<Artist[]> => {
    const params = new URLSearchParams({
        time_range: "medium_term",
        limit: "50",
    });

    const response = await fetch(`${backendApi}/topartists?${params.toString()}`, {
        credentials: 'include'
    });
    const data = await response.json();

    if (!data.items || !Array.isArray(data.items)) {
        throw new Error("Invalid artists data");
    }

    return data.items.map((artistData: SpotifyArtist) => {
        const id = artistData.id;
        const name = artistData.name;
        const genres = artistData.genres || [];
        const popularity = artistData.popularity || 0;
        const image = artistData.images && artistData.images.length > 0 ? artistData.images[0].url : '';

        return new Artist(id, name, genres, popularity, image);
    });

};



const App: React.FC = () => {
    const [topArtists, setTopArtists] = useState<Artist[]>([]);
    const artistIdToAlbumsCache = useRef<Map<string, SimplifiedAlbum[]>>(new Map());
    const albumIdToTracksCache = useRef<Map<string, SimplifiedTrack[]>>(new Map());
    const [score, setScore] = useState(0);
    const answerStartTimeRef = useRef<number | null>(null);
    const [myId, setMyId] = useState<string>('');
    const [deadlineTs, setDeadlineTs] = useState<number | null>(null);
    const [nowTs, setNowTs] = useState<number>(Date.now());
    const [answered, setAnswered] = useState<boolean>(false);
    const [leaderboard, setLeaderboard] = useState<{ playerId: string; name?: string; score: number }[] | null>(null);
    const [displayName, setDisplayName] = useState<string>('');
    const [preGameCountdown, setPreGameCountdown] = useState<number>(0);
    const [roomCode, setRoomCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [inRoom, setInRoom] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [isCreator, setIsCreator] = useState(false);

    const [showQuiz, setShowQuiz] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        const onTick = () => setNowTs(Date.now());
        let interval: number | undefined;

        socket.on('connect', () => {
            setMyId(socket.id || '');
        });
        socket.on('startGame', ({ roomCode }) => {
            setStatusMessage(`Game starting...`);
            setShowQuiz(false);
            setPreGameCountdown(5);
            let c = 5;
            const countdownInterval = window.setInterval(() => {
                c -= 1;
                setPreGameCountdown(c);
                if (c <= 0) {
                    window.clearInterval(countdownInterval);
                    // Prepare questions and send to server (server accepts only from host)
                    prepareQuestions().then(built => {
                        if (built.length > 0) {
                            socket.emit('hostQuestions', roomCode, built);
                        }
                        setShowQuiz(true);
                        setStatusMessage(`Game started in room ${roomCode}`);
                    }).catch(console.error);
                }
            }, 1000);
        });

        socket.on('sendQuestions', (receivedQuestions: Question[]) => {
            setQuestions(receivedQuestions);
            setCurrentQuestionIndex(0);
        });

        socket.on('questionStart', ({ index, deadline }: { index: number; deadline: number }) => {
            setCurrentQuestionIndex(index);
            answerStartTimeRef.current = performance.now();
            setDeadlineTs(deadline);
            setAnswered(false);
            if (interval) window.clearInterval(interval);
            interval = window.setInterval(onTick, 200);
        });

        socket.on('questionEnd', ({ index, correctIndex, scores }: { index: number; correctIndex: number; scores: Record<string, number> }) => {
            setScore((myId && scores[myId]) ? scores[myId] : 0);
            if (interval) window.clearInterval(interval);
            setDeadlineTs(null);
        });

        socket.on('gameOver', ({ leaderboard }: { leaderboard: { playerId: string; name?: string; score: number }[] }) => {
            setStatusMessage('Game over');
            setShowQuiz(false);
            // Optionally show leaderboard in UI
            const sorted = [...leaderboard].sort((a, b) => b.score - a.score);
            setLeaderboard(sorted);
        });

        fetchTopArtists().
        then(setTopArtists).
        catch(console.error);

        return () => {
            socket.off('startGame');
            socket.off('sendQuestions');
            socket.off('questionStart');
            socket.off('questionEnd');
            socket.off('gameOver');
            socket.off('connect');
            if (interval) window.clearInterval(interval);
        };
    }, []);

    const pickRandom = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

    const fetchArtistAlbums = async (artistId: string): Promise<SimplifiedAlbum[]> => {
        const cached = artistIdToAlbumsCache.current.get(artistId);
        if (cached) return cached;
        const params = new URLSearchParams({ include_groups: 'album', limit: '12' });
        const res = await fetch(`${backendApi}/artistsalbums?id=${encodeURIComponent(artistId)}&${params.toString()}`, {
            credentials: 'include'
        });
        const data = await res.json();
        const albums: SimplifiedAlbum[] = (data.items || []).map((a: any) => ({ id: a.id, name: a.name, total_tracks: a.total_tracks }));
        artistIdToAlbumsCache.current.set(artistId, albums);
        return albums;
    };

    const fetchAlbumTracks = async (albumId: string): Promise<SimplifiedTrack[]> => {
        const cached = albumIdToTracksCache.current.get(albumId);
        if (cached) return cached;
        const res = await fetch(`${backendApi}/albumtracks?id=${encodeURIComponent(albumId)}&limit=50`, { credentials: 'include' });
        const data = await res.json();
        const tracks: SimplifiedTrack[] = (data.items || []).map((t: any) => ({ id: t.id, name: t.name, albumId }));
        albumIdToTracksCache.current.set(albumId, tracks);
        return tracks;
    };

    const prepareQuestions = async (): Promise<Question[]> => {
        try {
            let artists = topArtists;
            if (artists.length === 0) {
                artists = await fetchTopArtists();
                setTopArtists(artists);
            }

            const artistA = pickRandom(artists);
            const artistB = pickRandom(artists);
            const artistC = pickRandom(artists);

            const [albumsA] = await Promise.all([
                fetchArtistAlbums(artistA.id)
            ]);

            // 1. How many albums does this artist have?
            const q1Answer = albumsA.length;
            const q1Options = Array.from(new Set([
                q1Answer,
                Math.max(1, q1Answer - 1),
                q1Answer + 1,
                q1Answer + 2,
            ])).slice(0, 4).sort(() => Math.random() - 0.5);
            const q1CorrectIndex = q1Options.indexOf(q1Answer);

            // 2. Top track - artist
            const resTop = await fetch(`${backendApi}/artisttoptracks?id=${encodeURIComponent(artistB.id)}`, { credentials: 'include' });
            const topData = await resTop.json();
            const topTracks = (topData.tracks || []).slice(0, 4);
            const topTrackName = topTracks[0]?.name || 'Unknown';
            const topTrackOptions = topTracks.map((t: any) => t.name);
            const q2CorrectIndex = 0;

            // 3. Random track from random album for artistC
            const albumsC = await fetchArtistAlbums(artistC.id);
            const randomAlbumC = albumsC.length ? pickRandom(albumsC) : null;
            const tracksC = randomAlbumC ? await fetchAlbumTracks(randomAlbumC.id) : [];
            const randomTrackC = tracksC.length ? pickRandom(tracksC) : null;
            const trackName = randomTrackC?.name || 'Unknown';
            const albumOptions = [randomAlbumC?.name, ...albumsC.filter(a => a.id !== randomAlbumC?.id).slice(0, 3).map(a => a.name)]
                .filter(Boolean) as string[];
            while (albumOptions.length < 4 && albumsC.length > albumOptions.length) {
                const candidate = pickRandom(albumsC).name;
                if (!albumOptions.includes(candidate)) albumOptions.push(candidate);
            }
            const q3Options = albumOptions.slice(0, 4).sort(() => Math.random() - 0.5);
            const q3CorrectIndex = q3Options.indexOf(randomAlbumC?.name || '');

            // 4. Random album and count tracks for artistA again (or any artist)
            const randomAlbumA = albumsA.length ? pickRandom(albumsA) : null;
            const tracksA = randomAlbumA ? await fetchAlbumTracks(randomAlbumA.id) : [];
            const trackCount = tracksA.length || (randomAlbumA?.total_tracks ?? 0);
            const q4Options = Array.from(new Set([
                trackCount,
                Math.max(1, trackCount - 1),
                trackCount + 1,
                trackCount + 2,
            ])).slice(0, 4).sort(() => Math.random() - 0.5);
            const q4CorrectIndex = q4Options.indexOf(trackCount);

            const built: Question[] = [
                {
                    id: 1,
                    text: `How many albums does ${artistA.name} have?`,
                    options: q1Options.map(String),
                    answer: q1CorrectIndex
                },
                {
                    id: 2,
                    text: `Which is a top track by ${artistB.name}?`,
                    options: topTrackOptions,
                    answer: q2CorrectIndex
                },
                {
                    id: 3,
                    text: `Which album is the song "${trackName}" from?`,
                    options: q3Options,
                    answer: q3CorrectIndex
                },
                {
                    id: 4,
                    text: `How many tracks does the album "${randomAlbumA?.name || 'Unknown'}" have?`,
                    options: q4Options.map(String),
                    answer: q4CorrectIndex
                }
            ];

            return built;
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    const createRoom = () => {
        socket.emit('createRoom', ({ roomCode }: { roomCode: string }) => {
            setRoomCode(roomCode);
            setInRoom(true);
            setIsCreator(true);
            setStatusMessage(`Room created. Share this code with your friend: ${roomCode}`);
            if (displayName.trim()) {
                socket.emit('setPlayerName', roomCode, displayName.trim());
            }
        });
    };

    const joinRoom = () => {
        if (inputCode.trim() === '') {
            setStatusMessage('Please enter a room code');
            return;
        }
        socket.emit('joinRoom', inputCode.trim(), ({ success, message }: { success: boolean; message?: string }) => {
            if (success) {
                setRoomCode(inputCode.trim());
                setInRoom(true);
                setStatusMessage(`Joined room ${inputCode.trim()}. Waiting for the game to start...`);
                if (displayName.trim()) {
                    socket.emit('setPlayerName', inputCode.trim(), displayName.trim());
                }
            } else {
                setStatusMessage(message || 'Failed to join room');
            }
        });
    };

    const answerQuestion = (selectedIndex: number) => {
        const current = questions[currentQuestionIndex];
        const now = performance.now();
        const started = answerStartTimeRef.current ?? now;
        const elapsedMs = Math.max(0, now - started);
        if (answered) return;
        setAnswered(true);
        socket.emit('submitAnswer', roomCode, { questionIndex: currentQuestionIndex, selectedIndex, answerTimeMs: elapsedMs });
    };

    if (!inRoom) {
        // Show room creation/join UI
        return (
            <div style={{ padding: 20 }}>
                <h1>Socket.io 2-Player Game</h1>
                <button onClick={createRoom}>Create Room</button>
                <div style={{ marginTop: 20 }}>
                    <input
                        placeholder="Enter room code"
                        value={inputCode}
                        onChange={e => setInputCode(e.target.value)}
                    />
                    <button onClick={joinRoom}>Join Room</button>
                </div>
                <div style={{ marginTop: 12 }}>
                    <input
                        placeholder="Your display name (Spotify)"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                    />
                </div>
                <p>{statusMessage}</p>
            </div>
        );
    }

    if (!showQuiz && preGameCountdown > 0) {
        return (
            <div style={{ padding: 20 }}>
                <h2>Starting in {preGameCountdown}...</h2>
            </div>
        );
    }

    if (showQuiz && questions.length > 0) {
        // Show quiz questions UI
        const question = questions[currentQuestionIndex];
        if (!question) {
            return (
                <div style={{ padding: 20 }}>
                    <h2>Quiz finished! Thanks for playing.</h2>
                </div>
            );
        }
        const remainingSec = deadlineTs ? Math.max(0, Math.ceil((deadlineTs - nowTs) / 1000)) : 0;
        const disabled = answered || remainingSec <= 0;
        return (
            <div style={{ padding: 20 }}>
                <h2>{question.text}</h2>
                <p>Score: {score}</p>
                {deadlineTs && (
                    <p>Time left: {remainingSec}s</p>
                )}
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {question.options.map((option, i) => (
                        <li key={i} style={{ marginBottom: 10 }}>
                            <button onClick={() => answerQuestion(i)} disabled={disabled}>{option}</button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // Show leaderboard when game over
    if (inRoom && leaderboard) {
        return (
            <div style={{ padding: 20 }}>
                <h2>Leaderboard</h2>
                <ol>
                    {leaderboard.map((entry) => (
                        <li key={entry.playerId}>
                            {entry.playerId === myId ? (entry.name ? `${entry.name} (You)` : 'You') : (entry.name || entry.playerId)}: {entry.score}
                        </li>
                    ))}
                </ol>
                <p>{statusMessage}</p>
            </div>
        );
    }

    // Show waiting screen after room created/joined before quiz starts
    return (
        <div style={{ padding: 20 }}>
            <h1>Room: {roomCode}</h1>
            <p>{statusMessage}</p>
            <p>{isCreator ? 'You created this room. Waiting for the other player...' : 'You joined the room!'}</p>
        </div>
    );
};

export default App;
