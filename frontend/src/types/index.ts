export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'manager' | 'admin';
    department: string;
}

export interface ApprovalRequest {
    _id: string;
    requestNumber: string;
    userId: string | User;
    title: string;
    description: string;
    amount: number;
    category: 'travel' | 'equipment' | 'software' | 'service' | 'other';
    status: 'draft' | 'submitted' | 'auto-approved' | 'pending-review' | 'approved' | 'rejected';
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    autoApproved: boolean;
    approvedBy?: string | User;
    rejectionReason?: string;
    attachments: string[];
    comments: Comment[];
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    userId: string | User;
    text: string;
    createdAt: string;
}

export interface RiskAssessment {
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    recommendation: string;
}

export interface DashboardStats {
    metrics: {
        total: number;
        approved: number;
        rejected: number;
        pending: number;
        autoApproved: number;
        approvalRate: string;
        autoApprovalRate: string;
    };
    riskDistribution: {
        low: number;
        medium: number;
        high: number;
        critical: number;
    };
    statusDistribution: {
        draft: number;
        submitted: number;
        autoApproved: number;
        pendingReview: number;
        approved: number;
        rejected: number;
    };
    avgRequestAmount: string;
    avgRiskScore: string;
    totalUsers: number;
    totalRequests: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    department?: string;
}
