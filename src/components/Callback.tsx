import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        const error = params.get('error');

        if (error) {
            alert("Authentication error: " + error);
            navigate('/login');
        } else if (access_token) {
            // !!!!!!!!!!!!!!!!!!!!!!! TO CHECK !!!!!!!!!!!!!!!!!!!!!!!
            localStorage.setItem('spotify_access_token', access_token);
            if (refresh_token) localStorage.setItem('spotify_refresh_token', refresh_token);
            navigate('/');
        } else {
            alert("Authentication failed: No tokens received");
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h1>Authentication in progress...</h1>
        </div>
    );
};

export default Callback;
