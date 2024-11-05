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
      const title = path.parse(file).name.replace('_', ' '); // Format title
      const songExists = await Song.findOne({ title });

      if (!songExists) {
        const filePath = path.join(songsDir, file);
        const lyrics = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        const newSong = new Song({ title, filename: file, lyrics });
        await newSong.save();
        console.log(`Song added to database: ${title}`);
      }
    }

    console.log('All songs initialized successfully.');
  } catch (error) {
    console.error('Error initializing songs:', error);
  }
};
