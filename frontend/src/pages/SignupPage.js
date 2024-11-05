import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [instrument, setInstrument] = useState('drums'); // Default to the first instrument
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if the user is signing up as admin based on the query parameter
  const isAdmin = location.search.includes('role=admin');

  const handleSignup = async (e) => {
    e.preventDefault();

    // Construct signup data
    const signupData = {
      username,
      password,
      instrument: isAdmin ? null : instrument, // No instrument for admin
      role: isAdmin ? 'admin' : 'user',
    };

    // Log signup data to verify
    console.log('Signup data:', signupData);

    try {
      await axios.post('http://localhost:5000/api/auth/register', signupData);
      console.log('Signup successful');
      navigate('/login'); // Redirect to the login page after successful signup
    } catch (error) {
      console.error(
        'Signup error:',
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="signup-page">
      <h2>{isAdmin ? 'Admin Signup' : 'Signup'}</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* Only show instrument selection if not an admin */}
        {!isAdmin && (
          <select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            required
          >
            <option value="drums">Drums</option>
            <option value="guitars">Guitars</option>
            <option value="bass">Bass</option>
            <option value="saxophone">Saxophone</option>
            <option value="keyboards">Keyboards</option>
            <option value="vocals">Vocals</option>
          </select>
        )}
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={() => navigate('/')}>Return to Main Page</button>
    </div>
  );
}

export default SignupPage;
