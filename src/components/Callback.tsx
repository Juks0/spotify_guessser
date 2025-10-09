import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        // Check for error in URL hash
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const error = params.get('error');
        
        if (error) {
            console.error("Authentication error:", error);
            alert("Authentication error: " + error);
            navigate('/');
            return;
        }
        
        // If no error, redirect to dashboard
        // The backend should have set the cookies, so we can proceed
        console.log("Authentication successful, redirecting to dashboard");
        navigate('/me');
    }, [navigate]);
    
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h1 className="text-foreground text-2xl font-semibold mb-2">Authentication in progress...</h1>
                <p className="text-muted-foreground">Please wait while we complete your login...</p>
            </div>
        </div>
    );
};

export default Callback;
