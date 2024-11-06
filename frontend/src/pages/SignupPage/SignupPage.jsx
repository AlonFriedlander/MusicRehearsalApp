import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './SignupPage.css';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [instrument, setInstrument] = useState(''); // Set default to empty
  const [errorMessage, setErrorMessage] = useState(''); // Add state for error message
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if the user is signing up as admin based on the query parameter
  const isAdmin = location.search.includes('role=admin');

  const handleSignup = async (e) => {
    e.preventDefault();

    const signupData = {
      username,
      password,
      instrument: isAdmin ? null : instrument, // No instrument for admin
      role: isAdmin ? 'admin' : 'user',
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/register`,
        signupData
      );
      console.log('Signup successful');
      navigate('/login'); // Redirect to the login page after successful signup
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('Signup error:', message);
      setErrorMessage(message); // Set the error message to display it in the form
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-content">
        <h2>{isAdmin ? 'Admin Signup' : 'User Signup'}</h2>
        <p className="tagline">
          {isAdmin
            ? 'Join JaMoveo as an administrator.'
            : 'Join JaMoveo and select your instrument!'}
        </p>
        {errorMessage && <p className="error-message">{errorMessage}</p>}{' '}
        {/* Display error message if it exists */}
        <form onSubmit={handleSignup} className="signup-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isAdmin && (
            <div className="input-group">
              <label>Instrument</label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                required
              >
                <option value="" disabled>
                  Choose Instrument
                </option>
                <option value="drums">Drums</option>
                <option value="guitars">Guitars</option>
                <option value="bass">Bass</option>
                <option value="saxophone">Saxophone</option>
                <option value="keyboards">Keyboards</option>
                <option value="vocals">Vocals</option>
              </select>
            </div>
          )}

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <button className="back-button" onClick={() => navigate('/')}>
          Return to Main Page
        </button>
      </div>
    </div>
  );
}

export default SignupPage;
