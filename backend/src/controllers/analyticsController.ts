import { Response } from 'express';
import ApprovalRequest from '../models/ApprovalRequest';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { calculateApprovalMetrics } from '../utils/helpers';

export async function getDashboardStats(req: AuthRequest, res: Response) {
    try {
        const allRequests = await ApprovalRequest.find();
        const users = await User.find();

        const metrics = calculateApprovalMetrics(allRequests);

        const riskDistribution = {
            low: allRequests.filter((r) => r.riskLevel === 'low').length,
            medium: allRequests.filter((r) => r.riskLevel === 'medium').length,
            high: allRequests.filter((r) => r.riskLevel === 'high').length,
            critical: allRequests.filter((r) => r.riskLevel === 'critical').length,
        };

        const statusDistribution = {
            draft: allRequests.filter((r) => r.status === 'draft').length,
            submitted: allRequests.filter((r) => r.status === 'submitted').length,
            autoApproved: allRequests.filter((r) => r.status === 'auto-approved')
                .length,
            pendingReview: allRequests.filter((r) => r.status === 'pending-review')
                .length,
            approved: allRequests.filter((r) => r.status === 'approved').length,
            rejected: allRequests.filter((r) => r.status === 'rejected').length,
        };

        const avgRequestAmount =
            allRequests.length > 0
                ? (
                    allRequests.reduce((sum, r) => sum + r.amount, 0) /
                    allRequests.length
                ).toFixed(2)
                : 0;

        const avgRiskScore =
            allRequests.length > 0
                ? (
                    allRequests.reduce((sum, r) => sum + r.riskScore, 0) /
                    allRequests.length
                ).toFixed(2)
                : 0;

        res.json({
            metrics,
            riskDistribution,
            statusDistribution,
            avgRequestAmount,
            avgRiskScore,
            totalUsers: users.length,
            totalRequests: allRequests.length,
        });
    } catch (error) {
        res
            .status(500)
            .json({ message: 'Failed to fetch dashboard stats', error });
    }
}

export async function getRequestAnalytics(req: AuthRequest, res: Response) {
    try {
        const { days = 30 } = req.query;
        const daysNum = parseInt(days as string);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysNum);

        const requests = await ApprovalRequest.find({
            createdAt: { $gte: startDate },
        });

        const dailyData: Record<string, any> = {};

        requests.forEach((req) => {
            const date = req.createdAt.toISOString().split('T')[0];
            if (!dailyData[date]) {
                dailyData[date] = {
                    submitted: 0,
                    approved: 0,
                    rejected: 0,
                    totalAmount: 0,
                };
            }
            dailyData[date].totalAmount += req.amount;
            if (req.status === 'approved') {
                dailyData[date].approved += 1;
            } else if (req.status === 'rejected') {
                dailyData[date].rejected += 1;
            } else {
                dailyData[date].submitted += 1;
            }
        });

        const categoryBreakdown = {};
        requests.forEach((req) => {
            if (!(req.category in categoryBreakdown)) {
                (categoryBreakdown as any)[req.category] = {
                    count: 0,
                    totalAmount: 0,
                    approved: 0,
                };
            }
            (categoryBreakdown as any)[req.category].count += 1;
            (categoryBreakdown as any)[req.category].totalAmount += req.amount;
            if (req.status === 'approved') {
                (categoryBreakdown as any)[req.category].approved += 1;
            }
        });

        res.json({
            dailyData,
            categoryBreakdown,
            period: {
                startDate,
                days: daysNum,
            },
        });
    } catch (error) {
        res
            .status(500)
            .json({ message: 'Failed to fetch analytics', error });
    }
}

export async function getApprovalTrends(req: AuthRequest, res: Response) {
    try {
        const requests = await ApprovalRequest.find().sort({ createdAt: 1 });

        const trends = {
            byRiskLevel: {} as Record<string, number>,
            byStatus: {} as Record<string, number>,
            byCategory: {} as Record<string, number>,
        };

        requests.forEach((req) => {
            trends.byRiskLevel[req.riskLevel] =
                (trends.byRiskLevel[req.riskLevel] || 0) + 1;
            trends.byStatus[req.status] =
                (trends.byStatus[req.status] || 0) + 1;
            trends.byCategory[req.category] =
                (trends.byCategory[req.category] || 0) + 1;
        });

        res.json(trends);
    } catch (error) {
        res
            .status(500)
            .json({ message: 'Failed to fetch trends', error });
    }
}
