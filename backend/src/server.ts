import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/auth';

// Import routes
import authRouter from './routes/authRoutes';
import requestRouter from './routes/requestRoutes';
import reviewRouter from './routes/reviewRoutes';
import analyticsRouter from './routes/analyticsRoutes';
import aiRouter from './routes/aiRoutes';

// Import models for initial setup
import User from './models/User';
import ApprovalRule from './models/ApprovalRule';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-approval';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Initialize admin user and default rules
        await initializeDefaults();
    } catch (error) {
        console.error('✗ MongoDB connection failed:', error);
        process.exit(1);
    }
}

// Initialize default data
async function initializeDefaults() {
    try {
        // Create admin user if doesn't exist
        const adminExists = await User.findOne({
            email: process.env.ADMIN_EMAIL,
        });
        if (!adminExists) {
            const admin = new User({
                email: process.env.ADMIN_EMAIL || 'admin@example.com',
                password: process.env.ADMIN_PASSWORD || 'admin123',
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                department: 'Administration',
            });
            await admin.save();
            console.log('✓ Admin user created');
        }

        // Create default approval rules
        const rulesExist = await ApprovalRule.findOne();
        if (!rulesExist) {
            const defaultRules = [
                {
                    name: 'Low Amount Auto-Approve',
                    description: 'Automatically approve requests under $1000',
                    conditions: [
                        {
                            field: 'amount',
                            operator: 'less-than',
                            value: 1000,
                        },
                        {
                            field: 'riskLevel',
                            operator: 'in',
                            value: ['low', 'medium'],
                        },
                    ],
                    action: 'auto-approve',
                    priority: 10,
                    isActive: true,
                },
                {
                    name: 'High Risk Escalation',
                    description: 'Escalate critical risk requests',
                    conditions: [
                        {
                            field: 'riskLevel',
                            operator: 'equals',
                            value: 'critical',
                        },
                    ],
                    action: 'escalate',
                    priority: 20,
                    isActive: true,
                },
            ];

            await ApprovalRule.insertMany(defaultRules);
            console.log('✓ Default approval rules created');
        }
    } catch (error) {
        console.error('Error initializing defaults:', error);
    }
}

// Routes
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Smart Approval Intelligence API' });
});

app.use('/api/auth', authRouter);
app.use('/api/requests', requestRouter);
app.use('/api/review-queue', reviewRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/ai', aiRouter);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(
            `\n╔════════════════════════════════════════════════════╗`
        );
        console.log(`║  Smart Approval Intelligence System               ║`);
        console.log(`║  Server running on http://localhost:${PORT}        ║`);
        console.log(`║                                                    ║`);
        console.log(`║  API Documentation:                               ║`);
        console.log(`║  - Auth: POST /api/auth/login                     ║`);
        console.log(`║  - Requests: GET /api/requests                    ║`);
        console.log(`║  - Review: GET /api/review-queue                  ║`);
        console.log(`║  - Analytics: GET /api/analytics/dashboard        ║`);
        console.log(`║  - AI: POST /api/ai/assess-risk                   ║`);
        console.log(`╚════════════════════════════════════════════════════╝\n`);
    });
}

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

export default app;
