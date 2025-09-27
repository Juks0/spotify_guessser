import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
const backendApiUrl = import.meta.env.VITE_BACKEND_URL;
const Navbar: React.FC = () => {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const handleLogout = async () => {
        await logout();
    };
    const handleLogin = () => {
        window.location.href = `${backendApiUrl}/login`;
    };
    const handleNavClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            alert('Please log in to access this feature.');
        }
    };
    if (isLoading) {
        return (
            <nav style={{ padding: '1rem', background: '#282c34', display: 'flex', alignItems: 'center' }}>
                <div style={{ color: 'white' }}>Loading...</div>
            </nav>
        );
    }
    return (
        <nav style={{ padding: '1rem', background: '#282c34', display: 'flex', alignItems: 'center' }}>
            <NavLink
                to="/me"
                onClick={handleNavClick}
                style={({ isActive }) => ({
                    marginRight: '1rem',
                    color: isActive ? 'yellow' : (isAuthenticated ? 'white' : '#666'),
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal',
                    cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                    opacity: isAuthenticated ? 1 : 0.5
                })}
            >
                Me
            </NavLink>
            <NavLink
                to="/top-artists"
                onClick={handleNavClick}
                style={({ isActive }) => ({
                    marginRight: '1rem',
                    color: isActive ? 'yellow' : (isAuthenticated ? 'white' : '#666'),
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal',
                    cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                    opacity: isAuthenticated ? 1 : 0.5
                })}
            >
                Top Artists
            </NavLink>
            <NavLink
                to="/top-tracks"
                onClick={handleNavClick}
                style={({ isActive }) => ({
                    marginRight: '1rem',
                    color: isActive ? 'yellow' : (isAuthenticated ? 'white' : '#666'),
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal',
                    cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                    opacity: isAuthenticated ? 1 : 0.5
                })}
            >
                Top Tracks
            </NavLink>
            <NavLink
                to="/quiz-game"
                onClick={handleNavClick}
                style={({ isActive }) => ({
                    marginRight: '1rem',
                    color: isActive ? 'yellow' : (isAuthenticated ? 'white' : '#666'),
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal',
                    cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                    opacity: isAuthenticated ? 1 : 0.5
                })}
            >
                Quiz Game
            </NavLink>
            <NavLink
                to="/friends"
                onClick={handleNavClick}
                style={({ isActive }) => ({
                    color: isActive ? 'yellow' : (isAuthenticated ? 'white' : '#666'),
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal',
                    cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                    opacity: isAuthenticated ? 1 : 0.5
                })}
            >
                Friends
            </NavLink>
            <div style={{ marginLeft: 'auto' }}>
                {isAuthenticated ? (
                    <button
                        onClick={handleLogout}
                        style={{
                            color: 'white',
                            background: 'transparent',
                            border: '1px solid white',
                            padding: '0.25rem 0.75rem',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                        }}
                    >
                        Logout
                    </button>
                ) : (
                    <button
                        onClick={handleLogin}
                        style={{
                            color: 'white',
                            background: 'transparent',
                            border: '1px solid #1DB954',
                            padding: '0.25rem 0.75rem',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                        }}
                    >
                        Login with Spotify
                    </button>
                )}
            </div>
        </nav>
    );
};
export default Navbar;
