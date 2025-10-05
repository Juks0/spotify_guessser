import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.tsx';
import Callback from '@/components/Callback.tsx';
import { MusicDashboard } from '@/components/music-dashboard.tsx';
import { Layout } from './components/Layout.tsx';
import TopArtists from "@/components/TopArtists.js";
import TopTracks from "@/components/TopTracks.js";
import TrackDetailsWrapper from "@/assets/wrappers/TrackDetailsWrapper.tsx";
import ArtistDetailsWrapper from "@/assets/wrappers/ArtistDetailsWrapper.tsx";
import QuizGame from "@/components/QuizGame.tsx";
import Friends from './components/Friends.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';
function Home() {
    const { isAuthenticated, isLoading } = useAuth();
    const backendApiUrl = import.meta.env.VITE_BACKEND_URL;
    const handleLogin = () => {
        window.location.href = `${backendApiUrl}/login`;
    };
    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20%' }}>
                <h1>Loading...</h1>
            </div>
        );
    }
    return (
        <div style={{ textAlign: 'center', marginTop: '20%', padding: '2rem' }}>
            <h1>Welcome to the Spotify Analytics App</h1>
            {isAuthenticated ? (
                <div>
                    <p>🎉 You're logged in! Explore your music data below.</p>
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <a href="/me" style={{ 
                            display: 'inline-block',
                            padding: '12px 24px',
                            backgroundColor: '#1DB954', /* Spotify green background for Music Dashboard button */
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                        }}>
                            Music Dashboard
                        </a>
                        <a href="/top-artists" style={{ 
                            display: 'inline-block',
                            padding: '12px 24px',
                            backgroundColor: '#1DB954', /* Spotify green background for Top Artists button */
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                        }}>
                            Top Artists
                        </a>
                        <a href="/top-tracks" style={{ 
                            display: 'inline-block',
                            padding: '12px 24px',
                            backgroundColor: '#1DB954', /* Spotify green background for Top Tracks button */
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                        }}>
                            Top Tracks
                        </a>
                        <a href="/quiz-game" style={{ 
                            display: 'inline-block',
                            padding: '12px 24px',
                            backgroundColor: '#1DB954', /* Spotify green background for Quiz Game button */
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                        }}>
                            Quiz Game
                        </a>
                    </div>
                </div>
            ) : (
                <div>
                    <p>🔒 Please log in to access your Spotify data and discover your music preferences!</p>
                    <button 
                        onClick={handleLogin}
                        style={{
                            backgroundColor: '#1DB954', /* Spotify green background for Login button */
                            color: 'white',
                            border: 'none',
                            padding: '16px 32px',
                            borderRadius: '8px',
                            fontSize: '18px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            marginTop: '2rem'
                        }}
                    >
                        Login with Spotify
                    </button>
                </div>
            )}
        </div>
    );
}
function App() {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Routes without layout (login, callback) */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/callback" element={<Callback />} />
                        
                        {/* Routes with layout */}
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="me" element={
                                <ProtectedRoute>
                                    <MusicDashboard backendUrl={import.meta.env.VITE_BACKEND_URL} />
                                </ProtectedRoute>
                            } />
                            <Route path="md" element={
                                <ProtectedRoute>
                                    <MusicDashboard backendUrl={import.meta.env.VITE_BACKEND_URL} />
                                </ProtectedRoute>
                            } />
                            <Route path="top-artists" element={
                                <ProtectedRoute>
                                    <TopArtists />
                                </ProtectedRoute>
                            } />
                            <Route path="top-tracks" element={
                                <ProtectedRoute>
                                    <TopTracks />
                                </ProtectedRoute>
                            } />
                            <Route path="track-details/:trackId" element={
                                <ProtectedRoute>
                                    <TrackDetailsWrapper />
                                </ProtectedRoute>
                            } />
                            <Route path="artist-details/:artistId" element={
                                <ProtectedRoute>
                                    <ArtistDetailsWrapper />
                                </ProtectedRoute>
                            } />
                            <Route path="quiz-game" element={
                                <ProtectedRoute>
                                    <QuizGame />
                                </ProtectedRoute>
                            } />
                            <Route path="friends" element={
                                <ProtectedRoute>
                                    <Friends />
                                </ProtectedRoute>
                            } />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}
export default App;
