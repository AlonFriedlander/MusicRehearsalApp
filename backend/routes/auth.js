import express from 'express';
import { register, login, loginWithToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/validate-token', loginWithToken);
  

export default router;
