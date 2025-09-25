import React, {useEffect, useMemo, useRef, useState} from 'react';
import {io, Socket} from 'socket.io-client';
import {Artist} from "@/components/models/Artist.js";
import {SpotifyArtist} from "@/components/models/SpotifyData.js";

const backendApiUrl = import.meta.env.VITE_BACKEND_URL;
const serverBackendApiUrl = import.meta.env.SERVER_BACKEND_URL;

interface Question {
    id: number;
    text: string;
    options: string[];
    answer: number;
    imageUrl?: string;
}

const socket: Socket = io(serverBackendApiUrl, {
    secure: true,
});

type SimplifiedAlbum = { id: string; name: string; total_tracks: number; image?: string };
type SimplifiedTrack = { id: string; name: string; albumId: string };

const fetchTopArtists = async (): Promise<Artist[]> => {
    const params = new URLSearchParams({
        time_range: "medium_term",
        limit: "50",
    });

    const response = await fetch(`${backendApiUrl}/topartists?${params.toString()}`, {
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
    const [dbUserId, setDbUserId] = useState<number | null>(null);
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
            console.log('Socket connected with ID:', socket.id);
            setMyId(socket.id || '');
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            setStatusMessage('Connection lost. Please refresh the page.');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setStatusMessage('Connection failed. Please check your internet connection.');
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
            interval = window.setInterval(onTick, 10000);
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

        // Get user's database ID and username
        fetch(`${backendApiUrl}/me`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.db_user_id) {
                    setDbUserId(data.db_user_id);
                }
                if (data.db_username) {
                    setDisplayName(data.db_username);
                }
            })
            .catch(console.error);

        return () => {
            socket.off('startGame');
            socket.off('sendQuestions');
            socket.off('questionStart');
            socket.off('questionEnd');
            socket.off('gameOver');
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            if (interval) window.clearInterval(interval);
        };
    }, []);

    const pickRandom = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

    const fetchArtistAlbums = async (artistId: string): Promise<SimplifiedAlbum[]> => {
        const cached = artistIdToAlbumsCache.current.get(artistId);
        if (cached) return cached;
        const params = new URLSearchParams({ include_groups: 'album', limit: '12' });
        const res = await fetch(`${backendApiUrl}/artistsalbums?id=${encodeURIComponent(artistId)}&${params.toString()}`, {
            credentials: 'include'
        });
        const data = await res.json();
        const albums: SimplifiedAlbum[] = (data.items || []).map((a: any) => ({ id: a.id, name: a.name, total_tracks: a.total_tracks, image: a.images && a.images[0] ? a.images[0].url : undefined }));
        artistIdToAlbumsCache.current.set(artistId, albums);
        return albums;
    };

    const fetchAlbumTracks = async (albumId: string): Promise<SimplifiedTrack[]> => {
        const cached = albumIdToTracksCache.current.get(albumId);
        if (cached) return cached;
        const res = await fetch(`${backendApiUrl}/albumtracks?id=${encodeURIComponent(albumId)}&limit=50`, { credentials: 'include' });
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
            const resTop = await fetch(`${backendApiUrl}/artisttoptracks?id=${encodeURIComponent(artistB.id)}`, { credentials: 'include' });
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
                    answer: q1CorrectIndex,
                    imageUrl: artistA.image
                },
                {
                    id: 2,
                    text: `Which is a top track by ${artistB.name}?`,
                    options: topTrackOptions,
                    answer: q2CorrectIndex,
                    imageUrl: artistB.image
                },
                {
                    id: 3,
                    text: `Which album is the song "${trackName}" from?`,
                    options: q3Options,
                    answer: q3CorrectIndex,
                    imageUrl: randomAlbumC?.image
                },
                {
                    id: 4,
                    text: `How many tracks does the album "${randomAlbumA?.name || 'Unknown'}" have?`,
                    options: q4Options.map(String),
                    answer: q4CorrectIndex,
                    imageUrl: randomAlbumA?.image
                }
            ];

            return built;
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    const createRoom = () => {
        setStatusMessage('Creating room...');
        console.log('Attempting to create room...');
        console.log('Socket connected:', socket.connected);
        console.log('Socket ID:', socket.id);
        
        // Add timeout to detect if callback never comes
        const timeout = setTimeout(() => {
            setStatusMessage('Failed to create room - server timeout. Please try again.');
            console.error('Room creation timeout - server did not respond');
        }, 10000);
        
        socket.emit('createRoom', ({ roomCode }: { roomCode: string }) => {
            clearTimeout(timeout);
            console.log('Room created successfully:', roomCode);
            setRoomCode(roomCode);
            setInRoom(true);
            setIsCreator(true);
            setStatusMessage(`Room created. Share this code with your friend: ${roomCode}`);
            
            // Automatically set player name from database
            if (displayName.trim()) {
                socket.emit('setPlayerName', roomCode, displayName.trim());
            }
            if (dbUserId) {
                socket.emit('setPlayerDbId', roomCode, dbUserId);
            }
        });
    };

    const joinRoom = () => {
        if (inputCode.trim() === '') {
            setStatusMessage('Please enter a room code');
            return;
        }
        
        setStatusMessage('Joining room...');
        console.log('Attempting to join room:', inputCode.trim());
        
        socket.emit('joinRoom', inputCode.trim(), ({ success, message }: { success: boolean; message?: string }) => {
            console.log('Join room response:', { success, message });
            if (success) {
                setRoomCode(inputCode.trim());
                setInRoom(true);
                setStatusMessage(`Joined room ${inputCode.trim()}. Waiting for the game to start...`);
                // Automatically set player name from database
                if (displayName.trim()) {
                    socket.emit('setPlayerName', inputCode.trim(), displayName.trim());
                }
                if (dbUserId) {
                    socket.emit('setPlayerDbId', inputCode.trim(), dbUserId);
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
                {displayName && (
                    <p>Playing as: <strong>{displayName}</strong></p>
                )}
                <p>Socket Status: {socket.connected ? '✅ Connected' : '❌ Disconnected'}</p>
                
                <button 
                    onClick={createRoom}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Create Room
                </button>
                
                <div style={{ marginTop: 20 }}>
                    <input
                        placeholder="Enter room code"
                        value={inputCode}
                        onChange={e => setInputCode(e.target.value)}
                        style={{ padding: '8px', marginRight: '10px' }}
                    />
                    <button 
                        onClick={joinRoom}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Join Room
                    </button>
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
                {/* Score and Progress Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '20px',
                    padding: '10px 15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                            Score: {score}
                        </span>
                        <span style={{ fontSize: '14px', color: '#6c757d' }}>
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                    </div>
                    {deadlineTs && (
                        <span style={{ 
                            fontSize: '16px', 
                            fontWeight: 'bold',
                            color: remainingSec <= 5 ? '#dc3545' : '#007bff'
                        }}>
                            Time: {remainingSec}s
                        </span>
                    )}
                </div>

                <h2 style={{ marginBottom: '20px' }}>{question.text}</h2>
                
                {question.imageUrl && (
                    <div style={{ margin: '20px 0' }}>
                        <img src={question.imageUrl} alt="question" style={{ maxWidth: 240, borderRadius: 8 }} />
                    </div>
                )}
                
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {question.options.map((option, i) => (
                        <li key={i} style={{ marginBottom: 12 }}>
                            <button 
                                onClick={() => answerQuestion(i)} 
                                disabled={disabled}
                                style={{
                                    width: '100%',
                                    padding: '12px 20px',
                                    fontSize: '16px',
                                    border: '2px solid #007bff',
                                    borderRadius: '8px',
                                    backgroundColor: disabled ? '#f8f9fa' : '#ffffff',
                                    color: disabled ? '#6c757d' : '#007bff',
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {option}
                            </button>
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
            {displayName && (
                <p>Playing as: <strong>{displayName}</strong></p>
            )}
            <p>{statusMessage}</p>
            <p>{isCreator ? 'You created this room. Waiting for the other player...' : 'You joined the room!'}</p>
        </div>
    );
};

export default App;
