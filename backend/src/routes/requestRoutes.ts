import { Router } from 'express';
import {
    createRequest,
    getMyRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
} from '../controllers/requestController';
import { authMiddleware } from '../middleware/auth';

const requestRouter = Router();

requestRouter.use(authMiddleware);

requestRouter.post('/', createRequest);
requestRouter.get('/', getMyRequests);
requestRouter.get('/:id', getRequestById);
requestRouter.put('/:id', updateRequest);
requestRouter.delete('/:id', deleteRequest);

export default requestRouter;
