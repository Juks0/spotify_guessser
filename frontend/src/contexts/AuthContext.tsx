import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
const backendApiUrl = import.meta.env.VITE_BACKEND_URL;
interface AuthContextType {
    isAuthenticated: boolean | null;
    isLoading: boolean;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
interface AuthProviderProps {
    children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
            setIsLoading(false);
        }
    };
    const logout = async () => {
        try {
            await fetch(`${backendApiUrl}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsAuthenticated(false);
            window.location.reload();
        }
    };
    useEffect(() => {
        checkAuth();
        const interval = setInterval(checkAuth, 300000);
        return () => clearInterval(interval);
    }, []);
    const value = {
        isAuthenticated,
        isLoading,
        checkAuth,
        logout,
    };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
