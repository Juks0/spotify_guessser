import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const error = params.get('error');

        if (error) {
            alert("Authentication error: " + error);
            navigate('/login');
            return;
        }

        navigate('/me');
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h1>Authentication in progress...</h1>
        </div>
    );
};

export default Callback;
