// Blue Belongs Diving School - Cloudflare Worker API
// Handles bookings, contact forms, and course management

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers — reflect the request Origin only when it is in the configured
    // allow-list. A single ACAO value is the only spec-valid form (a comma-joined
    // list is rejected by browsers). Falls back to '*' only when no list is set.
    const requestOrigin = request.headers.get('Origin');
    const allowedOrigins = (env.ALLOWED_ORIGINS || '')
      .split(',')
      .map(o => o.trim())
      .filter(Boolean);
    let allowOrigin;
    if (allowedOrigins.length === 0) {
      allowOrigin = '*';
    } else if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
      allowOrigin = requestOrigin;
    } else {
      allowOrigin = allowedOrigins[0];
    }
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowOrigin,
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
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
      } else if (path === '/api/auth/change-password' && request.method === 'POST') {
        response = await handleChangePassword(request, env);
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
        response = await handleBookingGet(bookingId, request, env);
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
      } else if (path === '/api/admin/bookings' && request.method === 'GET') {
        response = await handleAdminBookingsGet(request, env);
      } else if (path.startsWith('/api/admin/bookings/') && request.method === 'PATCH') {
        const bookingId = path.split('/')[4];
        response = await handleAdminBookingUpdate(bookingId, request, env);
      } else if (path === '/api/admin/users' && request.method === 'GET') {
        response = await handleAdminUsersGet(request, env);
      } else if (path.startsWith('/api/admin/users/') && request.method === 'PATCH') {
        const userId = path.split('/')[4];
        response = await handleAdminUserUpdate(userId, request, env);
      } else if (path.startsWith('/api/admin/users/') && request.method === 'DELETE') {
        const userId = path.split('/')[4];
        response = await handleAdminUserDelete(userId, request, env);
      } else if (path === '/api/gallery' && request.method === 'GET') {
        response = await handleGalleryGet(env);
      } else if (path === '/api/admin/gallery' && request.method === 'GET') {
        response = await handleAdminGalleryGet(request, env);
      } else if (path === '/api/admin/gallery' && request.method === 'POST') {
        response = await handleAdminGalleryCreate(request, env);
      } else if (path.startsWith('/api/admin/gallery/') && request.method === 'PUT') {
        const id = path.split('/')[4];
        response = await handleAdminGalleryUpdate(id, request, env);
      } else if (path.startsWith('/api/admin/gallery/') && request.method === 'DELETE') {
        const id = path.split('/')[4];
        response = await handleAdminGalleryDelete(id, request, env);
      } else if (path === '/api/contact' && request.method === 'POST') {
        response = await handleContactForm(request, env);
      } else if (path === '/api/medical-form' && request.method === 'POST') {
        response = await handleMedicalForm(request, env);
      } else if (path === '/api/reviews' && request.method === 'GET') {
        response = await handleReviewsGet(request, env);
      } else if (path === '/api/reviews' && request.method === 'POST') {
        response = await handleReviewCreate(request, env);
      } else if (path === '/api/admin/reviews' && request.method === 'GET') {
        response = await handleAdminReviewsGet(request, env);
      } else if (path.startsWith('/api/admin/reviews/') && request.method === 'PATCH') {
        const reviewId = path.split('/')[4];
        response = await handleAdminReviewUpdate(reviewId, request, env);
      } else if (path === '/api/announcements' && request.method === 'GET') {
        response = await handleAnnouncementsGet(env);
      } else if (path.startsWith('/api/announcements/') && path.endsWith('/replies') && request.method === 'POST') {
        const announcementId = path.split('/')[3];
        response = await handleAnnouncementReplyCreate(announcementId, request, env);
      } else if (path === '/api/admin/announcements' && request.method === 'GET') {
        response = await handleAdminAnnouncementsGet(request, env);
      } else if (path === '/api/admin/announcements' && request.method === 'POST') {
        response = await handleAdminAnnouncementCreate(request, env);
      } else if (path.startsWith('/api/admin/announcements/') && request.method === 'PUT') {
        const announcementId = path.split('/')[4];
        response = await handleAdminAnnouncementUpdate(announcementId, request, env);
      } else if (path.startsWith('/api/admin/announcements/') && request.method === 'DELETE') {
        const announcementId = path.split('/')[4];
        response = await handleAdminAnnouncementDelete(announcementId, request, env);
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
    const decoded = await verifyJWT(token, env);
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
// Public gallery fetch (homepage)
async function handleGalleryGet(env) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT id, title, description as desc, image_url as img, height, link_url as url
      FROM gallery_items
      ORDER BY created_at DESC
    `).all();
    const items = results || [];
    
    // Always return actual database items, even if empty
    // Don't mix real database items with hardcoded defaults
    return new Response(JSON.stringify({ items }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Gallery get error:', error);
    return new Response(JSON.stringify({ items: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}

// Admin gallery: list
async function handleAdminGalleryGet(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  const token = authHeader.substring(7);
  const decoded = await verifyJWT(token, env);
  if (!decoded || decoded.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }
  return handleGalleryGet(env);
}

// Admin gallery: create
async function handleAdminGalleryCreate(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  const token = authHeader.substring(7);
  const decoded = await verifyJWT(token, env);
  if (!decoded || decoded.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }

  const { title, desc, img, height, url } = await request.json();
  if (!title || !img) {
    return new Response(JSON.stringify({ error: 'title and img are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  const stmt = env.DB.prepare(`
    INSERT INTO gallery_items (title, description, image_url, height, link_url, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
  const result = await stmt.bind(title, desc || '', img, height || 420, url || null).run();
  return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), { status: 201, headers: { 'Content-Type': 'application/json' } });
}

// Admin gallery: update
async function handleAdminGalleryUpdate(id, request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  const token = authHeader.substring(7);
  const decoded = await verifyJWT(token, env);
  if (!decoded || decoded.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }

  const { title, desc, img, height, url } = await request.json();
  const stmt = env.DB.prepare(`
    UPDATE gallery_items
    SET title = COALESCE(?, title),
        description = COALESCE(?, description),
        image_url = COALESCE(?, image_url),
        height = COALESCE(?, height),
        link_url = COALESCE(?, link_url),
        updated_at = datetime('now')
    WHERE id = ?
  `);
  const res = await stmt.bind(title || null, desc || null, img || null, height || null, url || null, id).run();
  if (res.changes === 0) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

// Admin gallery: delete
async function handleAdminGalleryDelete(id, request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  const token = authHeader.substring(7);
  const decoded = await verifyJWT(token, env);
  if (!decoded || decoded.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }
  const res = await env.DB.prepare('DELETE FROM gallery_items WHERE id = ?').bind(id).run();
  if (res.changes === 0) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

// Authenticated change password
async function handleChangePassword(request, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyJWT(token, env);
    if (!decoded || !decoded.userId) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ error: 'currentPassword and newPassword are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (newPassword.length < 6) {
      return new Response(JSON.stringify({ error: 'Password must be at least 6 characters long' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Load user
    const userStmt = env.DB.prepare('SELECT id, password_hash FROM users WHERE id = ?');
    const user = await userStmt.bind(decoded.userId).first();
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify current password
    const valid = await verifyPassword(currentPassword, user.password_hash);
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Current password is incorrect' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash new password and update
    const newHash = await hashPassword(newPassword);
    const update = env.DB.prepare('UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?');
    await update.bind(newHash, decoded.userId).run();

    return new Response(JSON.stringify({ success: true, message: 'Password updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Change password error:', error);
    return new Response(JSON.stringify({ error: 'Failed to change password' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle booking retrieval
async function handleBookingGet(bookingId, request, env) {
  try {
    // Require authentication and enforce ownership (prevents enumerating others' bookings)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const decoded = await verifyJWT(authHeader.substring(7), env);
    if (!decoded) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stmt = env.DB.prepare('SELECT * FROM bookings WHERE id = ?');
    const booking = await stmt.bind(bookingId).first();

    if (!booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Only the owner (or an admin) may read a booking
    if (decoded.role !== 'admin' && booking.user_id !== decoded.userId) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 403,
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
    const decoded = await verifyJWT(token, env);
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
    const decoded = await verifyJWT(token, env);
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
    const decoded = await verifyJWT(token, env);
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
    const decoded = await verifyJWT(token, env);
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
    const decoded = await verifyJWT(token, env);
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
    const decoded = await verifyJWT(token, env);
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
    const decoded = await verifyJWT(token, env);
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
    // Require authentication — this endpoint stores sensitive medical data
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const decoded = await verifyJWT(authHeader.substring(7), env);
    if (!decoded) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const medicalForm = await request.json();
    const { bookingId, name, email, medicalAnswers, physicianApproval } = medicalForm;

    if (!bookingId || !name || !email || !medicalAnswers) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify the booking exists and belongs to this user (admins may submit for any booking)
    const ownerStmt = env.DB.prepare('SELECT id, user_id FROM bookings WHERE id = ?');
    const ownerBooking = await ownerStmt.bind(bookingId).first();
    if (!ownerBooking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (decoded.role !== 'admin' && ownerBooking.user_id !== decoded.userId) {
      return new Response(JSON.stringify({ error: 'Not authorized for this booking' }), {
        status: 403,
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

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

// Public: list approved reviews (optionally filtered by course)
async function handleReviewsGet(request, env) {
  try {
    const url = new URL(request.url);
    const courseId = url.searchParams.get('courseId');

    let query = `
      SELECT id, course_id, course_name, reviewer_name, rating, comment, created_at, approved_at
      FROM reviews
      WHERE status = 'approved'
    `;
    const binds = [];
    if (courseId) {
      query += ' AND course_id = ?';
      binds.push(courseId);
    }
    query += ' ORDER BY COALESCE(approved_at, created_at) DESC LIMIT 50';

    const stmt = env.DB.prepare(query);
    const result = await (binds.length ? stmt.bind(...binds) : stmt).all();

    const reviews = (result.results || []).map((r) => ({
      id: String(r.id),
      courseId: r.course_id,
      courseName: r.course_name,
      userName: r.reviewer_name || 'Anonymous Diver',
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      approvedAt: r.approved_at
    }));

    return new Response(JSON.stringify({ success: true, reviews }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to load reviews' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Authenticated: submit a review for one of the caller's own bookings
async function handleReviewCreate(request, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const decoded = await verifyJWT(authHeader.substring(7), env);
    if (!decoded) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { bookingId, courseId, courseName, rating, comment } = await request.json();

    const numericRating = parseInt(rating, 10);
    if (!bookingId || !Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      return new Response(JSON.stringify({ error: 'A booking and a rating of 1-5 are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (!comment || String(comment).trim().length < 10) {
      return new Response(JSON.stringify({ error: 'Please write at least 10 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify the booking exists and belongs to this user
    const booking = await env.DB
      .prepare('SELECT id, user_id, course_id, course_name FROM bookings WHERE id = ?')
      .bind(bookingId).first();
    if (!booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (booking.user_id !== decoded.userId) {
      return new Response(JSON.stringify({ error: 'Not authorized for this booking' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // One review per booking
    const existing = await env.DB.prepare('SELECT id FROM reviews WHERE booking_id = ?').bind(bookingId).first();
    if (existing) {
      return new Response(JSON.stringify({ error: 'You have already reviewed this booking' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userRow = await env.DB.prepare('SELECT name FROM users WHERE id = ?').bind(decoded.userId).first();
    const reviewerName = (userRow && userRow.name) || 'Anonymous Diver';

    await env.DB.prepare(`
      INSERT INTO reviews (user_id, booking_id, course_id, course_name, reviewer_name, rating, comment, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `).bind(
      decoded.userId,
      bookingId,
      courseId || booking.course_id,
      courseName || booking.course_name,
      reviewerName,
      numericRating,
      String(comment).trim()
    ).run();

    return new Response(JSON.stringify({ success: true, message: 'Review submitted for approval' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Create review error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to submit review' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Admin: list every review (any status) for moderation
async function handleAdminReviewsGet(request, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const decoded = await verifyJWT(authHeader.substring(7), env);
    if (!decoded || decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await env.DB.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
    return new Response(JSON.stringify({ success: true, reviews: result.results || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin get reviews error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to load reviews' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Admin: approve / reject a review
async function handleAdminReviewUpdate(reviewId, request, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const decoded = await verifyJWT(authHeader.substring(7), env);
    if (!decoded || decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { status, adminNotes } = await request.json();
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return new Response(JSON.stringify({ error: 'Invalid status' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const approvedAt = status === 'approved' ? new Date().toISOString() : null;
    await env.DB.prepare(`
      UPDATE reviews
      SET status = ?,
          admin_notes = COALESCE(?, admin_notes),
          approved_at = ?,
          approved_by = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(status, adminNotes || null, approvedAt, decoded.email, reviewId).run();

    return new Response(JSON.stringify({ success: true, message: 'Review updated' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin update review error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to update review' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ---------------------------------------------------------------------------
// Announcements (message board)
// ---------------------------------------------------------------------------

function mapAnnouncement(row, replyRows) {
  return {
    id: String(row.id),
    title: row.title,
    message: row.message,
    type: row.type,
    priority: row.priority,
    active: !!row.active,
    createdAt: row.created_at,
    expiresAt: row.expires_at || undefined,
    replies: (replyRows || []).map((r) => ({
      id: String(r.id),
      announcementId: String(r.announcement_id),
      userId: r.user_id,
      userName: r.user_name,
      userEmail: r.user_email,
      message: r.message,
      createdAt: r.created_at
    }))
  };
}

async function fetchRepliesGrouped(ids, env) {
  const grouped = {};
  if (!ids.length) return grouped;
  const placeholders = ids.map(() => '?').join(',');
  const res = await env.DB
    .prepare(`SELECT * FROM announcement_replies WHERE announcement_id IN (${placeholders}) ORDER BY created_at ASC`)
    .bind(...ids).all();
  (res.results || []).forEach((r) => {
    (grouped[r.announcement_id] = grouped[r.announcement_id] || []).push(r);
  });
  return grouped;
}

async function requireAdmin(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };
  }
  const decoded = await verifyJWT(authHeader.substring(7), env);
  if (!decoded || decoded.role !== 'admin') {
    return { error: new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { 'Content-Type': 'application/json' } }) };
  }
  return { decoded };
}

// Public: active, non-expired announcements with their replies
async function handleAnnouncementsGet(env) {
  try {
    const nowIso = new Date().toISOString();
    const res = await env.DB
      .prepare(`SELECT * FROM announcements WHERE active = 1 AND (expires_at IS NULL OR expires_at > ?) ORDER BY created_at DESC`)
      .bind(nowIso).all();
    const rows = res.results || [];
    const grouped = await fetchRepliesGrouped(rows.map((r) => r.id), env);
    const announcements = rows.map((r) => mapAnnouncement(r, grouped[r.id]));

    return new Response(JSON.stringify({ success: true, announcements }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to load announcements' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Authenticated: post a reply to an announcement
async function handleAnnouncementReplyCreate(announcementId, request, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const decoded = await verifyJWT(authHeader.substring(7), env);
    if (!decoded) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { message } = await request.json();
    if (!message || !String(message).trim()) {
      return new Response(JSON.stringify({ error: 'A message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const announcement = await env.DB.prepare('SELECT id FROM announcements WHERE id = ?').bind(announcementId).first();
    if (!announcement) {
      return new Response(JSON.stringify({ error: 'Announcement not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userRow = await env.DB.prepare('SELECT name, email FROM users WHERE id = ?').bind(decoded.userId).first();

    await env.DB.prepare(`
      INSERT INTO announcement_replies (announcement_id, user_id, user_name, user_email, message)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      announcementId,
      decoded.userId,
      (userRow && userRow.name) || 'User',
      (userRow && userRow.email) || decoded.email,
      String(message).trim()
    ).run();

    return new Response(JSON.stringify({ success: true, message: 'Reply posted' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Create reply error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to post reply' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Admin: all announcements (any status) with replies
async function handleAdminAnnouncementsGet(request, env) {
  try {
    const auth = await requireAdmin(request, env);
    if (auth.error) return auth.error;

    const res = await env.DB.prepare('SELECT * FROM announcements ORDER BY created_at DESC').all();
    const rows = res.results || [];
    const grouped = await fetchRepliesGrouped(rows.map((r) => r.id), env);
    const announcements = rows.map((r) => mapAnnouncement(r, grouped[r.id]));

    return new Response(JSON.stringify({ success: true, announcements }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin get announcements error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to load announcements' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Admin: create announcement
async function handleAdminAnnouncementCreate(request, env) {
  try {
    const auth = await requireAdmin(request, env);
    if (auth.error) return auth.error;

    const { title, message, type, priority, active, expiresAt } = await request.json();
    if (!title || !message) {
      return new Response(JSON.stringify({ error: 'Title and message are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await env.DB.prepare(`
      INSERT INTO announcements (title, message, type, priority, active, expires_at, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      title,
      message,
      type || 'info',
      priority || 'low',
      active === false ? 0 : 1,
      expiresAt || null,
      auth.decoded.email
    ).run();

    return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to create announcement' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Admin: update announcement (full object; also used for active toggle)
async function handleAdminAnnouncementUpdate(announcementId, request, env) {
  try {
    const auth = await requireAdmin(request, env);
    if (auth.error) return auth.error;

    const { title, message, type, priority, active, expiresAt } = await request.json();
    if (!title || !message) {
      return new Response(JSON.stringify({ error: 'Title and message are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await env.DB.prepare(`
      UPDATE announcements
      SET title = ?, message = ?, type = ?, priority = ?, active = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      title,
      message,
      type || 'info',
      priority || 'low',
      active ? 1 : 0,
      expiresAt || null,
      announcementId
    ).run();

    return new Response(JSON.stringify({ success: true, message: 'Announcement updated' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to update announcement' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Admin: delete announcement (and its replies)
async function handleAdminAnnouncementDelete(announcementId, request, env) {
  try {
    const auth = await requireAdmin(request, env);
    if (auth.error) return auth.error;

    await env.DB.prepare('DELETE FROM announcement_replies WHERE announcement_id = ?').bind(announcementId).run();
    await env.DB.prepare('DELETE FROM announcements WHERE id = ?').bind(announcementId).run();

    return new Response(JSON.stringify({ success: true, message: 'Announcement deleted' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to delete announcement' }), {
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

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Transparently upgrade legacy hashes to PBKDF2 on successful login
    if (isLegacyHash(user.password_hash)) {
      try {
        const upgraded = await hashPassword(password);
        await env.DB.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .bind(upgraded, user.id).run();
      } catch (rehashError) {
        console.error('Password hash upgrade failed:', rehashError);
      }
    }

    // Create signed JWT token
    const token = await createJWT({ userId: user.id, email: user.email, role: user.role }, env);
    
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
      const token = await createJWT({ userId: result.meta.last_row_id, email, role: 'customer' }, env);
      
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
    const payload = await verifyJWT(token, env);
    
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
    const payload = await verifyJWT(token, env);
    
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
    const decoded = await verifyJWT(token, env);
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
// ---------------------------------------------------------------------------
// Auth crypto utilities
//
// Passwords are hashed with PBKDF2-HMAC-SHA256 (per-user random salt) using the
// Web Crypto API available in Workers — no external bcrypt dependency. Hashes are
// stored as `pbkdf2$<iterations>$<saltB64url>$<hashB64url>`. Legacy SHA-256 hashes
// (the previous scheme) still verify and are transparently upgraded on next login.
//
// JWTs are signed with HMAC-SHA256 using env.JWT_SECRET and the signature is
// verified before the payload is trusted. Set the secret with:
//   npx wrangler secret put JWT_SECRET --config wrangler.worker.toml
// ---------------------------------------------------------------------------

const PBKDF2_ITERATIONS = 210000;

function base64urlEncode(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlToBytes(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + ((4 - str.length % 4) % 4), '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

async function derivePbkdf2(password, salt, iterations, lengthBytes) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    lengthBytes * 8
  );
  return new Uint8Array(bits);
}

// Previous (insecure) hashing scheme — kept only so existing users can still log
// in once, after which their hash is upgraded to PBKDF2.
async function legacySha256Hash(password) {
  const data = new TextEncoder().encode(password + 'bluebelongs_salt');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function isLegacyHash(stored) {
  return typeof stored === 'string' && !stored.startsWith('pbkdf2$');
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hashBytes = await derivePbkdf2(password, salt, PBKDF2_ITERATIONS, 32);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${base64urlEncode(salt)}$${base64urlEncode(hashBytes)}`;
}

async function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string') return false;

  if (stored.startsWith('pbkdf2$')) {
    const parts = stored.split('$');
    if (parts.length !== 4) return false;
    const iterations = parseInt(parts[1], 10);
    if (!Number.isFinite(iterations) || iterations <= 0) return false;
    const salt = base64urlToBytes(parts[2]);
    const expected = base64urlToBytes(parts[3]);
    const actual = await derivePbkdf2(password, salt, iterations, expected.length);
    return timingSafeEqual(actual, expected);
  }

  // Legacy hex SHA-256 hashes — verify with the old scheme. Unknown formats
  // (e.g. old bcrypt $2b$ hashes that can't be verified without a bcrypt lib)
  // fail closed; those accounts must reset their password.
  if (/^[0-9a-f]{64}$/i.test(stored)) {
    const legacy = await legacySha256Hash(password);
    return timingSafeEqual(new TextEncoder().encode(legacy), new TextEncoder().encode(stored));
  }

  return false;
}

async function getSigningKey(env) {
  const secret = env && env.JWT_SECRET;
  if (!secret || typeof secret !== 'string' || secret.length < 16) {
    throw new Error('JWT_SECRET is not configured (set it with `wrangler secret put JWT_SECRET`)');
  }
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function createJWT(payload, env) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + (24 * 60 * 60) };

  const encoder = new TextEncoder();
  const encodedHeader = base64urlEncode(encoder.encode(JSON.stringify(header)));
  const encodedPayload = base64urlEncode(encoder.encode(JSON.stringify(fullPayload)));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await getSigningKey(env);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));
  const encodedSignature = base64urlEncode(new Uint8Array(signature));

  return `${signingInput}.${encodedSignature}`;
}

// Returns the decoded payload, or null if the token is missing/malformed/expired
// or — critically — if the HMAC signature does not verify.
async function verifyJWT(token, env) {
  try {
    if (!token || typeof token !== 'string') return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const encoder = new TextEncoder();
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const key = await getSigningKey(env);
    const signatureBytes = base64urlToBytes(encodedSignature);
    const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(signingInput));
    if (!valid) return null;

    const payloadJson = new TextDecoder().decode(base64urlToBytes(encodedPayload));
    const decoded = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) return null;
    if (!decoded.userId || !decoded.email) return null;

    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return null;
  }
}

// Admin Bookings Management
async function handleAdminBookingsGet(request, env) {
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
    const decoded = await verifyJWT(token, env);
    if (!decoded || decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const query = `
      SELECT 
        b.*,
        c.title as course_name,
        c.price as course_price
      FROM bookings b
      LEFT JOIN courses c ON b.course_id = c.id
      ORDER BY b.created_at DESC
    `;
    
    const result = await env.DB.prepare(query).all();
    
    return new Response(JSON.stringify({
      success: true,
      bookings: result.results
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch bookings'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleAdminBookingUpdate(bookingId, request, env) {
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
    const decoded = await verifyJWT(token, env);
    if (!decoded || decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { status, payment_status } = await request.json();
    
    const query = `
      UPDATE bookings 
      SET status = ?, payment_status = ?
      WHERE id = ?
    `;
    
    await env.DB.prepare(query).bind(
      status || null,
      payment_status || null,
      bookingId
    ).run();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Booking updated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to update booking'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Admin Users Management
async function handleAdminUsersGet(request, env) {
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
    const decoded = await verifyJWT(token, env);
    if (!decoded || decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const query = `
      SELECT 
        id,
        name,
        email,
        role,
        phone,
        certification_level,
        total_dives,
        created_at
      FROM users
      ORDER BY created_at DESC
    `;
    
    const result = await env.DB.prepare(query).all();
    
    return new Response(JSON.stringify({
      success: true,
      users: result.results
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch users'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleAdminUserUpdate(userId, request, env) {
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
    const decoded = await verifyJWT(token, env);
    if (!decoded || decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { role, phone, certification_level, total_dives } = await request.json();
    
    const query = `
      UPDATE users 
      SET role = COALESCE(?, role),
          phone = COALESCE(?, phone),
          certification_level = COALESCE(?, certification_level),
          total_dives = COALESCE(?, total_dives)
      WHERE id = ?
    `;
    
    await env.DB.prepare(query).bind(
      role || null,
      phone || null,
      certification_level || null,
      total_dives || null,
      userId
    ).run();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'User updated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to update user'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleAdminUserDelete(userId, request, env) {
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
    const decoded = await verifyJWT(token, env);
    if (!decoded || decoded.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // An admin cannot delete their own account (would risk locking out admin access)
    if (String(decoded.userId) === String(userId)) {
      return new Response(JSON.stringify({ error: 'You cannot delete your own account' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const target = await env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(userId).first();
    if (!target) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Preserve booking history by detaching it from the user before deletion
    // (bookings.user_id has a FK to users.id).
    await env.DB.prepare('UPDATE bookings SET user_id = NULL WHERE user_id = ?').bind(userId).run();
    await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'User deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to delete user'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
