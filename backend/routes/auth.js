import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, instrument, role } = req.body;

  console.log('Received registration request:', req.body); // Log incoming request data

  try {
    // Check if an admin already exists
    if (role === 'admin') {
      const adminExists = await User.findOne({ role: 'admin' });
      if (adminExists) {
        console.log('An admin already exists, cannot create another admin.');
        return res.status(400).json({ message: 'An admin already exists' });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Username already exists:', username);
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Create new user
    const user = new User({
      username,
      password: hashedPassword,
      instrument: role === 'admin' ? null : instrument, // instrument is null for admin
      role,
    });
    await user.save();

    console.log('User registered successfully:', user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error); // Log any error during registration
    res.status(500).json({ message: 'Server error' });
  }
});

// Login an existing user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Received login request:', req.body); // Log incoming login data

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Invalid credentials: User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials: Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful, token generated');
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        instrument: user.instrument, // Include instrument in the response
      },
    });
  } catch (error) {
    console.error('Error during login:', error); // Log any error during login
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
