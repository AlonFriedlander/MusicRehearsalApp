import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StartPage.css'; // Import the CSS file

function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="start-page">
      <div className="content">
        <h1>Welcome to JaMoveo</h1>
        <p className="tagline">Your music rehearsal space companion</p>
        
        <div className="button-group">
          <button className="primary-button" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
          <button className="secondary-button" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
        
        <div className="button-group">
          <button className="admin-button" onClick={() => navigate('/signup?role=admin')}>
            Sign Up as Admin
          </button>
          <button className="admin-button" onClick={() => navigate('/login?role=admin')}>
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartPage;
