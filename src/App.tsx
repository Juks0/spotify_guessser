import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login.tsx';
import Callback from '@/components/Callback.tsx';
import Me from '@/components/Me.tsx';
import Navbar from '@/components/Navbar.tsx';
import TopArtists from "@/components/TopArtists.js";
import TopTracks from "@/components/TopTracks.js"; // dopasuj ścieżkę

function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-svh flex-col items-center justify-center">
            <button onClick={() => navigate('/login')}>
                go to login
            </button>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/me" element={<Me />} />
                <Route path="/top-artists" element={<TopArtists/>} />
                <Route path="/top-tracks" element={<TopTracks/>} />
            </Routes>
        </Router>
    );
}

export default App;
