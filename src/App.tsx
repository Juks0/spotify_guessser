import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login.tsx';
import React from 'react';
import Callback from "@/components/Callback.js";
import * as fs from "node:fs";
import * as https from "node:https";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-svh flex-col items-center justify-center">
            <button onClick={() => navigate('/login')}>
                go to login
            </button>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/callback" element={<Callback/>} />
            </Routes>
        </Router>
    );
}

export default App;
