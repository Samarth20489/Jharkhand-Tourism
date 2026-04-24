-- SUPABASE SETUP SQL QUERIES
-- Run these in Supabase SQL Editor to set up your database

-- ============================================
-- 1. CREATE FEEDBACK TABLE
-- ============================================
CREATE TABLE public.feedback (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for feedback
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback
CREATE POLICY "Allow public to insert feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read feedback
CREATE POLICY "Allow public to read feedback" ON public.feedback
  FOR SELECT USING (true);

-- ============================================
-- 2. CREATE HOTEL BOOKINGS TABLE
-- ============================================
CREATE TABLE public.hotel_bookings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  hotel_name VARCHAR(255) NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests INT NOT NULL,
  room_type VARCHAR(100),
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for hotel_bookings
ALTER TABLE public.hotel_bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert bookings
CREATE POLICY "Allow public to insert bookings" ON public.hotel_bookings
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read their own bookings
CREATE POLICY "Allow users to read own bookings" ON public.hotel_bookings
  FOR SELECT USING (true);

-- ============================================
-- 3. CREATE CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE public.contact_messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert messages
CREATE POLICY "Allow public to insert messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read messages
CREATE POLICY "Allow public to read messages" ON public.contact_messages
  FOR SELECT USING (true);

-- ============================================
-- 4. CREATE PLACES TABLE
-- ============================================
CREATE TABLE public.places (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for places
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read places
CREATE POLICY "Allow public to read places" ON public.places
  FOR SELECT USING (true);

-- ============================================
-- 5. INSERT SAMPLE PLACES DATA
-- ============================================
INSERT INTO public.places (name, description, category, latitude, longitude) VALUES
('Rajrappa Temple', 'Sacred Chinnamasta Temple at the confluence of Damodar & Bhairavi rivers.', 'Spiritual', 23.9333, 84.6333),
('Betla National Park', 'Home to wild elephants, tigers and diverse wildlife in dense forests.', 'Wildlife', 24.1500, 84.5500),
('Deoghar', 'One of the 12 Jyotirlingas, a major Hindu pilgrimage destination.', 'Pilgrimage', 24.4833, 87.7833),
('Netarhat', 'The Queen of Chotanagpur — famous for breathtaking sunrises.', 'Hill Station', 23.4667, 84.6167),
('Hundru Falls', 'A spectacular 98-meter waterfall near Ranchi amidst lush greenery.', 'Waterfall', 23.1833, 85.3333),
('Parasnath Hill', 'Jharkhand highest peak and a sacred Jain pilgrimage site.', 'Trekking', 23.9000, 84.9500);

-- ============================================
-- 6. CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================

-- Index for feedback
CREATE INDEX feedback_email_idx ON public.feedback(email);
CREATE INDEX feedback_submitted_at_idx ON public.feedback(submitted_at);
CREATE INDEX feedback_status_idx ON public.feedback(status);

-- Index for hotel_bookings
CREATE INDEX bookings_email_idx ON public.hotel_bookings(email);
CREATE INDEX bookings_booked_at_idx ON public.hotel_bookings(booked_at);
CREATE INDEX bookings_status_idx ON public.hotel_bookings(status);
CREATE INDEX bookings_check_in_idx ON public.hotel_bookings(check_in_date);

-- Index for contact_messages
CREATE INDEX contact_email_idx ON public.contact_messages(email);
CREATE INDEX contact_sent_at_idx ON public.contact_messages(sent_at);
CREATE INDEX contact_status_idx ON public.contact_messages(status);

-- ============================================
-- 7. CREATE STORAGE BUCKET FOR IMAGES
-- ============================================
-- Run this in Supabase dashboard under Storage
-- Create a new bucket called "images" with public access

-- ============================================
-- 8. USEFUL QUERIES
-- ============================================

-- Get all feedback from last 7 days
SELECT * FROM feedback 
WHERE submitted_at >= NOW() - INTERVAL '7 days'
ORDER BY submitted_at DESC;

-- Get pending hotel bookings
SELECT * FROM hotel_bookings 
WHERE status = 'pending'
ORDER BY booked_at DESC;

-- Get all contact messages
SELECT * FROM contact_messages 
ORDER BY sent_at DESC;

-- Search feedback by email
SELECT * FROM feedback 
WHERE email ILIKE '%example.com%'
ORDER BY submitted_at DESC;

-- Count bookings per hotel
SELECT hotel_name, COUNT(*) as booking_count 
FROM hotel_bookings 
GROUP BY hotel_name 
ORDER BY booking_count DESC;

-- Get feedback statistics
SELECT 
  COUNT(*) as total_feedback,
  COUNT(CASE WHEN status = 'new' THEN 1 END) as new_feedback,
  COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied_feedback
FROM feedback;

-- Find bookings within date range
SELECT * FROM hotel_bookings 
WHERE check_in_date >= '2026-05-01' 
AND check_in_date <= '2026-05-31'
ORDER BY check_in_date ASC;

-- Update feedback status
UPDATE feedback SET status = 'replied' WHERE id = 1;

-- Delete old messages (older than 30 days)
DELETE FROM contact_messages 
WHERE sent_at < NOW() - INTERVAL '30 days' 
AND status != 'pending';

-- ============================================
-- 9. SETUP AUTHENTICATION
-- ============================================
-- Supabase authentication is already set up in your project
-- Users can sign up/login using supabase.auth

-- ============================================
-- 10. BACKUP YOUR DATA
-- ============================================
-- Go to Supabase Dashboard > Database > Backups
-- Enable automatic daily backups
-- Download backups regularly

-- ============================================
-- NOTES
-- ============================================
-- 1. RLS (Row Level Security) policies are set to allow public access
--    For production, consider more restrictive policies
-- 2. Always validate user input on the frontend
-- 3. Consider adding rate limiting for form submissions
-- 4. Set up email notifications for new feedback/bookings
-- 5. Monitor your database usage in Supabase dashboard
