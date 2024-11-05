import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  artist: { type: String },
  lyrics: { type: Array, required: true }, // Store lyrics as an array of arrays of objects
  filename: { type: String, required: true } // To reference original file if needed
});

export default mongoose.model('Song', SongSchema);