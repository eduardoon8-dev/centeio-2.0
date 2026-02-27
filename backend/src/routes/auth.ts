import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middleware/auth';
import { updateProfile } from '../controllers/authController';

const router = Router();

const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.put('/profile', profileLimiter, authenticate, updateProfile);

export default router;
