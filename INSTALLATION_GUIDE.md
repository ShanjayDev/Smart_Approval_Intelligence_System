# Smart Approval Intelligence System - Installation Guide

## Prerequisites
- Node.js 16+ and npm 8+
- MongoDB installed and running locally, or access to MongoDB Atlas
- VS Code (recommended)

## Quick Start - Option 1: Install All at Once

```bash
cd d:\Smart_Approval_Intelligence
npm run install-all
```

## Quick Start - Option 2: Manual Installation

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

### Frontend Setup
```bash
cd frontend
npm install
```

## Configuration

### Backend (.env)
Edit `backend/.env` with your settings:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Change to a secure random string
- `PORT`: API port (default: 5000)
- `ADMIN_EMAIL`/`ADMIN_PASSWORD`: Demo admin credentials

### Frontend (.env)
The default is already configured for localhost:
```
REACT_APP_API_URL=http://localhost:5000
```

## Running the Application

### Option 1: Start Both Services
From the root directory:
```bash
npm start
```

### Option 2: Start Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Access URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Default Login Credentials
- Email: `admin@example.com`
- Password: `admin123`

## MongoDB Setup

### Local MongoDB
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

## Project Structure

```
smart-approval-intelligence/
├── backend/
│   ├── src/
│   │   ├── models/        (Database schemas)
│   │   ├── controllers/   (Business logic)
│   │   ├── routes/        (API endpoints)
│   │   ├── middleware/    (Auth, error handling)
│   │   ├── utils/         (AI, rules, helpers)
│   │   └── server.ts      (Entry point)
│   ├── .env               (Environment variables)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    (React components)
│   │   ├── pages/         (Page components)
│   │   ├── services/      (API client)
│   │   ├── hooks/         (Custom hooks)
│   │   ├── types/         (TypeScript types)
│   │   ├── styles/        (CSS/Tailwind)
│   │   ├── App.tsx        (Main app)
│   │   └── index.tsx      (Entry point)
│   ├── .env               (Environment variables)
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `POST /api/auth/logout` - Logout

### Requests
- `GET /api/requests` - Get my requests
- `POST /api/requests` - Create request
- `GET /api/requests/:id` - Get request details
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request

### Review Queue
- `GET /api/review-queue` - Get pending requests
- `POST /api/review-queue/:id/approve` - Approve
- `POST /api/review-queue/:id/reject` - Reject
- `POST /api/review-queue/:id/comments` - Add comment

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/requests` - Request analytics
- `GET /api/analytics/trends` - Approval trends

### AI Service
- `POST /api/ai/assess-risk` - AI risk assessment

## Building for Production

```bash
npm run build
```

This creates optimized builds in:
- `backend/dist/`
- `frontend/build/`

## Troubleshooting

### Port Already in Use
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify firewall settings

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

1. **Hot Reload**:
   - Frontend: Vite automatically reloads on save
   - Backend: Use `npm run watch` to watch TypeScript files

2. **Debugging**:
   - Backend: Add `console.log` statements
   - Frontend: Use browser DevTools (F12)

3. **Testing**:
   ```bash
   cd backend && npm test
   cd frontend && npm test
   ```

## Support & Issues

For issues or questions:
1. Check MongoDB connection
2. Verify ports 5000 and 3000 are available
3. Check console for error messages
4. Review .env configuration

## License
MIT
