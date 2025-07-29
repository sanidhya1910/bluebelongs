# Blue Belongs - Diving School Website

A modern Next.js website for a diving school business in Andaman Islands, featuring course booking, medical questionnaires, and travel information.

## Features

- **Homepage**: Hero section with diving courses overview and testimonials
- **Course Listings**: Detailed PADI certified courses with booking functionality
- **Medical Questionnaire**: Comprehensive medical form for diving safety
- **Travel Itinerary**: Complete guide for reaching Andaman Islands
- **Authentication**: Login/signup system (demo implementation)
- **Responsive Design**: Mobile-first approach with blue ocean theme
- **Face-to-face Payment**: Booking system supports in-person payments

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: NextAuth.js (ready for implementation)
- **Forms**: React Hook Form with Zod validation (ready for implementation)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── Navigation.tsx      # Site navigation
│   ├── courses/
│   │   └── page.tsx           # Courses listing and booking
│   ├── login/
│   │   └── page.tsx           # Authentication page
│   ├── medical-form/
│   │   └── page.tsx           # Medical questionnaire
│   ├── itinerary/
│   │   └── page.tsx           # Travel guide
│   ├── globals.css            # Global styles and theme
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage
```

## Features Overview

### Course Booking
- Display of PADI certified courses
- Detailed course information and pricing
- Booking form with personal details
- Face-to-face payment confirmation
- Medical form requirement integration

### Medical Questionnaire
- Comprehensive diving safety questionnaire
- Automatic physician approval requirements
- Form validation and submission
- Printable format for records

### Travel Itinerary
- Transportation options to Andaman
- Sample itinerary for diving trips
- Essential travel information
- Packing checklist
- Local recommendations

### Design Theme
- Ocean-inspired blue color palette
- Professional diving school aesthetics
- Mobile-responsive layouts
- Accessible form designs
- Clean typography and spacing

## Color Palette

The design uses various shades of blue throughout:
- Primary Blue: `#0ea5e9` (sky-500)
- Secondary Blue: `#0284c7` (sky-600)
- Dark Blue: `#0c4a6e` (sky-900)
- Light Blue: `#e0f2fe` (sky-50)
- Ocean Gradient: sky-400 to cyan-600

## Development

### Adding New Features
1. Create new pages in the `src/app` directory
2. Update navigation in `components/Navigation.tsx`
3. Follow the established design patterns and color scheme

### Customizing Styles
- Global styles are in `src/app/globals.css`
- Component-specific styles use Tailwind classes
- Custom CSS utilities are defined in the globals file

## Deployment

The project is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any platform supporting Node.js

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
