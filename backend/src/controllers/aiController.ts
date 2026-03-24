import { Response } from 'express';
import { assessRisk } from '../utils/aiService';
import { AuthRequest } from '../middleware/auth';

export async function assessRequestRisk(req: AuthRequest, res: Response) {
    try {
        const { title, description, amount, category } = req.body;

        const assessment = await assessRisk({
            title,
            description,
            amount,
            category,
            userId: req.userId,
        });

        res.json({
            message: 'Risk assessment completed',
            assessment,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to assess risk', error });
    }
}
