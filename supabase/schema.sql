-- ========================================================
-- TETRA IT Training Institute & Digital Agency LMS Platform
-- Supabase PostgreSQL Schema & Row Level Security (RLS)
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'trainer', 'super_admin')),
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  designation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to create profile upon new Supabase user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  badge TEXT NOT NULL DEFAULT 'Bestseller',
  badge_color TEXT,
  thumbnail TEXT NOT NULL,
  lessons_count INTEGER DEFAULT 0,
  duration_weeks INTEGER DEFAULT 0,
  rating NUMERIC(3, 1) DEFAULT 4.9,
  review_count INTEGER DEFAULT 0,
  current_price NUMERIC(10, 2) NOT NULL,
  previous_price NUMERIC(10, 2) NOT NULL,
  discount_percent INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT true,
  published BOOLEAN DEFAULT true,
  trainer_id TEXT,
  trainer_name TEXT,
  trainer_avatar TEXT,
  description TEXT,
  what_you_will_learn JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  modules JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  category TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  deliverables JSONB DEFAULT '[]'::jsonb,
  starting_price NUMERIC(10, 2) NOT NULL,
  duration TEXT NOT NULL,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Trainers Table
CREATE TABLE IF NOT EXISTS public.trainers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  expertise TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  avatar TEXT NOT NULL,
  bio TEXT NOT NULL,
  skills JSONB DEFAULT '[]'::jsonb,
  social JSONB DEFAULT '{}'::jsonb,
  rating NUMERIC(3, 1) DEFAULT 4.9,
  total_students INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  profession TEXT NOT NULL,
  avatar TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  quote_bengali TEXT NOT NULL,
  quote_english TEXT,
  course_title TEXT NOT NULL,
  approved BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Hero Slides Table
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id TEXT PRIMARY KEY,
  slide_order INTEGER DEFAULT 1,
  enabled BOOLEAN DEFAULT true,
  badge_text TEXT NOT NULL,
  headline_line1 TEXT NOT NULL,
  headline_line2 TEXT NOT NULL,
  headline_highlight TEXT NOT NULL,
  description TEXT NOT NULL,
  feature_pills JSONB DEFAULT '[]'::jsonb,
  primary_btn_text TEXT NOT NULL,
  primary_btn_link TEXT NOT NULL,
  secondary_btn_text TEXT NOT NULL,
  secondary_btn_link TEXT NOT NULL,
  student_image TEXT NOT NULL,
  floating_tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Statistics Table
CREATE TABLE IF NOT EXISTS public.statistics (
  id TEXT PRIMARY KEY,
  learners_count TEXT NOT NULL,
  trainers_count TEXT NOT NULL,
  courses_count TEXT NOT NULL,
  services_count TEXT NOT NULL,
  success_rate TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  course_id TEXT NOT NULL,
  course_title TEXT NOT NULL,
  course_thumbnail TEXT,
  enrolled_at TEXT NOT NULL,
  progress_percent INTEGER DEFAULT 0,
  completed_lessons JSONB DEFAULT '[]'::jsonb,
  payment_status TEXT DEFAULT 'paid',
  amount NUMERIC(10, 2) NOT NULL,
  certificate_issued BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Service Inquiries Table
CREATE TABLE IF NOT EXISTS public.service_inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_category TEXT NOT NULL,
  budget TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY,
  certificate_number TEXT UNIQUE NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  course_id TEXT NOT NULL,
  course_title TEXT NOT NULL,
  trainer_name TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  grade TEXT NOT NULL,
  verification_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  submission_link TEXT NOT NULL,
  notes TEXT,
  submitted_at TEXT NOT NULL,
  marks_obtained INTEGER,
  feedback TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'graded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public courses are viewable by everyone" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Trainers are viewable by everyone" ON public.trainers FOR SELECT USING (true);
CREATE POLICY "Approved testimonials are viewable by everyone" ON public.testimonials FOR SELECT USING (approved = true);
CREATE POLICY "Hero slides are viewable by everyone" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Statistics are viewable by everyone" ON public.statistics FOR SELECT USING (true);
CREATE POLICY "Certificates are publicly verifiable" ON public.certificates FOR SELECT USING (true);

-- Public Insert Policies
CREATE POLICY "Anyone can submit a service inquiry" ON public.service_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit a contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Authenticated Users Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Students can view own enrollments" ON public.enrollments FOR SELECT USING (auth.uid()::text = student_id);
CREATE POLICY "Students can insert own enrollments" ON public.enrollments FOR INSERT WITH CHECK (auth.uid()::text = student_id);
CREATE POLICY "Students can view own submissions" ON public.submissions FOR SELECT USING (auth.uid()::text = student_id);
CREATE POLICY "Students can submit assignments" ON public.submissions FOR INSERT WITH CHECK (auth.uid()::text = student_id);

-- Super Admin Full Access Policy Function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Super Admins can manage all courses" ON public.courses FOR ALL USING (public.is_admin());
CREATE POLICY "Super Admins can manage all services" ON public.services FOR ALL USING (public.is_admin());
CREATE POLICY "Super Admins can manage all hero slides" ON public.hero_slides FOR ALL USING (public.is_admin());
CREATE POLICY "Super Admins can manage all statistics" ON public.statistics FOR ALL USING (public.is_admin());
CREATE POLICY "Super Admins can manage all inquiries" ON public.service_inquiries FOR ALL USING (public.is_admin());
CREATE POLICY "Super Admins can manage all messages" ON public.contact_messages FOR ALL USING (public.is_admin());
CREATE POLICY "Super Admins can manage all testimonials" ON public.testimonials FOR ALL USING (public.is_admin());
