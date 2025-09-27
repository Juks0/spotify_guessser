import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
const backendApiUrl = import.meta.env.VITE_BACKEND_URL;
interface ProtectedRouteProps {
    children: React.ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${backendApiUrl}/me`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setIsAuthenticated(Boolean(data?.authenticated || data?.id));
                } else {
                    setIsAuthenticated(false);
                }
            } catch {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);
    if (loading) {
        return (
            <div style={{ 
                textAlign: 'center', 
                marginTop: '20%',
                fontSize: '18px'
            }}>
                Loading...
            </div>
        );
    }
    if (!isAuthenticated) {
        return (
            <div style={{ 
                textAlign: 'center', 
                marginTop: '20%',
                padding: '2rem'
            }}>
                <h2>🔒 Authentication Required</h2>
                <p>You need to be logged in to access this feature.</p>
                <button 
                    onClick={() => window.location.href = `${backendApiUrl}/login`}
                    style={{
                        backgroundColor: '#1DB954',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginTop: '1rem'
                    }}
                >
                    Login with Spotify
                </button>
            </div>
        );
    }
    return <>{children}</>;
};
export default ProtectedRoute;
