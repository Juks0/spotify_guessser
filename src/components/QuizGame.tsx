// import React, {useEffect, useState} from 'react';
// import {io, Socket} from 'socket.io-client';
// import {serverBackendApiUrl} from "@/lib/urls/serverBackendApiUrl.ts";
// import {backendApiUrl} from "@/lib/urls/backendApiUrl.js";
// import {Artist} from "@/components/models/Artist.js";
// import {SpotifyArtist} from "@/components/models/SpotifyData.js";
//
// const backendApi = backendApiUrl;
//
// interface Question {
//     id: number;
//     text: string;
//     options: string[];
//     answer: number;
// }
//
// const socket: Socket = io(serverBackendApiUrl, {
//     secure: true,
//     rejectUnauthorized: false, // Remove after setting proper SSL !!!
// });
// // const questions = [
// //     { id: 1, text: "How many albums does this artist have?", options: ["3", "4", "5"], answer: 1 },
// //     { id: 2, text: "Capital of France?", options: ["Berlin", "Paris", "Madrid"], answer: 1 },
// // ];
// const [topArtists, setTopArtists] = useState<Artist[]>([]);
//
// const fetchTopArtists = async (): Promise<Artist[]> => {
//     const params = new URLSearchParams({
//         time_range: "medium_term",
//         limit: "50",
//     });
//
//     const response = await fetch(`${backendApi}/topartists?${params.toString()}`, {
//         credentials: 'include'
//     });
//     const data = await response.json();
//
//     if (!data.items || !Array.isArray(data.items)) {
//         throw new Error("Invalid artists data");
//     }
//
//     return data.items.map((artistData: SpotifyArtist) => {
//         const id = artistData.id;
//         const name = artistData.name;
//         const genres = artistData.genres || [];
//         const popularity = artistData.popularity || 0;
//         const image = artistData.images && artistData.images.length > 0 ? artistData.images[0].url : '';
//
//         return new Artist(id, name, genres, popularity, image);
//     });
//
// };
//
//
//
// const App: React.FC = () => {
//     const [roomCode, setRoomCode] = useState('');
//     const [inputCode, setInputCode] = useState('');
//     const [inRoom, setInRoom] = useState(false);
//     const [statusMessage, setStatusMessage] = useState('');
//     const [isCreator, setIsCreator] = useState(false);
//
//     const [showQuiz, setShowQuiz] = useState(false);
//     const [questions, setQuestions] = useState<Question[]>([]);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//
//     useEffect(() => {
//         socket.on('startGame', ({ roomCode }) => {
//             setStatusMessage(`Game started in room ${roomCode}`);
//             setShowQuiz(true);
//         });
//
//         socket.on('sendQuestions', (receivedQuestions: Question[]) => {
//             setQuestions(receivedQuestions);
//             setCurrentQuestionIndex(0);
//         });
//
//         fetchTopArtists().
//         then(setTopArtists).
//         catch(console.error);
//
//         return () => {
//             socket.off('startGame');
//             socket.off('sendQuestions');
//         };
//     }, []);
//
//     const createRoom = () => {
//         socket.emit('createRoom', ({ roomCode }: { roomCode: string }) => {
//             setRoomCode(roomCode);
//             setInRoom(true);
//             setIsCreator(true);
//             setStatusMessage(`Room created. Share this code with your friend: ${roomCode}`);
//         });
//     };
//
//     const joinRoom = () => {
//         if (inputCode.trim() === '') {
//             setStatusMessage('Please enter a room code');
//             return;
//         }
//         socket.emit('joinRoom', inputCode.trim(), ({ success, message }: { success: boolean; message?: string }) => {
//             if (success) {
//                 setRoomCode(inputCode.trim());
//                 setInRoom(true);
//                 setStatusMessage(`Joined room ${inputCode.trim()}. Waiting for the game to start...`);
//             } else {
//                 setStatusMessage(message || 'Failed to join room');
//             }
//         });
//     };
//
//     const answerQuestion = (selectedIndex: number) => {
//         console.log(`Answered question ${currentQuestionIndex + 1} with option index ${selectedIndex}`);
//         // Add scoring or answer validation here as needed
//         setCurrentQuestionIndex(prev => prev + 1);
//     };
//
//     if (!inRoom) {
//         // Show room creation/join UI
//         return (
//             <div style={{ padding: 20 }}>
//                 <h1>Socket.io 2-Player Game</h1>
//                 <button onClick={createRoom}>Create Room</button>
//                 <div style={{ marginTop: 20 }}>
//                     <input
//                         placeholder="Enter room code"
//                         value={inputCode}
//                         onChange={e => setInputCode(e.target.value)}
//                     />
//                     <button onClick={joinRoom}>Join Room</button>
//                 </div>
//                 <p>{statusMessage}</p>
//             </div>
//         );
//     }
//
//     if (showQuiz && questions.length > 0) {
//         // Show quiz questions UI
//         const question = questions[currentQuestionIndex];
//         if (!question) {
//             return (
//                 <div style={{ padding: 20 }}>
//                     <h2>Quiz finished! Thanks for playing.</h2>
//                 </div>
//             );
//         }
//         return (
//             <div style={{ padding: 20 }}>
//                 <h2>{question.text}</h2>
//                 <ul style={{ listStyle: 'none', padding: 0 }}>
//                     {question.options.map((option, i) => (
//                         <li key={i} style={{ marginBottom: 10 }}>
//                             <button onClick={() => answerQuestion(i)}>{option}</button>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         );
//     }
//
//     // Show waiting screen after room created/joined before quiz starts
//     return (
//         <div style={{ padding: 20 }}>
//             <h1>Room: {roomCode}</h1>
//             <p>{statusMessage}</p>
//             <p>{isCreator ? 'You created this room. Waiting for the other player...' : 'You joined the room!'}</p>
//         </div>
//     );
// };
//
// export default App;
