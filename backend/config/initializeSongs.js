import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Song from '../models/Song.js';

// Define __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to initialize songs in the database from the local 'songs' directory
export const initializeSongs = async () => {
  try {
    const songsDir = path.join(__dirname, '../songs');
    const songFiles = fs.readdirSync(songsDir);

    for (const file of songFiles) {
      const filePath = path.join(songsDir, file);
      const songData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // Ensure the JSON data has both title and artist properties
      if (!songData.title || !songData.artist) {
        console.warn(`Skipping ${file} as it does not have a title or artist.`);
        continue;
      }

      const title = songData.title;
      const artist = songData.artist;

      const songExists = await Song.findOne({ title });

      if (!songExists) {
        const newSong = new Song({
          title,
          artist,
          filename: file,
          lyrics: songData.lyrics,
        });
        await newSong.save();
        console.log(`Song added to database: ${title} by ${artist}`);
      }
    }
  } catch (error) {
    console.error('Error initializing songs:', error);
  }
};
