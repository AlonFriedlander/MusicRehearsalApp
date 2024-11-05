import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      // Retrieve the token from sessionStorage
      const token = sessionStorage.getItem('token');

      // Send the request with the Authorization header
      const response = await axios.get(`http://localhost:5000/api/rehearsal/admin/search?q=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token
        },
      });

      // Navigate to the results page with the response data
      navigate('/admin/results', { state: { songs: response.data.songs } });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="admin-page">
      <h2>Search any song...</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter song name or artist"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default AdminPage;
