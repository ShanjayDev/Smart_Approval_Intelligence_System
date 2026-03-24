import { Response } from 'express';
import ApprovalRequest from '../models/ApprovalRequest';
import { AuthRequest } from '../middleware/auth';
import { assessRisk, checkAutoApprovalEligibility } from '../utils/aiService';
import { evaluateRules } from '../utils/ruleEngine';
import { generateRequestNumber } from '../utils/helpers';

export async function createRequest(req: AuthRequest, res: Response) {
    try {
        const { title, description, amount, category, attachments } = req.body;

        const riskAssessment = await assessRisk({
            title,
            description,
            amount,
            category,
            userId: req.userId,
        });

        const requestNumber = generateRequestNumber();
        const request = new ApprovalRequest({
            requestNumber,
            userId: req.userId,
            title,
            description,
            amount,
            category,
            riskScore: riskAssessment.riskScore,
            riskLevel: riskAssessment.riskLevel,
            attachments: attachments || [],
        });

        // Check for auto-approval eligibility
        const isEligibleForAutoApproval =
            await checkAutoApprovalEligibility({
                title,
                description,
                amount,
                category,
            });

        if (isEligibleForAutoApproval) {
            request.status = 'auto-approved';
            request.autoApproved = true;
        } else {
            request.status = 'pending-review';
        }

        await request.save();

        res.status(201).json({
            message: 'Request created successfully',
            request,
            riskAssessment,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create request', error });
    }
}

export async function getMyRequests(req: AuthRequest, res: Response) {
    try {
        const { status, category } = req.query;

        let filter: any = { userId: req.userId };

        if (status) {
            filter.status = status;
        }
        if (category) {
            filter.category = category;
        }

        const requests = await ApprovalRequest.find(filter)
            .populate('userId', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch requests', error });
    }
}

export async function getRequestById(req: AuthRequest, res: Response) {
    try {
        const request = await ApprovalRequest.findById(req.params.id)
            .populate('userId', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName')
            .populate('comments.userId', 'firstName lastName');

        if (!request) {
            res.status(404).json({ message: 'Request not found' });
            return;
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch request', error });
    }
}

export async function updateRequest(req: AuthRequest, res: Response) {
    try {
        const { title, description, amount, category, attachments, status } =
            req.body;

        const request = await ApprovalRequest.findById(req.params.id);

        if (!request) {
            res.status(404).json({ message: 'Request not found' });
            return;
        }

        if (request.userId.toString() !== req.userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        if (request.status !== 'draft') {
            res
                .status(400)
                .json({ message: 'Can only edit draft requests' });
            return;
        }

        if (title) request.title = title;
        if (description) request.description = description;
        if (amount) request.amount = amount;
        if (category) request.category = category;
        if (attachments) request.attachments = attachments;
        if (status) request.status = status;

        await request.save();

        res.json({ message: 'Request updated successfully', request });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update request', error });
    }
}

export async function deleteRequest(req: AuthRequest, res: Response) {
    try {
        const request = await ApprovalRequest.findById(req.params.id);

        if (!request) {
            res.status(404).json({ message: 'Request not found' });
            return;
        }

        if (request.userId.toString() !== req.userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        await ApprovalRequest.deleteOne({ _id: req.params.id });

        res.json({ message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete request', error });
    }
}
