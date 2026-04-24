/* ============================================
   SUPABASE HELPER FUNCTIONS
   Jharkhand Tourism Project
   ============================================ */

// Initialize window.supabaseClient if not already set
(function () {
  const SUPABASE_URL = "https://qdxdwrpljyejupksredi.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkeGR3cnBsanllanVwa3NyZWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzI4ODQsImV4cCI6MjA5MjQ0ODg4NH0.V1vYMiqOHhAM1UpvocLa_p0I95X6nQlLCdoAYI1pDXs";
  if (window.supabase && !window.supabaseClient) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
})();

// ---- SUBMIT FEEDBACK TO SUPABASE ----
async function submitFeedbackToSupabase(name, email, phone, subject, message) {
  try {
    const { data, error } = await supabaseClient
      .from('feedback')
      .insert([
        {
          name: name,
          email: email,
          phone: phone,
          subject: subject,
          message: message,
          submitted_at: new Date().toISOString(),
          status: 'new'
        }
      ])
      .select();

    if (error) {
      console.error('Error submitting feedback:', error);
      return { success: false, error: error.message };
    }

    console.log('Feedback submitted successfully:', data);
    return { success: true, data: data };
  } catch (err) {
    console.error('Exception:', err);
    return { success: false, error: err.message };
  }
}

// ---- GET ALL FEEDBACK ----
async function getAllFeedback() {
  try {
    const { data, error } = await supabaseClient
      .from('feedback')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching feedback:', error);
      return null;
    }

    console.log('Feedback retrieved:', data);
    return data;
  } catch (err) {
    console.error('Exception:', err);
    return null;
  }
}

// ---- SUBMIT HOTEL BOOKING ----
async function submitHotelBooking(name, email, phone, hotelName, checkInDate, checkOutDate, guests, roomType) {
  try {
    const { data, error } = await supabaseClient
      .from('hotel_bookings')
      .insert([
        {
          name: name,
          email: email,
          phone: phone,
          hotel_name: hotelName,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          number_of_guests: guests,
          room_type: roomType,
          booked_at: new Date().toISOString(),
          status: 'pending'
        }
      ])
      .select();

    if (error) {
      console.error('Error submitting booking:', error);
      return { success: false, error: error.message };
    }

    console.log('Booking submitted successfully:', data);
    return { success: true, data: data };
  } catch (err) {
    console.error('Exception:', err);
    return { success: false, error: err.message };
  }
}

// ---- GET ALL HOTEL BOOKINGS ----
async function getHotelBookings() {
  try {
    const { data, error } = await supabaseClient
      .from('hotel_bookings')
      .select('*')
      .order('booked_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception:', err);
    return null;
  }
}

// ---- SUBMIT CONTACT MESSAGE ----
async function submitContactMessage(name, email, phone, subject, message) {
  try {
    const { data, error } = await supabaseClient
      .from('contact_messages')
      .insert([
        {
          name: name,
          email: email,
          phone: phone,
          subject: subject,
          message: message,
          sent_at: new Date().toISOString(),
          status: 'new'
        }
      ])
      .select();

    if (error) {
      console.error('Error submitting message:', error);
      return { success: false, error: error.message };
    }

    console.log('Message sent successfully:', data);
    return { success: true, data: data };
  } catch (err) {
    console.error('Exception:', err);
    return { success: false, error: err.message };
  }
}

// ---- GET USERS (for authentication) ----
async function signUpUser(email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      console.error('Error signing up:', error);
      return { success: false, error: error.message };
    }

    console.log('User signed up successfully:', data);
    return { success: true, data: data };
  } catch (err) {
    console.error('Exception:', err);
    return { success: false, error: err.message };
  }
}

// ---- LOGIN USER ----
async function loginUser(email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      console.error('Error logging in:', error);
      return { success: false, error: error.message };
    }

    console.log('User logged in successfully:', data);
    return { success: true, data: data };
  } catch (err) {
    console.error('Exception:', err);
    return { success: false, error: err.message };
  }
}

// ---- LOGOUT USER ----
async function logoutUser() {
  try {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error('Error logging out:', error);
      return { success: false, error: error.message };
    }

    console.log('User logged out successfully');
    return { success: true };
  } catch (err) {
    console.error('Exception:', err);
    return { success: false, error: err.message };
  }
}

// ---- GET CURRENT USER ----
async function getCurrentUser() {
  try {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data.user;
  } catch (err) {
    console.error('Exception:', err);
    return null;
  }
}

// ---- SUBSCRIBE TO FEEDBACK CHANGES (Real-time) ----
function subscribeFeedbackChanges(callback) {
  const subscription = supabaseClient
    .channel('public:feedback')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'feedback' },
      (payload) => {
        console.log('Feedback changed:', payload);
        callback(payload);
      }
    )
    .subscribe();

  return subscription;
}

// ---- ADD NEW PLACE ----
async function addPlace(name, description, category, imageUrl, latitude, longitude) {
  try {
    const { data, error } = await supabaseClient
      .from('places')
      .insert([
        {
          name: name,
          description: description,
          category: category,
          image_url: imageUrl,
          latitude: latitude,
          longitude: longitude,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Error adding place:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data };
  } catch (err) {
    console.error('Exception:', err);
    return { success: false, error: err.message };
  }
}

// ---- GET ALL PLACES ----
async function getAllPlaces() {
  try {
    const { data, error } = await supabaseClient
      .from('places')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching places:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception:', err);
    return null;
  }
}

// ---- GET PLACES BY CATEGORY ----
async function getPlacesByCategory(category) {
  try {
    const { data, error } = await supabaseClient
      .from('places')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching places:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception:', err);
    return null;
  }
}

// ---- UPLOAD FILE TO SUPABASE STORAGE ----
async function uploadImageToSupabase(file, bucketName = 'images') {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: publicData } = supabaseClient.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return { success: true, data: publicData, fileName: fileName };
  } catch (err) {
    console.error('Exception:', err);
    return { success: false, error: err.message };
  }
}
