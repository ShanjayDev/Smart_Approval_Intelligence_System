import mongoose, { Document, Schema } from 'mongoose';

export interface IApprovalRequest extends Document {
    requestNumber: string;
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    amount: number;
    category: string;
    status: 'draft' | 'submitted' | 'auto-approved' | 'pending-review' | 'approved' | 'rejected';
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    autoApproved: boolean;
    approvedBy?: mongoose.Types.ObjectId;
    rejectionReason?: string;
    attachments: string[];
    comments: Array<{
        userId: mongoose.Types.ObjectId;
        text: string;
        createdAt: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const approvalRequestSchema = new Schema<IApprovalRequest>(
    {
        requestNumber: {
            type: String,
            unique: true,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            enum: ['travel', 'equipment', 'software', 'service', 'other'],
            required: true,
        },
        status: {
            type: String,
            enum: [
                'draft',
                'submitted',
                'auto-approved',
                'pending-review',
                'approved',
                'rejected',
            ],
            default: 'draft',
        },
        riskScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        riskLevel: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'low',
        },
        autoApproved: {
            type: Boolean,
            default: false,
        },
        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        rejectionReason: String,
        attachments: [String],
        comments: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                text: String,
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

const ApprovalRequest = mongoose.model<IApprovalRequest>(
    'ApprovalRequest',
    approvalRequestSchema
);
export default ApprovalRequest;
