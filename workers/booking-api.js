// Blue Belongs Diving School - Cloudflare Worker API
// Handles bookings, contact forms, and course management

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGINS || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      let response;

      // Route handling
      if (path === '/api/auth/login' && request.method === 'POST') {
        response = await handleLogin(request, env);
      } else if (path === '/api/auth/register' && request.method === 'POST') {
        response = await handleRegister(request, env);
      } else if (path === '/api/auth/profile' && request.method === 'GET') {
        response = await handleProfile(request, env);
      } else if (path === '/api/dashboard/stats' && request.method === 'GET') {
        response = await handleDashboardStats(request, env);
      } else if (path === '/api/bookings' && request.method === 'POST') {
        response = await handleBookingCreate(request, env);
      } else if (path === '/api/bookings' && request.method === 'GET') {
        response = await handleBookingsGet(request, env);
      } else if (path.startsWith('/api/bookings/') && request.method === 'GET') {
        const bookingId = path.split('/')[3];
        response = await handleBookingGet(bookingId, env);
      } else if (path === '/api/courses' && request.method === 'GET') {
        response = await handleCoursesGet(env);
      } else if (path === '/api/contact' && request.method === 'POST') {
        response = await handleContactForm(request, env);
      } else if (path === '/api/medical-form' && request.method === 'POST') {
        response = await handleMedicalForm(request, env);
      } else {
        response = new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Add CORS headers to response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};

// Handle booking creation
async function handleBookingCreate(request, env) {
  try {
    const booking = await request.json();
    
    // Validate required fields
    const { name, email, phone, courseId, preferredDate } = booking;
    
    if (!name || !email || !phone || !courseId || !preferredDate) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get course details
    const courseStmt = env.DB.prepare('SELECT * FROM courses WHERE id = ?');
    const course = await courseStmt.bind(courseId).first();
    
    if (!course) {
      return new Response(JSON.stringify({ error: 'Course not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert booking
    const insertStmt = env.DB.prepare(`
      INSERT INTO bookings (name, email, phone, course_id, course_name, course_price, preferred_date, experience, medical_cleared, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = await insertStmt.bind(
      name,
      email,
      phone,
      courseId,
      course.title,
      course.price,
      preferredDate,
      booking.experience || '',
      booking.medicalCleared || false,
      new Date().toISOString()
    ).run();

    const bookingId = result.meta.last_row_id;

    // Send confirmation email
    try {
      await sendBookingConfirmationEmail(env, {
        bookingId,
        name,
        email,
        courseName: course.title,
        coursePrice: course.price,
        preferredDate,
        duration: course.duration,
        dives: course.dives
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the booking if email fails
    }

    return new Response(JSON.stringify({
      success: true,
      bookingId,
      message: 'Booking created successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create booking' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle booking retrieval
async function handleBookingGet(bookingId, env) {
  try {
    const stmt = env.DB.prepare('SELECT * FROM bookings WHERE id = ?');
    const booking = await stmt.bind(bookingId).first();
    
    if (!booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(booking), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Booking retrieval error:', error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve booking' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle courses listing
async function handleCoursesGet(env) {
  try {
    const stmt = env.DB.prepare('SELECT * FROM courses WHERE available = TRUE ORDER BY category, title');
    const { results } = await stmt.all();
    
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Courses retrieval error:', error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve courses' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle contact form
async function handleContactForm(request, env) {
  try {
    const contact = await request.json();
    const { name, email, phone, subject, message } = contact;
    
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stmt = env.DB.prepare(`
      INSERT INTO contact_inquiries (name, email, phone, subject, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = await stmt.bind(
      name,
      email,
      phone || '',
      subject || 'General Inquiry',
      message,
      new Date().toISOString()
    ).run();

    // Send notification email to admin
    try {
      await sendContactNotificationEmail(env, contact);
    } catch (emailError) {
      console.error('Contact notification email failed:', emailError);
    }

    return new Response(JSON.stringify({
      success: true,
      inquiryId: result.meta.last_row_id,
      message: 'Contact inquiry submitted successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Failed to submit contact inquiry' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle medical form submission
async function handleMedicalForm(request, env) {
  try {
    const medicalForm = await request.json();
    const { bookingId, name, email, medicalAnswers, physicianApproval } = medicalForm;
    
    if (!bookingId || !name || !email || !medicalAnswers) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stmt = env.DB.prepare(`
      INSERT INTO medical_forms (booking_id, name, email, medical_answers, physician_approval, form_completed, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = await stmt.bind(
      bookingId,
      name,
      email,
      JSON.stringify(medicalAnswers),
      physicianApproval || false,
      true,
      new Date().toISOString()
    ).run();

    return new Response(JSON.stringify({
      success: true,
      medicalFormId: result.meta.last_row_id,
      message: 'Medical form submitted successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Medical form error:', error);
    return new Response(JSON.stringify({ error: 'Failed to submit medical form' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Email functions (you'll need to implement with your chosen email service)
async function sendBookingConfirmationEmail(env, bookingData) {
  // This is a placeholder - implement with SendGrid, Resend, or similar
  console.log('Sending booking confirmation email:', bookingData);
  
  // Example with SendGrid (uncomment and configure):
  /*
  const response = await fetch('https://api.sendgrid.v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: bookingData.email, name: bookingData.name }]
      }],
      from: { email: 'bookings@bluebelongs.com', name: 'Blue Belongs Diving' },
      subject: `Booking Confirmation - ${bookingData.courseName}`,
      content: [{
        type: 'text/html',
        value: generateBookingEmailTemplate(bookingData)
      }]
    })
  });
  */
}

async function sendContactNotificationEmail(env, contactData) {
  // Placeholder for contact notification email
  console.log('Sending contact notification email:', contactData);
}

function generateBookingEmailTemplate(data) {
  return `
    <h2>Booking Confirmation - Blue Belongs Diving School</h2>
    <p>Dear ${data.name},</p>
    <p>Thank you for booking with Blue Belongs! Your diving adventure awaits.</p>
    
    <h3>Booking Details:</h3>
    <ul>
      <li><strong>Booking ID:</strong> #${data.bookingId}</li>
      <li><strong>Course:</strong> ${data.courseName}</li>
      <li><strong>Price:</strong> ${data.coursePrice}</li>
      <li><strong>Duration:</strong> ${data.duration}</li>
      <li><strong>Number of Dives:</strong> ${data.dives}</li>
      <li><strong>Preferred Date:</strong> ${data.preferredDate}</li>
    </ul>
    
    <h3>Next Steps:</h3>
    <ol>
      <li>We'll contact you within 24 hours to confirm your slot</li>
      <li>Complete the medical questionnaire (if required)</li>
      <li>Payment can be made face-to-face at our center</li>
    </ol>
    
    <p>Looking forward to diving with you!</p>
    <p>Blue Belongs Team<br>
    Havelock Island, Andaman</p>
  `;
}

// Authentication handlers
async function handleLogin(request, env) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user from database
    const userStmt = env.DB.prepare('SELECT * FROM users WHERE email = ?');
    const user = await userStmt.bind(email).first();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Simple password hash verification (in production, use bcrypt)
    const expectedHash = await hashPassword(password);
    if (user.password_hash !== expectedHash) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create JWT token (simplified)
    const token = await createJWT({ userId: user.id, email: user.email, role: user.role });
    
    return new Response(JSON.stringify({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        certification_level: user.certification_level,
        total_dives: user.total_dives
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Login failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleRegister(request, env) {
  try {
    const { name, email, password, phone } = await request.json();
    
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'Name, email and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user already exists
    const existingUserStmt = env.DB.prepare('SELECT id FROM users WHERE email = ?');
    const existingUser = await existingUserStmt.bind(email).first();
    
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const insertStmt = env.DB.prepare(`
      INSERT INTO users (name, email, password_hash, phone, role)
      VALUES (?, ?, ?, ?, 'customer')
    `);
    
    const result = await insertStmt.bind(name, email, passwordHash, phone || null).run();
    
    if (result.success) {
      const token = await createJWT({ userId: result.meta.last_row_id, email, role: 'customer' });
      
      return new Response(JSON.stringify({
        success: true,
        token,
        user: {
          id: result.meta.last_row_id,
          name,
          email,
          role: 'customer',
          certification_level: null,
          total_dives: 0
        }
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error('Failed to create user');
    }

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'Registration failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleProfile(request, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = await verifyJWT(token);
    
    // Get user details
    const userStmt = env.DB.prepare('SELECT id, name, email, role, phone, certification_level, total_dives, created_at FROM users WHERE id = ?');
    const user = await userStmt.bind(payload.userId).first();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user's bookings
    const bookingsStmt = env.DB.prepare('SELECT * FROM bookings WHERE email = ? ORDER BY created_at DESC LIMIT 10');
    const bookings = await bookingsStmt.bind(user.email).all();

    return new Response(JSON.stringify({
      user,
      bookings: bookings.results || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Profile error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get profile' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDashboardStats(request, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = await verifyJWT(token);
    
    // Get dashboard statistics
    const totalBookingsStmt = env.DB.prepare('SELECT COUNT(*) as count FROM bookings');
    const totalBookings = await totalBookingsStmt.first();
    
    const pendingBookingsStmt = env.DB.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");
    const pendingBookings = await pendingBookingsStmt.first();
    
    const confirmedBookingsStmt = env.DB.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'");
    const confirmedBookings = await confirmedBookingsStmt.first();
    
    const totalUsersStmt = env.DB.prepare('SELECT COUNT(*) as count FROM users');
    const totalUsers = await totalUsersStmt.first();
    
    const recentBookingsStmt = env.DB.prepare('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5');
    const recentBookings = await recentBookingsStmt.all();

    return new Response(JSON.stringify({
      stats: {
        totalBookings: totalBookings.count,
        pendingBookings: pendingBookings.count,
        confirmedBookings: confirmedBookings.count,
        totalUsers: totalUsers.count
      },
      recentBookings: recentBookings.results || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get dashboard stats' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleBookingsGet(request, env) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    let query = 'SELECT * FROM bookings ORDER BY created_at DESC';
    let params = [];
    
    if (status) {
      query = 'SELECT * FROM bookings WHERE status = ? ORDER BY created_at DESC';
      params = [status];
    }
    
    const stmt = env.DB.prepare(query);
    const result = await stmt.bind(...params).all();
    
    return new Response(JSON.stringify(result.results || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get bookings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Utility functions
async function hashPassword(password) {
  // Simple hash for demo - in production use bcrypt
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'bluebelongs_salt');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function createJWT(payload) {
  // Simplified JWT for demo - in production use proper JWT library
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify({ ...payload, exp: Date.now() + (24 * 60 * 60 * 1000) }));
  return `${encodedHeader}.${encodedPayload}.signature`;
}

async function verifyJWT(token) {
  try {
    const [header, payload, signature] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    
    if (decodedPayload.exp < Date.now()) {
      throw new Error('Token expired');
    }
    
    return decodedPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
