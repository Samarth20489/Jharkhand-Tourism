# Supabase Implementation Guide for Jharkhand Tourism

## Overview
This guide shows how to use Supabase with your Jharkhand Tourism project.

---

## 1. REQUIRED SUPABASE TABLES

You need to create these tables in your Supabase database:

### A. Feedback Table
```sql
CREATE TABLE feedback (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### B. Hotel Bookings Table
```sql
CREATE TABLE hotel_bookings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  hotel_name VARCHAR(255) NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests INT NOT NULL,
  room_type VARCHAR(100),
  booked_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### C. Contact Messages Table
```sql
CREATE TABLE contact_messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### D. Places Table (Optional - for dynamic content)
```sql
CREATE TABLE places (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 2. BASIC USAGE EXAMPLES

### Submit Feedback
```javascript
const result = await submitFeedbackToSupabase(
  'John Doe',
  'john@example.com',
  '+91 1234567890',
  'Amazing Experience',
  'Had a great time exploring Jharkhand!'
);

if (result.success) {
  console.log('Feedback saved:', result.data);
} else {
  console.error('Error:', result.error);
}
```

### Book a Hotel
```javascript
const result = await submitHotelBooking(
  'Jane Smith',
  'jane@example.com',
  '+91 9876543210',
  'Taj Hotel Ranchi',
  '2026-05-15',
  '2026-05-17',
  2,
  'Deluxe'
);

if (result.success) {
  console.log('Booking confirmed:', result.data);
}
```

### Submit Contact Message
```javascript
const result = await submitContactMessage(
  'Raj Kumar',
  'raj@example.com',
  '+91 5555555555',
  'Tour Inquiry',
  'I want to book a customized tour'
);

if (result.success) {
  console.log('Message sent:', result.data);
}
```

### Get All Feedback
```javascript
const allFeedback = await getAllFeedback();
console.log('All feedback:', allFeedback);
```

### Get Hotel Bookings
```javascript
const bookings = await getHotelBookings();
console.log('All bookings:', bookings);
```

### Get Places by Category
```javascript
const spiritualPlaces = await getPlacesByCategory('Spiritual');
console.log('Spiritual places:', spiritualPlaces);
```

---

## 3. USER AUTHENTICATION EXAMPLES

### Sign Up New User
```javascript
const result = await signUpUser('newuser@example.com', 'SecurePassword123');

if (result.success) {
  console.log('User registered:', result.data);
}
```

### Login User
```javascript
const result = await loginUser('user@example.com', 'SecurePassword123');

if (result.success) {
  console.log('User logged in:', result.data);
}
```

### Get Current User
```javascript
const user = await getCurrentUser();

if (user) {
  console.log('Logged in user:', user.email);
} else {
  console.log('No user logged in');
}
```

### Logout User
```javascript
const result = await logoutUser();
console.log('User logged out');
```

---

## 4. FILE UPLOAD EXAMPLES

### Upload Image
```javascript
// Get file from input
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const result = await uploadImageToSupabase(file, 'images');

if (result.success) {
  console.log('Image uploaded:', result.data.publicUrl);
}
```

---

## 5. REAL-TIME UPDATES

### Subscribe to Feedback Changes
```javascript
const subscription = subscribeFeedbackChanges((payload) => {
  console.log('Feedback changed:', payload);
  // payload.eventType = 'INSERT', 'UPDATE', or 'DELETE'
  // payload.new = new record
  // payload.old = old record
});

// Unsubscribe when done
subscription.unsubscribe();
```

---

## 6. HOW TO INTEGRATE WITH HTML FORMS

### Example: Hotel Booking Form
```html
<form id="hotelBookingForm">
  <input type="text" name="name" required placeholder="Your Name">
  <input type="email" name="email" required placeholder="Your Email">
  <input type="tel" name="phone" required placeholder="Phone Number">
  <input type="text" name="hotel_name" required placeholder="Hotel Name">
  <input type="date" name="check_in" required>
  <input type="date" name="check_out" required>
  <input type="number" name="guests" required placeholder="Number of Guests">
  <input type="text" name="room_type" placeholder="Room Type">
  <button type="submit">Book Now</button>
</form>

<script>
document.getElementById('hotelBookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const form = e.target;
  const result = await submitHotelBooking(
    form.name.value,
    form.email.value,
    form.phone.value,
    form.hotel_name.value,
    form.check_in.value,
    form.check_out.value,
    parseInt(form.guests.value),
    form.room_type.value
  );
  
  if (result.success) {
    showToast('Booking submitted successfully!');
    form.reset();
  } else {
    showToast('Error: ' + result.error, 'error');
  }
});
</script>
```

---

## 7. FEEDBACK FORM (ALREADY INTEGRATED)

The feedback form in your footer is already connected to Supabase! When users submit feedback:
- It's automatically saved to the `feedback` table
- You can view all submissions in your Supabase dashboard
- Validation happens before submission

---

## 8. COMMON QUERIES

### Get feedback from last 7 days
```javascript
async function getRecentFeedback() {
  const { data, error } = await supabaseClient
    .from('feedback')
    .select('*')
    .gte('submitted_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('submitted_at', { ascending: false });
  
  return data;
}
```

### Get pending hotel bookings
```javascript
async function getPendingBookings() {
  const { data, error } = await supabaseClient
    .from('hotel_bookings')
    .select('*')
    .eq('status', 'pending')
    .order('booked_at', { ascending: false });
  
  return data;
}
```

### Search feedback by email
```javascript
async function searchFeedbackByEmail(email) {
  const { data, error } = await supabaseClient
    .from('feedback')
    .select('*')
    .ilike('email', `%${email}%`);
  
  return data;
}
```

---

## 9. ERROR HANDLING

All functions return an object with:
- `success`: boolean (true/false)
- `data`: the result (if successful)
- `error`: error message (if failed)

Always check for errors:
```javascript
const result = await submitFeedbackToSupabase(...);

if (result.success) {
  // Handle success
  console.log(result.data);
} else {
  // Handle error
  console.error(result.error);
}
```

---

## 10. NEXT STEPS

1. Create the tables in Supabase dashboard
2. Test the functions in browser console
3. Add RLS policies for security (in Supabase dashboard)
4. Integrate with your contact and hotel booking pages
5. Set up email notifications in Supabase

---

## SUPPORT

For Supabase documentation: https://supabase.com/docs
For questions about this integration, check supabase-helper.js
