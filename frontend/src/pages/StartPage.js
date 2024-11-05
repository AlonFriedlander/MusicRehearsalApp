import React from 'react';
import { useNavigate } from 'react-router-dom';

function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="start-page">
      <h1>Welcome to JaMoveo</h1>
      <button onClick={() => navigate('/signup')}>Sign Up</button>
      <button onClick={() => navigate('/login')}>Login</button>
      <button onClick={() => navigate('/signup?role=admin')}>Sign Up as Admin</button>
      <button onClick={() => navigate('/login?role=admin')}>Login as Admin</button>
    </div>
  );
}

export default StartPage;
