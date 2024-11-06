import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartPage from './pages/StartPage/StartPage';
import SignupPage from './pages/SignupPage/SignupPage';
import LoginPage from './pages/LoginPage/LoginPage';
import PlayerPage from './pages/PlayerPage/PlayerPage';
import AdminPage from './pages/AdminPage/AdminPage';
import ResultsPage from './pages/ResultsPage/ResultsPage';
import LivePage from './pages/LivePage/LivePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/results" element={<ResultsPage />} />
        <Route path="/admin/live" element={<LivePage />} />
        <Route path="/player/live" element={<LivePage />} />
      </Routes>
    </Router>
  );
}

export default App;
