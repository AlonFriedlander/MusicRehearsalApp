import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for players (users) to view the waiting room
router.get('/waiting', authMiddleware, (req, res) => {
  res.json({ message: "Waiting for the admin to select the next song..." });
});

// Route for admin to search for songs (example placeholder)
router.get('/admin/search', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.json({ message: "Admin can search for songs here" });
});

export default router;
