import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResultsPage.css';
import useValidateToken from '../../hooks/useValidateToken';

function ResultsPage() {
  useValidateToken();

  const { state } = useLocation();
  const navigate = useNavigate();

  useValidateToken(true);

  const handleSelectSong = async (song) => {
    try {
      const token = sessionStorage.getItem('token');
      console.log('Selected song:', song);

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/rehearsal/admin/select-song`,
        { song },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate('/admin/live', { state: { hash: res.data.hash } });
    } catch (error) {
      console.error('Error selecting song:', error);
    }
  };

  return (
    <div className="results-page">
      <div className="results-container">
        <h2 className="results-title">Search Results</h2>

        {!state?.songs || state.songs.length === 0 ? (
          <div className="no-results">
            <p>No songs found.</p>
            <button
              className="try-again-button"
              onClick={() => navigate('/admin')}
            >
              Try Again
            </button>
          </div>
        ) : (
          <ul className="results-list">
            {state.songs.map((song, index) => (
              <li
                key={index}
                onClick={() => handleSelectSong(song)}
                className="results-item"
              >
                <p className="song-title">{song.title}</p>
              </li>
            ))}
          </ul>
        )}

        <button className="return-button" onClick={() => navigate('/')}>
          Return to Main Page
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;
