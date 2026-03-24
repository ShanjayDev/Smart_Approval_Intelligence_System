import { Router } from 'express';
import {
    register,
    login,
    getProfile,
    logout,
} from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/profile', authMiddleware, getProfile);
authRouter.post('/logout', authMiddleware, logout);

export default authRouter;
