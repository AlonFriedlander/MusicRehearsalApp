import express from 'express';
import {
  register,
  login,
  loginWithToken,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/validate-token', loginWithToken);
router.get('/validate-admin-token', (req, res, next) =>
  loginWithToken(req, res, next, true)
);

export default router;
