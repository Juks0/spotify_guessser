import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { backendApiUrl } from '@/lib/urls/backendApiUrl.js';

const Navbar: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const fetchAuthStatus = async () => {
        try {
            const res = await fetch(`${backendApiUrl}/me`, {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setIsLoggedIn(Boolean(data?.authenticated || data?.id));
            } else {
                setIsLoggedIn(false);
            }
        } catch {
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        fetchAuthStatus();
        const interval = setInterval(fetchAuthStatus, 300000); // <= change it to 3000 ms later
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        await fetch(`${backendApiUrl}/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        setIsLoggedIn(false);
        window.location.reload();
    };

    const handleLogin = () => {
        window.location.href = `${backendApiUrl}/login`;
    };

    return (
        <nav style={{ padding: '1rem', background: '#282c34', display: 'flex', alignItems: 'center' }}>
            <NavLink
                to="/me"
                style={({ isActive }) => ({
                    marginRight: '1rem',
                    color: isActive ? 'yellow' : 'white',
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal'
                })}
            >
                Me
            </NavLink>
            <NavLink
                to="/top-artists"
                style={({ isActive }) => ({
                    marginRight: '1rem',
                    color: isActive ? 'yellow' : 'white',
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal'
                })}
            >
                Top Artists
            </NavLink>
            <NavLink
                to="/top-tracks"
                style={({ isActive }) => ({
                    color: isActive ? 'yellow' : 'white',
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal'
                })}
            >
                Top Tracks
            </NavLink>
            <NavLink
                to="/quiz-game"
                style={({ isActive }) => ({
                    color: isActive ? 'yellow' : 'white',
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal'
                })}
            >
                Quiz Game
            </NavLink>
            <div style={{ marginLeft: 'auto' }}>
                {isLoggedIn ? (
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
                        Zaloguj się przez Spotify
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
