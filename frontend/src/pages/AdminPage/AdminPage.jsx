import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useValidateToken from '../../hooks/useValidateToken';
import './AdminPage.css';

function AdminPage() {
  useValidateToken();

  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useValidateToken(true);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/rehearsal/admin/search?q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate('/admin/results', { state: { songs: response.data.songs } });
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2 className="admin-title">Search for a Song</h2>
        <p className="admin-description">
          Enter a song name or artist below to begin.
        </p>

        <form onSubmit={handleSearch} className="admin-form">
          <input
            type="text"
            placeholder="Enter song name or artist"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="admin-input"
            required
          />
          <button type="submit" className="admin-search-button">
            Search
          </button>
        </form>

        <button className="admin-return-button" onClick={() => navigate('/')}>
          Return to Main Page
        </button>
      </div>
    </div>
  );
}

export default AdminPage;
