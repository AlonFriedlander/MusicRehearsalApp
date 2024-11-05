import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Song from '../models/Song.js';

const router = express.Router();
let latestSong = null;

// Admin song search route to search for songs by title
router.get('/admin/search', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const query = req.query.q?.toLowerCase();
  const songs = await Song.find({ title: new RegExp(query, 'i') }, 'title filename');
  
  res.json({ songs });
});

// Admin selects a song to display for all players
router.post('/admin/select-song', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { song } = req.body;
  const selectedSong = await Song.findOne({ filename: song.filename });

  if (!selectedSong) {
    return res.status(404).json({ message: 'Song not found' });
  }

  latestSong = selectedSong;

  const io = req.app.get('io');
  io.emit('navigateToLivePage');
  res.json({ message: 'Song selected successfully' });
});

// Get the currently selected song for the live page
router.get('/live/song', authMiddleware, (req, res) => {
  if (!latestSong) {
    return res.status(404).json({ message: 'No song selected' });
  }
  res.json({ song: latestSong });
});

// Admin ends the rehearsal session
router.post('/admin/quit-session', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const io = req.app.get('io');
  io.emit('sessionEnded');
  res.json({ message: 'Session ended successfully' });
});

export default router;
