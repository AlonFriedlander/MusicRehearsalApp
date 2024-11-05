import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to the backend

function PlayerPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for the song selection event from the admin
    socket.on('displaySong', () => {
      navigate('/player/live'); // Navigate to LivePage when song is selected
    });

    return () => {
      socket.off('displaySong');
    };
  }, [navigate]);

  return (
    <div className="player-page">
      <h2>Waiting for next song</h2>
    </div>
  );
}

export default PlayerPage;
