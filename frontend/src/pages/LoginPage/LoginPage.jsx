import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { username, password }
      );

      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));

      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/player');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Server error');
    }
  };

  useEffect(() => {
    // const token = sessionStorage.getItem('token');
    // if (token) {
    const tryToLoginWithToken = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/auth/validate-token', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          sessionStorage.setItem('user', JSON.stringify(response.data.user));
          console.log(response.data)
          if (response.data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/player');
          }
        }
      } catch (error) {
        console.error('Token validation error:', error);
      }
    }
    tryToLoginWithToken();
  }, [])

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              className="login-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button submit">
            Log In
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <button className="login-button return" onClick={() => navigate('/')}>
          Return to Main Page
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
