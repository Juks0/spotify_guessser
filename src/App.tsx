import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.tsx';
import Callback from '@/components/Callback.tsx';
import Me from '@/components/Me.tsx';
import Navbar from '@/components/Navbar.tsx';
import TopArtists from "@/components/TopArtists.js";
import TopTracks from "@/components/TopTracks.js";
import TrackDetailsWrapper from "@/assets/wrappers/TrackDetailsWrapper.tsx";
import ArtistDetailsWrapper from "@/assets/wrappers/ArtistDetailsWrapper.tsx";
// import QuizGame from "@/components/QuizGame.tsx";

function Home() {

    return (
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
            <h1>Welcome to the Spotify Analytics App</h1>
            <p>Discover your top artists and tracks!</p>

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
                <Route path="/track-details/:trackId" element={<TrackDetailsWrapper />} />
                <Route path="/artist-details/:artistId" element={<ArtistDetailsWrapper />} />
                {/*<Route path="/quiz-game/" element={<QuizGame />} />*/}


            </Routes>
        </Router>
    );
}

export default App;
