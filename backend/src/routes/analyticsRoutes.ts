import { Router } from 'express';
import {
    getDashboardStats,
    getRequestAnalytics,
    getApprovalTrends,
} from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/auth';

const analyticsRouter = Router();

analyticsRouter.use(authMiddleware);

analyticsRouter.get('/dashboard', getDashboardStats);
analyticsRouter.get('/requests', getRequestAnalytics);
analyticsRouter.get('/trends', getApprovalTrends);

export default analyticsRouter;
