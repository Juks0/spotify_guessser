import React from "react";

const Login = () => {
    const handleLogin = () => {
        window.location.href = 'https://192.168.1.119:8888/login';
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            {/*<h1>Logowanie do Spotify</h1>*/}
            <button onClick={handleLogin}>Zaloguj się przez Spotify</button>
        </div>
    );
};

export default Login;
