# Blue Belongs Diving School - Backend Integration Guide

## 🚀 Deployment Options for Static Site + Backend

### Option 1: Cloudflare Pages + Workers + D1 (Recommended)

**Pros:**
- Single platform solution
- Global edge network
- Built-in database (D1)
- Serverless functions (Workers)
- Free tier available

**Setup:**
1. Deploy static site to Cloudflare Pages
2. Create Cloudflare Worker for API endpoints
3. Set up D1 database for bookings
4. Configure domain and routing

### Option 2: Vercel + Vercel Functions + PlanetScale

**Pros:**
- Excellent Next.js integration
- Built-in API routes
- Global database with PlanetScale
- Easy deployment

**Setup:**
1. Deploy to Vercel (automatic with Git)
2. Add API routes in `/pages/api/` or `/app/api/`
3. Connect PlanetScale MySQL database
4. Environment variables for database connection

### Option 3: Netlify + Netlify Functions + Supabase

**Pros:**
- Great static site hosting
- Serverless functions
- PostgreSQL database with Supabase
- Real-time features

**Setup:**
1. Deploy to Netlify
2. Create Netlify Functions for API
3. Set up Supabase database
4. Configure authentication if needed

### Option 4: Static Site + External API Service

**Pros:**
- Separation of concerns
- Can use any backend technology
- Scalable architecture

**Setup:**
1. Deploy static site to Cloudflare Pages
2. Create separate backend (Node.js, Python, etc.)
3. Deploy backend to Railway, Render, or DigitalOcean
4. Configure CORS for cross-origin requests

## 📝 Database Schema for Bookings

```sql
-- Cloudflare D1 / SQLite Schema
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  course_price TEXT,
  preferred_date DATE NOT NULL,
  experience TEXT,
  medical_cleared BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
  payment_status TEXT DEFAULT 'pending', -- pending, paid, cancelled
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  dives INTEGER,
  price TEXT,
  level TEXT,
  certification TEXT,
  category TEXT,
  available BOOLEAN DEFAULT TRUE
);

CREATE TABLE medical_forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  medical_answers JSON, -- Store medical questionnaire answers
  physician_approval BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
```

## 🔧 API Endpoints Needed

### 1. Bookings API
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}` - Update booking status
- `DELETE /api/bookings/{id}` - Cancel booking

### 2. Courses API
- `GET /api/courses` - List all courses
- `GET /api/courses/{id}` - Get course details
- `PUT /api/courses/{id}` - Update course (admin only)

### 3. Medical Forms API
- `POST /api/medical-forms` - Submit medical form
- `GET /api/medical-forms/{booking-id}` - Get medical form

### 4. Contact/Inquiry API
- `POST /api/contact` - Contact form submissions

## 📧 Email Integration Options

### Option 1: Cloudflare Email Workers
- Native Cloudflare solution
- Send transactional emails
- Good for confirmations

### Option 2: SendGrid
- Reliable email service
- Easy API integration
- Template management

### Option 3: Resend
- Developer-friendly
- React email templates
- Good pricing

### Option 4: Nodemailer + SMTP
- Self-hosted solution
- Use Gmail SMTP or custom server
- Full control

## 💳 Payment Integration

### For Face-to-Face Payments (Current Model):
- Store booking with "pending" payment status
- Send confirmation with payment instructions
- Admin can update payment status manually

### For Online Payments (Future Enhancement):
- **Razorpay** (Popular in India)
- **Stripe** (Global solution)
- **PayU** (India-focused)
- **Cashfree** (India-focused)

## 🔐 Authentication Options

### Option 1: NextAuth.js
- Multiple providers (Google, Facebook, email)
- JWT tokens
- Database sessions

### Option 2: Clerk
- Complete auth solution
- User management UI
- Easy integration

### Option 3: Supabase Auth
- Built-in with Supabase
- Social providers
- Row-level security

## 📱 Admin Dashboard Features

### Booking Management:
- View all bookings
- Update booking status
- Send confirmation emails
- Export booking data

### Course Management:
- Add/edit courses
- Manage availability
- Update pricing

### Customer Communication:
- Email templates
- Bulk notifications
- Customer inquiries

## 🚀 Quick Start with Cloudflare (Recommended)

1. **Deploy Static Site:**
```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy ./out --project-name=bluebelongs-diving
```

2. **Create D1 Database:**
```bash
# Create database
npx wrangler d1 create bluebelongs-bookings

# Run migrations
npx wrangler d1 execute bluebelongs-bookings --file=./database/schema.sql
```

3. **Deploy Worker:**
```bash
# Deploy booking API worker
npx wrangler deploy workers/booking-api.js
```

4. **Configure Domain:**
- Set up custom domain in Cloudflare Pages
- Configure worker routes for `/api/*`

## 💰 Cost Estimation

### Cloudflare Pages + Workers + D1:
- **Free Tier:** 100,000 requests/month, 5GB storage
- **Paid:** $5/month for higher limits
- **D1:** Free tier: 5M row reads, 100K writes/month

### Vercel + PlanetScale:
- **Free Tier:** Good for development
- **Pro:** $20/month Vercel + $29/month PlanetScale

### Email Services:
- **SendGrid:** Free tier: 100 emails/day
- **Resend:** Free tier: 3,000 emails/month

## 📞 Contact Information Management

For now, you can add contact information in the frontend:

```tsx
// Contact details to display
const contactInfo = {
  email: 'info@bluebelongs.com',
  phone: '+91-XXXX-XXXX',
  whatsapp: '+91-XXXX-XXXX',
  address: 'Havelock Island, Andaman & Nicobar Islands',
  instagram: '@bluebelongs',
  facebook: 'BluebelongsDiving'
};
```

This setup allows you to start with a static site and gradually add backend functionality as needed!
