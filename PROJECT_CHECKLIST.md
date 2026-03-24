- [ ] Verify project structure created
- [ ] Install all dependencies (npm run install-all)
- [ ] Configure MongoDB connection
- [ ] Start backend server (npm run start:backend)
- [ ] Start frontend server (npm run start:frontend)
- [ ] Login with admin@example.com / admin123
- [ ] Test creating an approval request
- [ ] Test risk assessment feature
- [ ] Test manager review queue
- [ ] Test analytics dashboard
- [ ] Verify all pages are working

## Common Commands

### Development
```bash
# Install dependencies
npm run install-all

# Start all services
npm start

# Start only backend
cd backend && npm run dev

# Start only frontend
cd frontend && npm start

# Build for production
npm run build
```

### Database
```bash
# Start MongoDB locally
mongod

# Access MongoDB shell
mongo

# List databases
show dbs

# Use smart-approval database
use smart-approval

# View collections
show collections

# Query users
db.users.find()

# Query requests
db.approvalrequests.find()
```

### Troubleshooting
```bash
# Clear node modules
rm -rf node_modules package-lock.json

# Reinstall
npm run install-all

# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Project Health Check

### ✓ What Should Work
- [x] User login/registration
- [x] Dashboard statistics
- [x] Request submission with AI risk assessment
- [x] Auto-approval of low-risk requests
- [x] Request filtering and search
- [x] Review queue for managers
- [x] Approve/reject functionality
- [x] Comments on requests
- [x] Admin analytics and reports
- [x] Toast notifications
- [x] Responsive design

### 📊 Database Collections
- `users` - User accounts and profiles
- `approvalrequests` - All approval requests
- `approvalrules` - Auto-approval rules
- `activitylogs` - System activity logs

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |

You can register additional users for testing different roles.

## Testing Scenarios

### Scenario 1: Auto-Approval
1. Login as user
2. Submit request under $1000 with low-risk keywords
3. Should automatically approve

### Scenario 2: Manual Review
1. Login as user
2. Submit request over $5000
3. Gets sent to review queue
4. Login as manager to approve/reject

### Scenario 3: Analytics
1. Create multiple requests
2. Login as admin
3. Go to Analytics page
4. View distribution charts and trends

## Performance Notes

- Auto-approval decisions are instant (< 100ms)
- Dashboard loads with aggregated statistics
- Analytics supports filtering by time period
- Charts render using Chart.js library
- All API calls are asynchronous

## Next Development Steps

1. **Add Email Notifications** - Send emails for approvals
2. **User Management** - Admin panel for user management
3. **Database Backups** - Set up automated MongoDB backups
4. **Payment Integration** - Add payment processing for approved requests
5. **Mobile App** - React Native version
6. **API Documentation** - Swagger/OpenAPI documentation
7. **Advanced AI** - Integrate with OpenAI or similar
8. **Real-time Updates** - WebSocket for live notifications
