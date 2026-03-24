import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export async function register(req: AuthRequest, res: Response) {
    try {
        const { email, password, firstName, lastName, department } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: 'User already exists' });
            return;
        }

        const user = new User({
            email,
            password,
            firstName,
            lastName,
            department,
            role: 'user',
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error });
    }
}

export async function login(req: AuthRequest, res: Response) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                department: user.department,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
}

export async function getProfile(req: AuthRequest, res: Response) {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile', error });
    }
}

export async function logout(req: AuthRequest, res: Response) {
    try {
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Logout failed', error });
    }
}
