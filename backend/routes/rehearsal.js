import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { searchSongs, selectSong, getLiveSong, quitSession } from '../controllers/rehearsalController.js';

const router = express.Router();

router.get('/admin/search', authMiddleware, searchSongs);
router.post('/admin/select-song', authMiddleware, selectSong);
router.get('/live/song', authMiddleware, getLiveSong);
router.post('/admin/quit-session', authMiddleware, quitSession);

export default router;
