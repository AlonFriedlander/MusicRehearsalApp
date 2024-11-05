import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleSelectSong = async (song) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Selected song:', song); // Log the selected song data

      await axios.post(
        'http://localhost:5000/api/rehearsal/admin/select-song',
        { song },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        }
      );

      // Navigate to LivePage and pass the song data
      navigate('/admin/live', { state: { song } });
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
