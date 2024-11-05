import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResultsPage.css';

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

      navigate('/admin/live');
    } catch (error) {
      console.error('Error selecting song:', error);
    }
  };

  return (
    <div className="results-page">
      <div className="results-container">
        <h2 className="results-title">Search Results</h2>
        <ul className="results-list">
          {state.songs.map((song, index) => (
            <li key={index} onClick={() => handleSelectSong(song)} className="results-item">
              <p className="song-title">{song.title}</p>
            </li>
          ))}
        </ul>
        <button className="return-button" onClick={() => navigate('/')}>
          Return to Main Page
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;
