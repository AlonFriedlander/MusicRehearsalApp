import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

function LivePage() {
  const { state } = useLocation();
  const [song, setSong] = useState(state?.song || { title: "No song selected", artist: "", lyrics: [] });
  const navigate = useNavigate();
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  const token = localStorage.getItem('token');
  const user = JSON.parse(atob(token.split('.')[1]));
  const isAdmin = user.role === 'admin';
  const isSinger = user.instrument === 'vocals';

  // Initialize socket connection within useEffect
  useEffect(() => {
    const socket = io('http://localhost:5000'); // Initialize inside useEffect

    console.log("Setting up socket listener for 'displaySong' event");

    socket.on('displaySong', (songData) => {
      console.log("Received 'displaySong' event with data:", songData);

      // Parse songData if it’s a JSON string
      const parsedSongData = typeof songData === 'string' ? JSON.parse(songData) : songData;
      setSong(parsedSongData);

      console.log("Updated song state in LivePage:", parsedSongData);
    });

    return () => {
      console.log("Cleaning up 'displaySong' event listener");
      socket.off('displaySong');
      socket.disconnect();
    };
  }, []);

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

  const handleQuit = () => {
    navigate('/');
  };

  return (
    <div className="live-page" style={{ backgroundColor: '#000', color: '#FFF', padding: '20px' }}>
      <h2 style={{ fontSize: '2em', textAlign: 'center' }}>{song.title}</h2>
      <p style={{ fontSize: '1.5em', textAlign: 'center' }}>By {song.artist || "Unknown Artist"}</p>
      
      <div
        className="song-content"
        ref={scrollRef}
        style={{
          fontSize: '1.2em',
          maxHeight: '70vh',
          overflowY: 'auto',
          padding: '10px',
          lineHeight: '1.5em',
        }}
      >
        {song.lyrics && song.lyrics.length > 0 ? (
          song.lyrics.map((line, lineIndex) => (
            <div key={lineIndex} style={{ marginBottom: '10px' }}>
              {line.map((word, wordIndex) => (
                <span key={wordIndex} style={{ display: 'inline-block', marginRight: '8px' }}>
                  {isSinger
                    ? word.lyrics
                    : `${word.lyrics} ${word.chords ? `(${word.chords})` : ''}`}
                </span>
              ))}
            </div>
          ))
        ) : (
          <p>No lyrics available</p>
        )}
      </div>

      <button
        onClick={handleToggleScroll}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px',
          fontSize: '1em',
        }}
      >
        {isScrolling ? 'Stop Scrolling' : 'Start Scrolling'}
      </button>

      {isAdmin && (
        <button
          onClick={handleQuit}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '10px',
            fontSize: '1em',
          }}
        >
          Quit
        </button>
      )}
    </div>
  );
}

export default LivePage;
