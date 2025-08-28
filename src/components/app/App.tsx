// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Caallback from '../Callback';
// import React from 'react';
//
// import { useLocation } from 'react-router-dom';
//
// function Callback() {
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const code = queryParams.get('code');
//     const state = queryParams.get('state');
//
//
//     return <div>Processing login...</div>;
// }
//
//
// function App() {
//     return (
//         <Router>
//             <Routes>
//                 {/* inne trasy */}
//                 <Route path="/callback" element={<Callback />} />
//             </Routes>
//         </Router>
//     );
// }
// export default App;