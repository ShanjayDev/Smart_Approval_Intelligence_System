import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
    userId: mongoose.Types.ObjectId;
    action: string;
    resourceType: string;
    resourceId: string;
    details: Record<string, any>;
    createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        resourceType: {
            type: String,
            required: true,
        },
        resourceId: {
            type: String,
            required: true,
        },
        details: Schema.Types.Mixed,
    },
    { timestamps: true }
);

activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ resourceType: 1, resourceId: 1 });

const ActivityLog = mongoose.model<IActivityLog>(
    'ActivityLog',
    activityLogSchema
);
export default ActivityLog;
