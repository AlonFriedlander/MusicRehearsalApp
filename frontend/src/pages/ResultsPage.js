// ResultsPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleSelectSong = async (song) => {
    try {
      const token = sessionStorage.getItem('token');
      console.log('Selected song:', song);

      await axios.post(
        'http://localhost:5000/api/rehearsal/admin/select-song',
        { song },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Navigate to LivePage
      navigate('/admin/live');
    } catch (error) {
      console.error('Error selecting song:', error);
    }
  };

  return (
    <div className="results-page">
      <h2>Search Results</h2>
      <ul>
        {state.songs.map((song, index) => (
          <li key={index} onClick={() => handleSelectSong(song)}>
            <p>{song.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResultsPage;
