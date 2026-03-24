# MongoDB Setup Guide

## Quick Option: MongoDB Atlas (Cloud)

### Step 1: Create Free Account
1. Visit https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create organization and project

### Step 2: Create a Cluster
1. Click "Create Deployment"
2. Select "M0 Sandbox" (Free tier)
3. Choose AWS and your nearest region
4. Click "Create"

### Step 3: Get Connection String
1. Click "Database" → Click your cluster
2. Click "Connect"
3. Choose "Drivers" → "Node.js"
4. Copy the connection string

### Step 4: Update Environment Variable
Edit `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-approval?retryWrites=true&w=majority
```

Replace:
- `username` with your MongoDB Atlas username
- `password` with your password
- `cluster` with your cluster name

## Local Installation Option

### Windows
1. Download: https://www.mongodb.com/try/download/community
2. Run installer and follow setup wizard
3. MongoDB starts automatically
4. Connection string: `mongodb://localhost:27017/smart-approval`

### Verify Connection
After setup, your backend will automatically:
- Create admin user
- Create default approval rules
- Connect to database

## Testing the Connection

Once MongoDB is configured, start the backend:
```bash
cd backend
npm start
```

You should see:
```
✓ Connected to MongoDB
✓ Admin user created
✓ Default approval rules created
Server running on http://localhost:5000
```

Then start the frontend:
```bash
cd frontend
npm start
```

Access at: http://localhost:3000
