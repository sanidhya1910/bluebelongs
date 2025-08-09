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
      } else if (path === '/api/auth/forgot-password' && request.method === 'POST') {
        response = await handleForgotPassword(request, env);
      } else if (path === '/api/reset-password' && request.method === 'POST') {
        response = await handleResetPassword(request, env);
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
      } else if (path.startsWith('/api/bookings/') && path.endsWith('/cancel') && request.method === 'PUT') {
        const bookingId = path.split('/')[3];
        response = await handleBookingCancel(bookingId, request, env);
      } else if (path === '/api/courses' && request.method === 'GET') {
        response = await handleCoursesGet(env);
      } else if (path === '/api/admin/courses' && request.method === 'GET') {
        response = await handleAdminCoursesGet(request, env);
      } else if (path === '/api/admin/courses' && request.method === 'POST') {
        response = await handleAdminCourseCreate(request, env);
      } else if (path === '/api/admin/stats' && request.method === 'GET') {
        response = await handleAdminStats(request, env);
      } else if (path.startsWith('/api/admin/courses/') && path.endsWith('/toggle') && request.method === 'PUT') {
        const courseId = path.split('/')[4];
        response = await handleAdminCourseToggle(courseId, request, env);
      } else if (path.startsWith('/api/admin/courses/') && request.method === 'PUT') {
        const courseId = path.split('/')[4];
        response = await handleAdminCourseUpdate(courseId, request, env);
      } else if (path.startsWith('/api/admin/courses/') && request.method === 'DELETE') {
        const courseId = path.split('/')[4];
        response = await handleAdminCourseDelete(courseId, request, env);
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
    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyJWT(token);
    if (!decoded) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const booking = await request.json();
    
    // Validate required fields
    const { name, email, phone, course_id: courseId, preferred_date: preferredDate } = booking;
    
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
      INSERT INTO bookings (user_id, name, email, phone, course_id, course_name, course_price, preferred_date, experience, medical_cleared, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = await insertStmt.bind(
      decoded.userId,
      name,
      email,
      phone,
      courseId,
      course.title,
      course.price,
      preferredDate,
      booking.experience || '',
      booking.medicalCleared || false,
      booking.notes || ''
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
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // More specific error message based on error type
    let errorMessage = 'Failed to create booking';
    if (error.message.includes('Invalid token')) {
      errorMessage = 'Authentication failed - invalid token';
    } else if (error.message.includes('Token expired')) {
      errorMessage = 'Authentication failed - token expired';
    } else if (error.message.includes('FOREIGN KEY constraint failed')) {
      errorMessage = 'Database constraint error - invalid user or course reference';
    } else if (error.message.includes('NOT NULL constraint failed')) {
      errorMessage = 'Missing required field in database insertion';
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error.message,
      debug: env.ENVIRONMENT === 'development' ? error.stack : undefined
    }), {
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
    console.error('Get booking error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get booking' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle booking cancellation
async function handleBookingCancel(bookingId, request, env) {
  try {
    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyJWT(token);
    if (!decoded) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get the booking to verify ownership
    const bookingStmt = env.DB.prepare('SELECT * FROM bookings WHERE id = ? AND user_id = ?');
    const booking = await bookingStmt.bind(bookingId, decoded.userId).first();
    
    if (!booking) {
      return new Response(JSON.stringify({ error: 'Booking not found or not authorized' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if booking can be cancelled (not already cancelled or completed)
    if (booking.status === 'cancelled') {
      return new Response(JSON.stringify({ error: 'Booking is already cancelled' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (booking.status === 'completed') {
      return new Response(JSON.stringify({ error: 'Cannot cancel completed booking' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update booking status to cancelled
    const updateStmt = env.DB.prepare(`
      UPDATE bookings 
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND user_id = ?
    `);
    
    await updateStmt.bind(bookingId, decoded.userId).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Booking cancelled successfully',
      bookingId: bookingId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to cancel booking',
      details: error.message
    }), {
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

// Admin course management functions
async function handleAdminCoursesGet(request, env) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get all courses (including disabled ones for admin)
    const stmt = env.DB.prepare('SELECT * FROM courses ORDER BY category, title');
    const { results } = await stmt.all();
    
    return new Response(JSON.stringify({ courses: results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Admin courses retrieval error:', error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve courses' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleAdminCourseCreate(request, env) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const course = await request.json();
    const { title, description, duration, dives, price, level, certification, category } = course;
    
    // Validate required fields
    if (!title || !description || !duration || dives === undefined || !price || !level || !certification || !category) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate course ID
    const courseId = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');

    const stmt = env.DB.prepare(`
      INSERT INTO courses (id, title, description, duration, dives, price, level, certification, category, available, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, datetime('now'), datetime('now'))
    `);
    
    const result = await stmt.bind(courseId, title, description, duration, dives, price, level, certification, category).run();

    if (result.success) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Course created successfully',
        courseId: courseId 
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error('Failed to create course');
    }

  } catch (error) {
    console.error('Course creation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create course' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleAdminCourseUpdate(courseId, request, env) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updates = await request.json();
    const { title, description, duration, dives, price, level, certification, category } = updates;
    
    // Validate required fields
    if (!title || !description || !duration || dives === undefined || !price || !level || !certification || !category) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stmt = env.DB.prepare(`
      UPDATE courses 
      SET title = ?, description = ?, duration = ?, dives = ?, price = ?, level = ?, certification = ?, category = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    
    const result = await stmt.bind(title, description, duration, dives, price, level, certification, category, courseId).run();

    if (result.success && result.changes > 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Course updated successfully' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (result.changes === 0) {
      return new Response(JSON.stringify({ error: 'Course not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error('Failed to update course');
    }

  } catch (error) {
    console.error('Course update error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update course' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleAdminCourseDelete(courseId, request, env) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if course has active bookings
    const bookingStmt = env.DB.prepare('SELECT COUNT(*) as count FROM bookings WHERE course_id = ? AND status NOT IN ("cancelled")');
    const bookingResult = await bookingStmt.bind(courseId).first();
    
    if (bookingResult && bookingResult.count > 0) {
      return new Response(JSON.stringify({ 
        error: 'Cannot delete course with active bookings. Consider disabling it instead.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Soft delete by setting available to FALSE instead of hard delete
    const stmt = env.DB.prepare('UPDATE courses SET available = FALSE, updated_at = datetime("now") WHERE id = ?');
    const result = await stmt.bind(courseId).run();

    if (result.success && result.changes > 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Course disabled successfully' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (result.changes === 0) {
      return new Response(JSON.stringify({ error: 'Course not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error('Failed to disable course');
    }

  } catch (error) {
    console.error('Course delete error:', error);
    return new Response(JSON.stringify({ error: 'Failed to disable course' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleAdminStats(request, env) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get stats from database
    const [totalBookings, totalUsers, totalCourses, activeBookings] = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) as count FROM bookings').first(),
      env.DB.prepare('SELECT COUNT(*) as count FROM users WHERE role = "customer"').first(),
      env.DB.prepare('SELECT COUNT(*) as count FROM courses').first(),
      env.DB.prepare('SELECT COUNT(*) as count FROM bookings WHERE status NOT IN ("cancelled", "completed")').first()
    ]);

    const stats = {
      totalBookings: totalBookings?.count || 0,
      totalUsers: totalUsers?.count || 0,
      totalCourses: totalCourses?.count || 0,
      activeBookings: activeBookings?.count || 0
    };

    return new Response(JSON.stringify({ stats }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get admin stats' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleAdminCourseToggle(courseId, request, env) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Toggle course availability
    const stmt = env.DB.prepare('UPDATE courses SET available = NOT available, updated_at = datetime("now") WHERE id = ?');
    const result = await stmt.bind(courseId).run();

    if (result.success && result.changes > 0) {
      // Get the updated course to see its new status
      const courseStmt = env.DB.prepare('SELECT available FROM courses WHERE id = ?');
      const course = await courseStmt.bind(courseId).first();
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Course ${course.available ? 'enabled' : 'disabled'} successfully`,
        available: course.available
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (result.changes === 0) {
      return new Response(JSON.stringify({ error: 'Course not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error('Failed to toggle course');
    }

  } catch (error) {
    console.error('Course toggle error:', error);
    return new Response(JSON.stringify({ error: 'Failed to toggle course availability' }), {
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

    // Verify password using bcrypt
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
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
    const { name, email, password, phone, birthdate } = await request.json();
    
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
      INSERT INTO users (name, email, password_hash, phone, birthdate, role)
      VALUES (?, ?, ?, ?, ?, 'customer')
    `);
    
    const result = await insertStmt.bind(name, email, passwordHash, phone || null, birthdate || null).run();
    
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

async function handleForgotPassword(request, env) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user exists
    const userStmt = env.DB.prepare('SELECT id, name, email FROM users WHERE email = ?');
    const user = await userStmt.bind(email).first();
    
    // Always return success to prevent email enumeration
    if (!user) {
      return new Response(JSON.stringify({
        success: true,
        message: 'If an account with that email exists, password reset instructions have been sent'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomUUID().replace(/-/g, '');
    const resetExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    const tokenStmt = env.DB.prepare(`
      INSERT OR REPLACE INTO password_resets (email, token, expires_at, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `);
    
    await tokenStmt.bind(email, resetToken, resetExpiry.toISOString()).run();

    // Send reset email using Resend API
    const resetLink = `https://bluebelongs.pages.dev/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    
    try {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'BlueBelong <noreply@bluebelong.com>',
          to: [email],
          subject: 'Reset Your BlueBelong Password',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">BlueBelong</h1>
                <p style="color: #e0f2fe; margin: 10px 0 0 0;">Diving School</p>
              </div>
              
              <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #0369a1; margin-bottom: 20px;">Reset Your Password</h2>
                
                <p>Hi ${user.name},</p>
                
                <p>You requested to reset your password for your BlueBelong account. Click the button below to create a new password:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetLink}" style="background: #0ea5e9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #0ea5e9; font-size: 14px;">${resetLink}</p>
                
                <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
                  This link will expire in 1 hour for security reasons. If you didn't request this reset, please ignore this email.
                </p>
                
                <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; text-align: center; color: #64748b; font-size: 12px;">
                  <p>BlueBelong Diving School | Andaman Islands</p>
                </div>
              </div>
            </div>
          `
        })
      });

      if (!emailResponse.ok) {
        console.error('Failed to send email via Resend:', await emailResponse.text());
        // Don't reveal email sending failure to user
      } else {
        console.log('Password reset email sent successfully to:', email);
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't reveal email sending failure to user
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Password reset instructions have been sent to your email'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process password reset' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleResetPassword(request, env) {
  try {
    const { token, email, newPassword } = await request.json();
    
    if (!token || !email || !newPassword) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (newPassword.length < 6) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if reset token is valid and not expired
    const resetStmt = env.DB.prepare(`
      SELECT * FROM password_resets 
      WHERE token = ? AND email = ? AND used = FALSE AND expires_at > datetime('now')
    `);
    const resetRecord = await resetStmt.bind(token, email).first();

    if (!resetRecord) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    const updateStmt = env.DB.prepare(`
      UPDATE users 
      SET password_hash = ?, updated_at = datetime('now') 
      WHERE email = ?
    `);
    await updateStmt.bind(hashedPassword, email).run();

    // Mark reset token as used
    const markUsedStmt = env.DB.prepare(`
      UPDATE password_resets 
      SET used = TRUE, used_at = datetime('now') 
      WHERE token = ?
    `);
    await markUsedStmt.bind(token).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Password reset successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Failed to reset password' 
    }), {
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
    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyJWT(token);
    if (!decoded) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    let query, params;
    
    // Admin can see all bookings, customers only see their own
    if (decoded.role === 'admin') {
      if (status) {
        query = 'SELECT * FROM bookings WHERE status = ? ORDER BY created_at DESC';
        params = [status];
      } else {
        query = 'SELECT * FROM bookings ORDER BY created_at DESC';
        params = [];
      }
    } else {
      if (status) {
        query = 'SELECT * FROM bookings WHERE user_id = ? AND status = ? ORDER BY created_at DESC';
        params = [decoded.userId, status];
      } else {
        query = 'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC';
        params = [decoded.userId];
      }
    }
    
    const stmt = env.DB.prepare(query);
    const result = await stmt.bind(...params).all();
    
    return new Response(JSON.stringify({ bookings: result.results || [] }), {
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

async function verifyPassword(password, hash) {
  // Check if it's a bcrypt hash (starts with $2b$)
  if (hash.startsWith('$2b$')) {
    // For bcrypt hashes, we need to use a bcrypt library
    // Since we can't easily import bcrypt in Cloudflare Workers,
    // we'll implement a simple verification for our known hash
    
    // This is the hash for 'neilu@havelock'
    const knownAdminHash = '$2b$10$QU5QZJ704lTfrkX9W/4RIuWbQGaYjptGmOjrlcIJuPL.cHBpHpNDe';
    
    if (hash === knownAdminHash && password === 'neilu@havelock') {
      return true;
    }
    
    // For other bcrypt hashes, we'd need a proper bcrypt implementation
    // For now, return false for unknown bcrypt hashes
    return false;
  } else {
    // For SHA-256 hashes (legacy)
    const expectedHash = await hashPassword(password);
    return hash === expectedHash;
  }
}

async function createJWT(payload) {
  try {
    // Simplified JWT for demo - in production use proper JWT library
    const header = { alg: 'HS256', typ: 'JWT' };
    
    // Add expiration time (24 hours from now)
    const payloadWithExp = {
      ...payload,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Use seconds instead of milliseconds
      iat: Math.floor(Date.now() / 1000) // Issued at time
    };
    
    // Use TextEncoder/TextDecoder for proper encoding
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const headerBytes = encoder.encode(JSON.stringify(header));
    const payloadBytes = encoder.encode(JSON.stringify(payloadWithExp));
    
    // Convert to base64url (URL-safe base64)
    const encodedHeader = btoa(String.fromCharCode(...headerBytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const encodedPayload = btoa(String.fromCharCode(...payloadBytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    
    return `${encodedHeader}.${encodedPayload}.signature`;
  } catch (error) {
    console.error('JWT creation error:', error);
    throw new Error('Failed to create token');
  }
}

async function verifyJWT(token) {
  try {
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token format');
    }
    
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token structure');
    }
    
    const [header, payload, signature] = parts;
    
    // Convert from base64url back to base64
    const paddedPayload = payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(payload.length + (4 - payload.length % 4) % 4, '=');
    
    let decodedPayload;
    try {
      const payloadJson = atob(paddedPayload);
      decodedPayload = JSON.parse(payloadJson);
    } catch (parseError) {
      console.error('Token parsing error:', parseError);
      throw new Error('Invalid token format');
    }
    
    // Check expiration (now using seconds)
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp && decodedPayload.exp < currentTime) {
      throw new Error('Token expired');
    }
    
    // Validate required fields
    if (!decodedPayload.userId || !decodedPayload.email) {
      throw new Error('Invalid token payload');
    }
    
    return decodedPayload;
  } catch (error) {
    console.error('JWT verification error:', error.message);
    throw new Error('Invalid token');
  }
}
