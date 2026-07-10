# Pet Adoption Management System - Setup Commands

## Prerequisites
- Node.js 16+ installed
- MySQL Server installed and running
- Git (optional)

## Database Setup

### 1. Create Database
```sql
-- Run in MySQL Workbench or command line
mysql -u root -p
```

### 2. Execute Database Scripts (in order)
```sql
-- 1. Main database schema
SOURCE C:\Dbms Project\pet_adoption_database.sql;

-- 2. Adoption workflow
SOURCE C:\Dbms Project\adoption_workflow.sql;

-- 3. Pet matching system
SOURCE C:\Dbms Project\pet_matching_system.sql;

-- 4. Veterinary records
SOURCE C:\Dbms Project\veterinary_records.sql;

-- 5. Shelter management
SOURCE C:\Dbms Project\shelter_management.sql;

-- 6. Reports and analytics
SOURCE C:\Dbms Project\reports_analytics.sql;

-- 7. Donation & volunteer system
SOURCE C:\Dbms Project\donation_volunteer_system.sql;

-- 8. Adoption certificates
SOURCE C:\Dbms Project\adoption_certificate.sql;
```

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd "C:\Dbms Project\frontend"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
```

## Alternative Port (if 3000 is occupied)
```bash
set PORT=3002 && npm start
```

## Production Build
```bash
npm run build
```

## Quick Start Commands

### Complete Setup (Run in Command Prompt)
```bash
# Navigate to project
cd "C:\Dbms Project\frontend"

# Install dependencies
npm install

# Start application
npm start
```

### If PowerShell Execution Policy Error
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Verify Installation
- Frontend: http://localhost:3000 (or 3002)
- Database: Check MySQL connection
- All features should work with mock data

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port
set PORT=3002 && npm start
```

### Node Modules Issues
```bash
# Clear cache and reinstall
npm cache clean --force
rmdir /s node_modules
del package-lock.json
npm install
```

### Database Connection Issues
- Ensure MySQL is running
- Check credentials in connection string
- Verify database exists
- Run scripts in correct order