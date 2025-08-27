import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';

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
            </Routes>
        </Router>
    );
}

export default App;
