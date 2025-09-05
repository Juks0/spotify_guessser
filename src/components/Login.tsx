import React from "react";
import {backendApiUrl} from "@/lib/urls/backendApiUrl.js";

const Login = () => {
    const handleLogin = () => {
        window.location.href = backendApiUrl+'/login';
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            {/*<h1>Logowanie do Spotify</h1>*/}
            <button onClick={handleLogin}>Zaloguj się przez Spotify</button>
        </div>
    );
};

export default Login;
