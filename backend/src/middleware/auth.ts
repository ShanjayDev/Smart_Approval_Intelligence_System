import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
    user?: any;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your_jwt_secret'
        ) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const roleMiddleware = (allowedRoles: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            // In a real app, fetch user from database
            // For now, you'd need to add user info to request
            const userRole = (req as any).userRole || 'user';

            if (!allowedRoles.includes(userRole)) {
                res.status(403).json({ message: 'Insufficient permissions' });
                return;
            }
            next();
        } catch (error) {
            res.status(403).json({ message: 'Permission denied' });
        }
    };
};

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    if (err.name === 'ValidationError') {
        res.status(400).json({
            message: 'Validation error',
            errors: err.errors,
        });
        return;
    }

    if (err.code === 11000) {
        res.status(409).json({
            message: 'Duplicate entry',
        });
        return;
    }

    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal server error',
    });
};
