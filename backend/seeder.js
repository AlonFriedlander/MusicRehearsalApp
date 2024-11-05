import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import colors from 'colors';
import dotenv from 'dotenv';
import User from './models/User.js';
import Song from './models/Song.js'; // Ensure this is the correct path to your Song model

// Load environment variables
dotenv.config();

// Connect to the database
mongoose.connect(process.env.MONGO_URI);


// Define user data
const users = [
  { username: 'alon', password: 'pass', role: 'admin' },
  { username: 'guy', password: 'pass', role: 'user', instrument: 'vocals' },
  { username: 'efrat', password: 'pass', role: 'user', instrument: 'bass' },
];

// Import data into the database
const importData = async () => {
  try {
    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );
    await User.create(hashedUsers);
    console.log('Users Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete all users and songs from the database
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Song.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Check command-line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
