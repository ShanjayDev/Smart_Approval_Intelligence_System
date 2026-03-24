import { Router } from 'express';
import {
    getReviewQueue,
    approveRequest,
    rejectRequest,
    addComment,
} from '../controllers/reviewController';
import { authMiddleware } from '../middleware/auth';

const reviewRouter = Router();

reviewRouter.use(authMiddleware);

reviewRouter.get('/', getReviewQueue);
reviewRouter.post('/:id/approve', approveRequest);
reviewRouter.post('/:id/reject', rejectRequest);
reviewRouter.post('/:id/comments', addComment);

export default reviewRouter;
