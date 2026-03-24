import { Router } from 'express';
import { assessRequestRisk } from '../controllers/aiController';
import { authMiddleware } from '../middleware/auth';

const aiRouter = Router();

aiRouter.use(authMiddleware);

aiRouter.post('/assess-risk', assessRequestRisk);

export default aiRouter;
