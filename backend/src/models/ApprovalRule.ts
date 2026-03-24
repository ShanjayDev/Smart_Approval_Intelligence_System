import mongoose, { Document, Schema } from 'mongoose';

export interface IApprovalRule extends Document {
    name: string;
    description: string;
    conditions: Array<{
        field: string;
        operator: string;
        value: any;
    }>;
    action: 'auto-approve' | 'auto-reject' | 'escalate';
    priority: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const approvalRuleSchema = new Schema<IApprovalRule>(
    {
        name: {
            type: String,
            required: true,
        },
        description: String,
        conditions: [
            {
                field: String,
                operator: String,
                value: Schema.Types.Mixed,
            },
        ],
        action: {
            type: String,
            enum: ['auto-approve', 'auto-reject', 'escalate'],
            required: true,
        },
        priority: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const ApprovalRule = mongoose.model<IApprovalRule>(
    'ApprovalRule',
    approvalRuleSchema
);
export default ApprovalRule;
