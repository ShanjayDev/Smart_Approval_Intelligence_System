# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
cd d:\Smart_Approval_Intelligence
npm run install-all
```

This command installs all dependencies for both backend and frontend.

### 2. Start MongoDB
Make sure MongoDB is running:

**Windows (if installed):**
```bash
mongod
```

**Or use MongoDB Atlas (cloud):**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a cluster and get your connection string
- Update `backend/.env` with your MongoDB URI

### 3. Start the Application

**Option A: Start Both Services Together**
```bash
npm start
```

**Option B: Start Separately (Recommended for Development)**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### 5. Login
Use the default credentials:
- Email: `admin@example.com`
- Password: `admin123`

## 📋 Features at a Glance

✅ **User Dashboard** - Overview of approvals and statistics
✅ **Submit Requests** - Create approval requests with AI risk assessment
✅ **My Requests** - Track your submitted requests
✅ **Review Queue** - Managers can approve/reject requests
✅ **Analytics** - Admin dashboard with detailed reports
✅ **AI Risk Prediction** - Automatic risk assessment for requests
✅ **Rule-based Auto-Approval** - Automatically approve low-risk requests
✅ **Real-time Notifications** - Toast notifications for actions

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + TailwindCSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB
- **Charts**: Chart.js
- **UI Components**: Custom + React Icons
- **State Management**: React Hooks

## 📁 Project Structure

```
smart-approval-intelligence/
├── backend/              # Express API server
├── frontend/             # React application
├── README.md             # Main documentation
├── INSTALLATION_GUIDE.md # Detailed setup guide
└── QUICK_START.md        # This file
```

## 🔑 Key Credentials & URLs

| Item | Value |
|------|-------|
| Frontend URL | http://localhost:3000 |
| Backend URL | http://localhost:5000 |
| API Health | http://localhost:5000/api/health |
| Demo Email | admin@example.com |
| Demo Password | admin123 |

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# For port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Failed
1. Ensure MongoDB is running (`mongod` command)
2. Check `MONGODB_URI` in `backend/.env`
3. Verify your MongoDB connection string

### Dependencies Not Installed
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm run install-all
```

### Missing node_modules
```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

## 📚 Available Scripts

### Root Directory
```bash
npm run install-all      # Install all dependencies
npm start                # Start both backend and frontend
npm run build            # Build for production
npm test                 # Run tests
```

### Backend
```bash
npm run dev              # Start in development mode
npm run build            # Build TypeScript
npm start                # Run compiled version
npm test                 # Run tests
```

### Frontend
```bash
npm start                # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

## 🎯 Next Steps

1. **Explore the Dashboard** - See overview statistics
2. **Create a Request** - Submit a test approval request
3. **Review Requests** - Try approving/rejecting (login as manager)
4. **Check Analytics** - View request analysis (login as admin)
5. **Customize** - Modify colors, add features, integrate real APIs

## 📞 Support

For issues or questions:
1. Check the [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)
2. Review error messages in console
3. Verify MongoDB is running
4. Ensure correct port numbers (5000, 3000)

## ✨ Tips

- **Demo User Roles**: You can create users with different roles (user, manager, admin)
- **Auto-Approval**: Requests under $1000 with low risk are auto-approved
- **Risk Assessment**: The AI analyzes request title, description, amount, and category
- **Notifications**: System shows toast notifications for all important actions
- **Responsive Design**: Works on desktop, tablet, and mobile devices

Happy coding! 🎉
