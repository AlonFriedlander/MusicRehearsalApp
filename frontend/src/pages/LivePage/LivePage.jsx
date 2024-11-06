import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import useValidateToken from '../../hooks/useValidateToken';
import './LivePage.css'; // Import the CSS file for styles

function LivePage() {
  const [song, setSong] = useState({
    title: 'No song selected',
    artist: '',
    lyrics: [],
  });

  const { state } = useLocation();
  const navigate = useNavigate();
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';
  const isSinger = user?.instrument === 'vocals';

  // Token validation status
  const isValidToken = useValidateToken();

  // Define handleSessionEnd with useCallback to avoid re-creating it on each render
  const handleSessionEnd = useCallback(() => {
    if (isAdmin) {
      navigate('/admin'); // Redirect admin to AdminPage
    } else {
      navigate('/player'); // Redirect user to PlayerPage
    }
  }, [isAdmin, navigate]);

  // Fetch song and connect socket after validating the token
  useEffect(() => {
    console.log(state);
    if (isValidToken === null) return; // Wait for token validation
    if (!isValidToken) {
      navigate('/login'); // Redirect if token is invalid
      return;
    }

    // Token is valid, fetch song and initialize socket connection
    const fetchSong = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/rehearsal/live/song',
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { hash: state.hash },
          }
        );
        setSong(response.data.song);
      } catch (error) {
        console.error('Error fetching song:', error);
        setSong({ title: 'No song selected', artist: '', lyrics: [] });
      }
    };

    fetchSong();

    const newSocket = io('http://localhost:5000', {
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    newSocket.on('sessionEnded', handleSessionEnd);

    return () => {
      newSocket.off('sessionEnded', handleSessionEnd);
      newSocket.disconnect();
    };
  }, [isValidToken, navigate, token, state, handleSessionEnd]);

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
                      : `${word.lyrics}${
                          word.chords ? ` (${word.chords})` : ''
                        }`}{' '}
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
