import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'manager' | 'admin';
    department: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'manager', 'admin'],
            default: 'user',
        },
        department: {
            type: String,
            default: 'General',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

userSchema.methods.comparePassword = async function (
    password: string
): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
