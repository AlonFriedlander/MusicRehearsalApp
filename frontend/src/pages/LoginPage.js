import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset any previous error message

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      
      // Save the token in localStorage or sessionStorage
      localStorage.setItem('token', response.data.token);

      console.log("Login successful:", response.data);
      
      // Redirect based on user role
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/player');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Log In</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => navigate('/')}>Return to Main Page</button>
    </div>
  );
}

export default LoginPage;
