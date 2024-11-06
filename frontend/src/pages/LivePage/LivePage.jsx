import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import useValidateToken from '../../hooks/useValidateToken';
import './LivePage.css'; // Import the CSS file for styles

function ToggleSwitch({ isOn, handleToggle }) {
  return (
    <div className="toggle-switch-container">
      <label className="toggle-label">
        {isOn ? 'Scrolling' : 'Not Scrolling'}
      </label>
      <div
        className={`toggle-switch ${isOn ? 'on' : 'off'}`}
        onClick={handleToggle}
      >
        <div className={`toggle-switch-slider ${isOn ? 'on' : 'off'}`}></div>
      </div>
    </div>
  );
}

function LivePage() {
  const [song, setSong] = useState({
    title: 'No song selected',
    artist: '',
    lyrics: [], // Assuming each element in lyrics is an array of objects
  });
  const [scrollSpeed, setScrollSpeed] = useState(5); // Default speed in seconds per line
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollCompleted, setScrollCompleted] = useState(false);
  const autoScrollIntervalRef = useRef(null);

  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';
  const isSinger = user?.instrument === 'vocals';

  // Token validation status
  const isValidToken = useValidateToken();

  const handleSessionEnd = useCallback(() => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/player');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (isValidToken === null) return;
    if (!isValidToken) {
      navigate('/login');
      return;
    }

    const fetchSong = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/rehearsal/live/song`,
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

    const newSocket = io(`${process.env.REACT_APP_BACKEND_URL}/`, {
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    newSocket.on('sessionEnded', handleSessionEnd);

    return () => {
      newSocket.off('sessionEnded', handleSessionEnd);
      newSocket.disconnect();
    };
  }, [isValidToken, navigate, token, state, handleSessionEnd]);

  // Auto-scroll logic
  useEffect(() => {
    if (isAutoScrolling) {
      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentLineIndex((prevIndex) => {
          if (prevIndex < song.lyrics.length - 1) {
            return prevIndex + 1;
          } else {
            clearInterval(autoScrollIntervalRef.current);
            setScrollCompleted(true);
            return prevIndex;
          }
        });
      }, scrollSpeed * 1000); // Dynamic speed based on input (in milliseconds)
    } else {
      clearInterval(autoScrollIntervalRef.current);
    }

    return () => clearInterval(autoScrollIntervalRef.current);
  }, [isAutoScrolling, song.lyrics.length, scrollSpeed]);

  const handleToggleAutoScroll = () => {
    setIsAutoScrolling((prev) => !prev);
    setScrollCompleted(false);
    if (!isAutoScrolling) {
      setCurrentLineIndex(0); // Reset to the start when beginning auto-scroll
    }
  };

  const handleQuit = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/rehearsal/admin/quit-session`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.message);
      navigate('/admin');
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  return (
    <div className="live-page">
      <div className="overlay">
        <h2>{song.title}</h2>
        <p className="artist-name">By {song.artist || 'Unknown Artist'}</p>
        <div className="song-content">
          {song.lyrics && song.lyrics.length > 0 ? (
            isAutoScrolling ? (
              <div>
                {song.lyrics[currentLineIndex].map((word, wordIndex) => (
                  <span key={wordIndex}>
                    {isSinger || isAdmin
                      ? word.lyrics
                      : `${word.lyrics}${
                          word.chords ? ` (${word.chords})` : ''
                        }`}{' '}
                  </span>
                ))}
              </div>
            ) : (
              <div>
                {song.lyrics.map((line, lineIndex) => (
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
                ))}
              </div>
            )
          ) : (
            <p>No lyrics available</p>
          )}
        </div>
      </div>
      <div className="control-panel">
        <div className="speed-input">
          <label htmlFor="scrollSpeed">Scroll Speed (seconds per line): </label>
          <input
            type="number"
            id="scrollSpeed"
            min="1"
            value={scrollSpeed}
            onChange={(e) => setScrollSpeed(Number(e.target.value))}
          />
        </div>
        <ToggleSwitch
          isOn={isAutoScrolling}
          handleToggle={handleToggleAutoScroll}
        />
      </div>
      {scrollCompleted && (
        <p className="scroll-completed">End of song reached.</p>
      )}
      {isAdmin && (
        <button className="quit-button" onClick={handleQuit}>
          Quit
        </button>
      )}
    </div>
  );
}

export default LivePage;
