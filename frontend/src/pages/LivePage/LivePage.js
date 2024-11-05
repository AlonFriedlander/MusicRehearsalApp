// LivePage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './LivePage.css'; // Import the CSS file for styles

const socket = io('http://localhost:5000'); // Connect to the backend

function LivePage() {
  const [song, setSong] = useState({
    title: 'No song selected',
    artist: '',
    lyrics: [],
  });
  const navigate = useNavigate();
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Get token and user from sessionStorage
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';
  const isSinger = user?.instrument === 'vocals';

  // Fetch the latest song from the backend
  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/rehearsal/live/song',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSong(response.data.song);
      } catch (error) {
        console.error('Error fetching song:', error);
        setSong({ title: 'No song selected', artist: '', lyrics: [] });
      }
    };

    if (token) fetchSong();
  }, [token]);

  useEffect(() => {
    if (isScrolling) {
      scrollIntervalRef.current = setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop += 1;
        }
      }, 50);
    } else {
      clearInterval(scrollIntervalRef.current);
    }

    return () => clearInterval(scrollIntervalRef.current);
  }, [isScrolling]);

  const handleToggleScroll = () => {
    setIsScrolling((prev) => !prev);
  };

  const handleQuit = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/rehearsal/admin/quit-session',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.message);
      navigate('/admin'); // Navigate admin back to AdminPage
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  // Listen for the sessionEnded event to navigate to appropriate pages
  useEffect(() => {
    const handleSessionEnd = () => {
      if (isAdmin) {
        navigate('/admin'); // Redirect admin to AdminPage
      } else {
        navigate('/player'); // Redirect user to PlayerPage
      }
    };

    socket.on('sessionEnded', handleSessionEnd);

    return () => {
      socket.off('sessionEnded', handleSessionEnd);
    };
  }, [isAdmin, navigate]);

  return (
    <div className="live-page">
      <div className="overlay">
        <h2>{song.title}</h2>
        <p className="artist-name">By {song.artist || 'Unknown Artist'}</p>
        <div className="song-content" ref={scrollRef}>
          {song.lyrics && song.lyrics.length > 0 ? (
            song.lyrics.map((line, lineIndex) => (
              <div key={lineIndex}>
                {line.map((word, wordIndex) => (
                  <span key={wordIndex}>
                    {isSinger || isAdmin
                      ? word.lyrics
                      : `${word.lyrics}${word.chords ? ` (${word.chords})` : ''}`}{' '}
                  </span>
                ))}
              </div>
            ))
          ) : (
            <p>No lyrics available</p>
          )}
        </div>
      </div>
      <button className="scroll-button" onClick={handleToggleScroll}>
        {isScrolling ? 'Stop Scrolling' : 'Start Scrolling'}
      </button>
      {isAdmin && (
        <button className="quit-button" onClick={handleQuit}>
          Quit
        </button>
      )}
    </div>
  );
}

export default LivePage;
