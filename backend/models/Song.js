import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  artist: { type: String },
  lyrics: { type: Array, required: true }, // Store lyrics as an array of arrays of objects
  filename: { type: String },
});

SongSchema.index({ title: 1 }); // Index for faster queries

export default mongoose.model('Song', SongSchema);
