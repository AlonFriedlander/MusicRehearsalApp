import Song from '../models/Song.js';

let latestSong = null;
let songHash = null;

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
  const hash = crypto.randomUUID();
  songHash = hash;
  req.app.get('io').emit('navigateToLivePage', { hash });
  res.json({ message: 'Song selected successfully', hash });
};

export const getLiveSong = (req, res) => {
  const { hash } = req.query;
  if (hash !== songHash) return res.status(403).json({ message: 'Access denied' });
  if (!latestSong) return res.status(404).json({ message: 'No song selected' });
  res.json({ song: latestSong });
};

export const quitSession = (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  req.app.get('io').emit('sessionEnded');
  res.json({ message: 'Session ended successfully' });
};
