// PlayerPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to the backend

function PlayerPage() {
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('navigateToLivePage', () => {
      console.log(
        'Received navigateToLivePage event, redirecting to live page...'
      );
      navigate('/player/live'); // Navigate to LivePage when the admin selects a song
    });

    // Listen for the sessionEnded event to navigate back to PlayerPage
    socket.on('sessionEnded', () => {
      console.log('Received sessionEnded event, redirecting to player page...');
      navigate('/player'); // Redirect to PlayerPage
    });

    return () => {
      socket.off('navigateToLivePage');
      socket.off('sessionEnded'); // Clean up the sessionEnded listener
    };
  }, [navigate]);

  return (
    <div className="player-page">
      <h2>Waiting for next song</h2>
    </div>
  );
}

export default PlayerPage;
