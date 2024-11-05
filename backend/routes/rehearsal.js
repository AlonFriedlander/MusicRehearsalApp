import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Admin song search route to search for songs by title
router.get('/admin/search', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const query = req.query.q?.toLowerCase(); // Get the search query
  console.log('Search query:', query);
  const songsDir = path.join(__dirname, '../songs');
  const songFiles = fs.readdirSync(songsDir);

  // Filter songs based on query
  const songs = songFiles
    .filter((file) => path.parse(file).name.toLowerCase().includes(query))
    .map((file) => ({
      title: path.parse(file).name.replace('_', ' '),
      filename: file,
    }));
  console.log('Search results:', songs);
  res.json({ songs });
});

// Route to load selected song content by filename
router.get('/admin/song/:filename', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { filename } = req.params;
  const songPath = path.join(__dirname, '../songs', filename);

  if (!fs.existsSync(songPath)) {
    return res.status(404).json({ message: 'Song not found' });
  }

  const songData = JSON.parse(fs.readFileSync(songPath, 'utf-8'));
  res.json({ song: songData });
});

// Admin selects a song to display for all players
router.post('/admin/select-song', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { song } = req.body; // song data passed in the request body
  console.log('Song received in request body:', song);

  // Get the filename and read the JSON file
  const songPath = path.join(__dirname, '../songs', song.filename);
  console.log('Path to song file:', songPath);

  if (!fs.existsSync(songPath)) {
    console.log('File does not exist at path:', songPath);
    return res.status(404).json({ message: 'Song file not found' });
  }

  try {
    const songData = JSON.parse(fs.readFileSync(songPath, 'utf-8'));
    console.log('Read song data from file:', songData);

    // Emit the song selection event with full song data as a JSON string to avoid serialization issues
    const io = req.app.get('io'); // Get the io instance from the app
    io.emit('displaySong', JSON.stringify({ ...song, lyrics: songData }));
    console.log(
      'Emitted song data to clients via Socket.IO:',
      JSON.stringify({ ...song, lyrics: songData })
    );

    // Send the response back to the admin with full song data
    res.json({
      message: 'Song selected successfully',
      song: { ...song, lyrics: songData },
    });
  } catch (error) {
    console.error('Error reading song file:', error);
    res.status(500).json({ message: 'Server error reading song file' });
  }
});

export default router;
