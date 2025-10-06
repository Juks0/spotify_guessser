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
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h1 className="text-white text-2xl font-semibold">Loading...</h1>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <div className="container mx-auto px-6 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                            Spotify Analytics
                        </h1>
                        <p className="text-xl text-slate-300 mb-8">
                            Discover your music taste and explore your Spotify data
                        </p>
                    </div>

                    {isAuthenticated ? (
                        <div className="space-y-8">
                            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-white font-bold text-xl">✓</span>
                                    </div>
                                    <h2 className="text-2xl font-semibold">Welcome back!</h2>
                                </div>
                                <p className="text-slate-300 text-lg mb-6">
                                    🎉 You're logged in! Explore your music data below.
                                </p>
                            </div>

                            {/* Navigation Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <a 
                                    href="/me" 
                                    className="group bg-slate-800 hover:bg-slate-700 rounded-lg p-6 border border-slate-700 hover:border-green-500 transition-all duration-300 transform hover:scale-105"
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-400 transition-colors">
                                            <span className="text-white font-bold text-2xl">📊</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Music Dashboard</h3>
                                        <p className="text-slate-400 text-sm">View your music analytics</p>
                                    </div>
                                </a>

                                <a 
                                    href="/top-artists" 
                                    className="group bg-slate-800 hover:bg-slate-700 rounded-lg p-6 border border-slate-700 hover:border-green-500 transition-all duration-300 transform hover:scale-105"
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-400 transition-colors">
                                            <span className="text-white font-bold text-2xl">🎤</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Top Artists</h3>
                                        <p className="text-slate-400 text-sm">Your favorite artists</p>
                                    </div>
                                </a>

                                <a 
                                    href="/top-tracks" 
                                    className="group bg-slate-800 hover:bg-slate-700 rounded-lg p-6 border border-slate-700 hover:border-green-500 transition-all duration-300 transform hover:scale-105"
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-400 transition-colors">
                                            <span className="text-white font-bold text-2xl">🎵</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Top Tracks</h3>
                                        <p className="text-slate-400 text-sm">Your favorite songs</p>
                                    </div>
                                </a>

                                <a 
                                    href="/quiz-game" 
                                    className="group bg-slate-800 hover:bg-slate-700 rounded-lg p-6 border border-slate-700 hover:border-green-500 transition-all duration-300 transform hover:scale-105"
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-400 transition-colors">
                                            <span className="text-white font-bold text-2xl">🎮</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Quiz Game</h3>
                                        <p className="text-slate-400 text-sm">Test your music knowledge</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 mb-8">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-4xl">🔒</span>
                                    </div>
                                    <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
                                    <p className="text-slate-300 text-lg mb-8">
                                        Please log in to access your Spotify data and discover your music preferences!
                                    </p>
                                    <button 
                                        onClick={handleLogin}
                                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 border border-green-600 hover:border-green-700 transform hover:scale-105"
                                    >
                                        Login with Spotify
                                    </button>
                                </div>
                            </div>
                            
                            {/* Features Preview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white font-bold text-xl">📊</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                                    <p className="text-slate-400 text-sm">Deep insights into your music taste</p>
                                </div>
                                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white font-bold text-xl">🎵</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Discover</h3>
                                    <p className="text-slate-400 text-sm">Find your top artists and tracks</p>
                                </div>
                                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white font-bold text-xl">🎮</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Play</h3>
                                    <p className="text-slate-400 text-sm">Interactive music quizzes</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
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
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}
export default App;
