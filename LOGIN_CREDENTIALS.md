# Login Credentials

## Test Accounts

The system has been set up with two test accounts for username/password authentication:

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Administrator
- **Permissions:**
  - ✅ View all pages
  - ✅ Add/edit/delete planners
  - ✅ Add/edit/delete numbers
  - ✅ Access "Add Planner" page

### Planner Account
- **Username:** `planner`
- **Password:** `planner123`
- **Role:** Planner
- **Permissions:**
  - ✅ View Dashboard and Number Log pages
  - ✅ Add and edit numbers
  - ❌ Cannot delete numbers
  - ❌ Cannot access "Add Planner" page
  - ❌ Cannot add/delete planner accounts

## How to Login

1. Open the application
2. You'll be automatically redirected to the login page
3. Enter username and password from the credentials above
4. Click "Sign In"

## Role-Based Access Control

The system enforces role restrictions at multiple levels:

1. **UI Level:** Buttons and menu items are hidden based on role
2. **Database Level:** Row Level Security (RLS) policies prevent unauthorized operations
3. **API Level:** All operations check user permissions before executing

This ensures security even if someone tries to bypass the UI restrictions.
