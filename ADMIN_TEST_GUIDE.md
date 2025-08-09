# Test Admin Functionality

## Test Login with Admin User
- Navigate to: https://6c67007a.bluebelongs.pages.dev/login
- Email: admin@bluebelongs.com  
- Password: admin123
- Should redirect to `/admin/dashboard`

## Test Course Management
1. **View Courses**: Admin dashboard should show all existing courses
2. **Add New Course**: Click "Add New Course" button to create a new course
3. **Edit Course**: Click edit button on any course to modify it
4. **Delete Course**: Click delete button to disable a course (soft delete)

## Test Forgot Password
- On login page, click "Forgot password?"
- Enter email address
- Should show success message (reset link in console for demo)

## Regular User Flow
- Regular users should be redirected to `/dashboard` (not admin dashboard)
- Admin users should be redirected to `/admin/dashboard`

## Backend Endpoints Added
- `POST /api/auth/forgot-password` - Password reset request
- `GET /api/admin/courses` - Get all courses (admin only)  
- `POST /api/admin/courses` - Create new course (admin only)
- `PUT /api/admin/courses/:id` - Update course (admin only)
- `DELETE /api/admin/courses/:id` - Disable course (admin only)

## Database Changes
- Added `password_resets` table for forgot password functionality
- Courses can now be managed via admin dashboard
- All course data is stored in database (no hardcoded courses in frontend)

## Security Features
- Admin-only endpoints protected by JWT verification
- Role-based access control (admin vs customer)
- Soft delete for courses (to preserve booking history)
- Password reset tokens with expiration
- Email enumeration protection in forgot password
