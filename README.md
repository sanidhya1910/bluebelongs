# Blue Belongs - Diving School Website

A comprehensive full-stack diving school website for Andaman Islands, featuring SSI course booking, medical questionnaires, travel information, and complete backend integration.

## 🌊 Mission Statement

At BlueBelong, we guide people into the ocean — not to conquer it, but to reconnect with themselves through it. Whether you're a first-time diver, a soul seeking stillness, or a dreamer chasing deeper waters, our mission is to help you discover that the blue has always belonged to you.

**Calm. Confident. Connected.** That's how we dive.
**BlueBelong - you are the ocean**

## ✨ Features

- **SSI Certified Courses**: Complete catalog of 13+ diving courses from beginner to specialty
- **Full-Stack Booking System**: Real-time course booking with email confirmations
- **Medical Questionnaire**: Comprehensive medical form for diving safety compliance
- **Travel Itinerary**: Complete guide for reaching Andaman Islands
- **User Authentication**: Secure login/signup system
- **Responsive Design**: Mobile-first approach with blue ocean theme
- **Face-to-face Payment**: Local payment processing for course bookings
- **Email Integration**: Automated booking confirmations and notifications
- **Admin Dashboard**: Course management and booking oversight

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom blue theme
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

### Backend (Cloudflare Integration)
- **Hosting**: Cloudflare Pages (Static)
- **API**: Cloudflare Workers (Serverless)
- **Database**: Cloudflare D1 (SQLite)
- **Email**: SendGrid/Resend Integration
- **CDN**: Cloudflare Global Network

## 🏁 Quick Start

### Development Setup
1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd bluebelongs
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**: Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment
1. **Deploy to Cloudflare**:
   ```bash
   npm run deploy:full
   ```

2. **Set up database**:
   ```bash
   npm run db:migrate
   ```

3. **Deploy backend**:
   ```bash
   npm run worker:deploy
   ```

## 📁 Project Structure

```
src/
├── app/                       # Next.js App Router
│   ├── components/
│   │   └── Navigation.tsx     # Site navigation
│   ├── courses/
│   │   └── page.tsx          # SSI courses catalog with booking
│   ├── login/
│   │   └── page.tsx          # Authentication system
│   ├── medical-form/
│   │   └── page.tsx          # Diving medical questionnaire
│   ├── itinerary/
│   │   └── page.tsx          # Andaman travel guide
│   ├── globals.css           # Global styles and blue theme
│   ├── layout.tsx            # Root layout with navigation
│   └── page.tsx              # Homepage with mission statement
├── workers/
│   └── booking-api.js        # Cloudflare Workers API
├── database/
│   └── schema.sql            # D1 database schema
├── deploy.sh                 # Interactive deployment script
├── wrangler.toml            # Cloudflare Workers configuration
└── next.config.mjs          # Next.js static export config
```

## 🎯 SSI Course Offerings

### Entry Level Courses
- **Open Water Diver**: Foundation certification (3 days, 4 dives, ₹35,000)
- **Basic Diver**: Shallow water introduction (2 days, 2 dives, ₹25,000)
- **Pool Diver**: Confined water training (1 day, pool only, ₹15,000)

### Continuing Education
- **Advanced Adventurer**: Skills development (2 days, 5 dives, ₹30,000)
- **Stress & Rescue**: Emergency response (3 days, multiple scenarios, ₹40,000)
- **Master Diver**: Highest recreational level (certification program)

### Specialty Courses
- Deep Diving, Night & Limited Visibility, Navigation
- Wreck Diving, Drift Diving, Perfect Buoyancy
- Marine Ecology, Underwater Photography, Search & Recovery

## 🔧 Backend Architecture

### Cloudflare Workers API
- **Endpoints**: `/api/bookings`, `/api/courses`, `/api/contact`
- **Database**: D1 SQLite with automated migrations
- **Email**: SendGrid/Resend integration for confirmations
- **CORS**: Configured for frontend domain

### Database Schema
- **courses**: SSI course catalog and pricing
- **bookings**: Customer reservations and details
- **medical_forms**: Diving medical questionnaires
- **contact_inquiries**: General inquiries and support
- **email_logs**: Delivery tracking and debugging

### Email Integration
```javascript
// Booking confirmation emails
await sendBookingConfirmation(booking.email, {
  courseTitle: booking.course_title,
  dates: booking.preferred_dates,
  totalAmount: booking.total_amount
});
```

## 🚀 Cloudflare Deployment Guide

### Prerequisites
1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Install globally
   ```bash
   npm install -g wrangler
   wrangler login
   ```

### Automated Deployment
Run the interactive deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```

This script will:
- Build the static site for Cloudflare Pages
- Create D1 database and run migrations
- Deploy Cloudflare Workers API
- Set up email service integration
- Provide domain configuration guidance

### Manual Deployment Steps

#### 1. Deploy Frontend (Cloudflare Pages)
```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy out --project-name bluebelong
```

#### 2. Set Up Database (D1)
```bash
# Create D1 database
npx wrangler d1 create bluebelong-db

# Run migrations
npx wrangler d1 execute bluebelong-db --file=database/schema.sql
```

#### 3. Deploy API (Workers)
```bash
# Deploy Cloudflare Worker
npx wrangler deploy workers/booking-api.js
```

#### 4. Configure Environment Variables
In Cloudflare Dashboard > Workers > Your Worker > Settings > Variables:
```
DB_NAME=bluebelong-db
SENDGRID_API_KEY=your_sendgrid_key (optional)
RESEND_API_KEY=your_resend_key (optional)
FRONTEND_URL=https://bluebelong.pages.dev
```

## 🎨 Design System

### Blue Ocean Theme
- **Primary**: `#0ea5e9` (Tropical ocean blue)
- **Secondary**: `#0284c7` (Deep sea blue)  
- **Accent**: `#0c4a6e` (Midnight ocean)
- **Light**: `#e0f2fe` (Seafoam)
- **Gradient**: Ocean depths (sky-400 to cyan-600)

### Typography
- **Headings**: Clean, professional sans-serif
- **Body**: Readable font sizes with optimal contrast
- **Accents**: Diving-inspired styling for key elements

## 🔧 Development

### Adding New Courses
1. Update `database/schema.sql` with new course data
2. Run database migration: `npm run db:migrate`
3. Course data automatically populates from database

### Customizing Booking Flow
1. Modify `src/app/courses/page.tsx` for frontend changes
2. Update `workers/booking-api.js` for backend logic
3. Test with: `npm run dev` locally

### Email Templates
Customize email templates in `workers/booking-api.js`:
```javascript
const emailTemplate = `
  <h2>Booking Confirmation - Blue Belongs</h2>
  <p>Thank you for booking ${courseTitle}!</p>
  <!-- Your custom template -->
`;
```

## 🐛 Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clear cache and rebuild
rm -rf .next out
npm run build
```

**Database Connection:**
```bash
# Test D1 connection
npx wrangler d1 execute bluebelong-db --command="SELECT * FROM courses LIMIT 1;"
```

**Worker Deployment:**
```bash
# Check worker logs
npx wrangler tail
```

**Email Not Sending:**
- Verify API keys in Cloudflare Dashboard
- Check email service quotas
- Review worker logs for errors

## 📧 Email Integration Options

### Option 1: SendGrid
```bash
# Set up SendGrid
npm install @sendgrid/mail
# Add SENDGRID_API_KEY to worker environment
```

### Option 2: Resend
```bash
# Set up Resend
npm install resend
# Add RESEND_API_KEY to worker environment
```

## 🔒 Security Features

- **Form Validation**: Client and server-side validation
- **CORS Protection**: Configured for your domain only
- **Rate Limiting**: Built into Cloudflare Workers
- **Input Sanitization**: SQL injection prevention
- **HTTPS Only**: Enforced by Cloudflare

## 📱 Mobile Responsiveness

- **Tailwind CSS**: Mobile-first responsive design
- **Touch-Friendly**: Large buttons and form elements
- **Fast Loading**: Optimized images and static generation
- **PWA Ready**: Service worker setup available

## 🌐 SEO Optimization

- **Static Generation**: Pre-rendered pages for fast loading
- **Meta Tags**: Proper SEO meta data
- **Structured Data**: Schema markup for diving courses
- **Sitemap**: Auto-generated XML sitemap
- **Lighthouse Score**: 90+ performance rating

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌊 About Blue Belongs

Blue Belongs is a premium diving school in the Andaman Islands, dedicated to safe, professional dive training using SSI standards. We believe that every person has a natural connection to the ocean, and our mission is to help you discover and strengthen that bond through diving.

**Contact Information:**
- **Location**: Andaman Islands, India
- **Email**: info@bluebelong.com
- **Phone**: +91-XXXX-XXXX
- **Website**: https://bluebelong.pages.dev

---

*Calm. Confident. Connected. That's how we dive at Blue Belongs.*
out
```

**Manual Deployment:**
1. Install Wrangler CLI: `npm install -g wrangler`
2. Build the project: `npm run build`
3. Deploy: `npx wrangler pages deploy ./out`

**Alternative Deployment Platforms:**
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any platform supporting static sites

## Future Enhancements

- Backend API integration for real bookings
- Payment gateway integration
- User dashboard for course tracking
- Email notifications system
- Admin panel for course management
- Multi-language support
- Progressive Web App (PWA) features

## License

This project is for demonstration purposes. The design and functionality can be adapted for actual diving school businesses.

## Contact

For questions about this project or diving school services:
- Email: info@bluebelongs.com
- Phone: +91 98765 43210
- Location: Port Blair, Andaman Islands
