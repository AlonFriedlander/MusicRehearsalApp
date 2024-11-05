import Song from '../models/Song.js';

let latestSong = null;

export const searchSongs = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  const query = req.query.q?.toLowerCase();
  const songs = await Song.find({ title: new RegExp(query, 'i') }, 'title filename');
  res.json({ songs });
};

export const selectSong = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  const { song } = req.body;
  const selectedSong = await Song.findOne({ filename: song.filename });
  if (!selectedSong) return res.status(404).json({ message: 'Song not found' });

  latestSong = selectedSong;
  req.app.get('io').emit('navigateToLivePage');
  res.json({ message: 'Song selected successfully' });
};

export const getLiveSong = (req, res) => {
  if (!latestSong) return res.status(404).json({ message: 'No song selected' });
  res.json({ song: latestSong });
};

export const quitSession = (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  req.app.get('io').emit('sessionEnded');
  res.json({ message: 'Session ended successfully' });
};
