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
            <nav className="bg-slate-900 px-6 py-4 shadow-lg border-b border-slate-700">
                <div className="flex items-center justify-between">
                    <div className="text-white text-lg font-semibold">Loading...</div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-slate-900 px-6 py-4 shadow-lg border-b border-slate-700">
            <div className="flex items-center justify-between">
                {/* Logo/Brand */}
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <span className="text-white text-xl font-bold">Spotify Guesser</span>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-6">
                    <NavLink
                        to="/me"
                        onClick={handleNavClick}
                        className={({ isActive }) => 
                            `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                isActive 
                                    ? 'bg-green-600 text-white' 
                                    : isAuthenticated 
                                        ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                                        : 'text-slate-500 cursor-not-allowed'
                            }`
                        }
                    >
                        Me
                    </NavLink>
                    <NavLink
                        to="/top-artists"
                        onClick={handleNavClick}
                        className={({ isActive }) => 
                            `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                isActive 
                                    ? 'bg-green-600 text-white' 
                                    : isAuthenticated 
                                        ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                                        : 'text-slate-500 cursor-not-allowed'
                            }`
                        }
                    >
                        Top Artists
                    </NavLink>
                    <NavLink
                        to="/top-tracks"
                        onClick={handleNavClick}
                        className={({ isActive }) => 
                            `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                isActive 
                                    ? 'bg-green-600 text-white' 
                                    : isAuthenticated 
                                        ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                                        : 'text-slate-500 cursor-not-allowed'
                            }`
                        }
                    >
                        Top Tracks
                    </NavLink>
                    <NavLink
                        to="/quiz-game"
                        onClick={handleNavClick}
                        className={({ isActive }) => 
                            `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                isActive 
                                    ? 'bg-green-600 text-white' 
                                    : isAuthenticated 
                                        ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                                        : 'text-slate-500 cursor-not-allowed'
                            }`
                        }
                    >
                        Quiz Game
                    </NavLink>
                    
                </div>

                {/* Auth Button */}
                <div className="flex items-center">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="bg-transparent border border-slate-400 text-slate-300 hover:text-white hover:border-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border border-green-600 hover:border-green-700"
                        >
                            Login with Spotify
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden mt-4">
                <div className="flex flex-col space-y-2">
                    <NavLink
                        to="/me"
                        onClick={handleNavClick}
                        className={({ isActive }) => 
                            `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                isActive 
                                    ? 'bg-green-600 text-white' 
                                    : isAuthenticated 
                                        ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                                        : 'text-slate-500 cursor-not-allowed'
                            }`
                        }
                    >
                        Me
                    </NavLink>
                    <NavLink
                        to="/top-artists"
                        onClick={handleNavClick}
                        className={({ isActive }) => 
                            `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                isActive 
                                    ? 'bg-green-600 text-white' 
                                    : isAuthenticated 
                                        ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                                        : 'text-slate-500 cursor-not-allowed'
                            }`
                        }
                    >
                        Top Artists
                    </NavLink>
                    <NavLink
                        to="/top-tracks"
                        onClick={handleNavClick}
                        className={({ isActive }) => 
                            `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                isActive 
                                    ? 'bg-green-600 text-white' 
                                    : isAuthenticated 
                                        ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                                        : 'text-slate-500 cursor-not-allowed'
                            }`
                        }
                    >
                        Top Tracks
                    </NavLink>
                    <NavLink
                        to="/quiz-game"
                        onClick={handleNavClick}
                        className={({ isActive }) => 
                            `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                isActive 
                                    ? 'bg-green-600 text-white' 
                                    : isAuthenticated 
                                        ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                                        : 'text-slate-500 cursor-not-allowed'
                            }`
                        }
                    >
                        Quiz Game
                    </NavLink>
                   
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
