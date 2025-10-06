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
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h1 className="text-foreground text-2xl font-semibold">Loading...</h1>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-6 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Spotify Analytics
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Discover your music taste and explore your Spotify data
                        </p>
                    </div>

                    {isAuthenticated ? (
                        <div className="space-y-8">
                            <div className="bg-card rounded-lg p-6 border border-border">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                                        <span className="text-primary-foreground font-bold text-xl">✓</span>
                                    </div>
                                    <h2 className="text-2xl font-semibold text-card-foreground">Welcome back!</h2>
                                </div>
                                <p className="text-muted-foreground text-lg mb-6">
                                    🎉 You're logged in! Explore your music data below.
                                </p>
                            </div>

                            {/* Navigation Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <a 
                                    href="/me" 
                                    className="group bg-card hover:bg-accent rounded-lg p-6 border border-border hover:border-primary transition-all duration-300 transform hover:scale-105"
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/80 transition-colors">
                                            <span className="text-primary-foreground font-bold text-2xl">📊</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 text-card-foreground">Music Dashboard</h3>
                                        <p className="text-muted-foreground text-sm">View your music analytics</p>
                                    </div>
                                </a>

                                <a 
                                    href="/top-artists" 
                                    className="group bg-card hover:bg-accent rounded-lg p-6 border border-border hover:border-primary transition-all duration-300 transform hover:scale-105"
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/80 transition-colors">
                                            <span className="text-primary-foreground font-bold text-2xl">🎤</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 text-card-foreground">Top Artists</h3>
                                        <p className="text-muted-foreground text-sm">Your favorite artists</p>
                                    </div>
                                </a>

                                <a 
                                    href="/top-tracks" 
                                    className="group bg-card hover:bg-accent rounded-lg p-6 border border-border hover:border-primary transition-all duration-300 transform hover:scale-105"
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/80 transition-colors">
                                            <span className="text-primary-foreground font-bold text-2xl">🎵</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 text-card-foreground">Top Tracks</h3>
                                        <p className="text-muted-foreground text-sm">Your favorite songs</p>
                                    </div>
                                </a>

                                <a 
                                    href="/quiz-game" 
                                    className="group bg-card hover:bg-accent rounded-lg p-6 border border-border hover:border-primary transition-all duration-300 transform hover:scale-105"
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/80 transition-colors">
                                            <span className="text-primary-foreground font-bold text-2xl">🎮</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 text-card-foreground">Quiz Game</h3>
                                        <p className="text-muted-foreground text-sm">Test your music knowledge</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-card rounded-lg p-8 border border-border mb-8">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-4xl">🔒</span>
                                    </div>
                                    <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Get Started</h2>
                                    <p className="text-muted-foreground text-lg mb-8">
                                        Please log in to access your Spotify data and discover your music preferences!
                                    </p>
                                    <button 
                                        onClick={handleLogin}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 border border-primary hover:border-primary/90 transform hover:scale-105"
                                    >
                                        Login with Spotify
                                    </button>
                                </div>
                            </div>
                            
                            {/* Features Preview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div className="bg-card rounded-lg p-6 border border-border">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-primary-foreground font-bold text-xl">📊</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-card-foreground">Analytics</h3>
                                    <p className="text-muted-foreground text-sm">Deep insights into your music taste</p>
                                </div>
                                <div className="bg-card rounded-lg p-6 border border-border">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-primary-foreground font-bold text-xl">🎵</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-card-foreground">Discover</h3>
                                    <p className="text-muted-foreground text-sm">Find your top artists and tracks</p>
                                </div>
                                <div className="bg-card rounded-lg p-6 border border-border">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-primary-foreground font-bold text-xl">🎮</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-card-foreground">Play</h3>
                                    <p className="text-muted-foreground text-sm">Interactive music quizzes</p>
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
