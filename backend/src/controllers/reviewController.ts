import { Response } from 'express';
import ApprovalRequest from '../models/ApprovalRequest';
import { AuthRequest } from '../middleware/auth';

export async function getReviewQueue(req: AuthRequest, res: Response) {
    try {
        const { status, riskLevel } = req.query;

        let filter: any = {
            status: { $in: ['pending-review', 'submitted'] },
        };

        if (status) {
            filter.status = status;
        }
        if (riskLevel) {
            filter.riskLevel = riskLevel;
        }

        const requests = await ApprovalRequest.find(filter)
            .populate('userId', 'firstName lastName email department')
            .sort({ riskScore: -1, createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res
            .status(500)
            .json({ message: 'Failed to fetch review queue', error });
    }
}

export async function approveRequest(req: AuthRequest, res: Response) {
    try {
        const { comment } = req.body;
        const request = await ApprovalRequest.findById(req.params.id);

        if (!request) {
            res.status(404).json({ message: 'Request not found' });
            return;
        }

        request.status = 'approved';
        request.approvedBy = req.userId as any;

        if (comment) {
            request.comments.push({
                userId: req.userId as any,
                text: comment,
                createdAt: new Date(),
            });
        }

        await request.save();

        res.json({
            message: 'Request approved successfully',
            request,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to approve request', error });
    }
}

export async function rejectRequest(req: AuthRequest, res: Response) {
    try {
        const { reason, comment } = req.body;
        const request = await ApprovalRequest.findById(req.params.id);

        if (!request) {
            res.status(404).json({ message: 'Request not found' });
            return;
        }

        request.status = 'rejected';
        request.rejectionReason = reason;
        request.approvedBy = req.userId as any;

        if (comment) {
            request.comments.push({
                userId: req.userId as any,
                text: comment,
                createdAt: new Date(),
            });
        }

        await request.save();

        res.json({
            message: 'Request rejected successfully',
            request,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reject request', error });
    }
}

export async function addComment(req: AuthRequest, res: Response) {
    try {
        const { text } = req.body;
        const request = await ApprovalRequest.findById(req.params.id);

        if (!request) {
            res.status(404).json({ message: 'Request not found' });
            return;
        }

        request.comments.push({
            userId: req.userId as any,
            text,
            createdAt: new Date(),
        });

        await request.save();

        res.json({
            message: 'Comment added successfully',
            comments: request.comments,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add comment', error });
    }
}
