import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartPage from './pages/StartPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import PlayerPage from './pages/PlayerPage';
import AdminPage from './pages/AdminPage';
import ResultsPage from './pages/ResultsPage';
import LivePage from './pages/LivePage';

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
