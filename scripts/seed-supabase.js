import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qklgenttobrhdxadceqb.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const initialCourses = [
  {
    id: 'course-1',
    title: 'AI Automation & Productivity',
    subtitle: 'AI Automation Mastery',
    slug: 'ai-automation-productivity',
    category: 'ai',
    badge: 'Bestseller',
    badge_color: '#F59E0B',
    thumbnail: '/assets/extracted/course-ai.png',
    lessons_count: 32,
    duration_weeks: 8,
    rating: 4.9,
    review_count: 1245,
    current_price: 4500,
    previous_price: 7500,
    discount_percent: 40,
    featured: true,
    published: true,
    trainer_id: 'trainer-1',
    trainer_name: 'Shariar Islam Sohel',
    trainer_avatar: '/assets/extracted/trainer-1.png',
    description: 'Master the future of business operations with state-of-the-art AI workflows, OpenAI APIs, Make.com, n8n, ChatGPT prompt engineering, and intelligent agent pipelines.',
  },
  {
    id: 'course-2',
    title: 'Digital Marketing (A to Z)',
    subtitle: 'Digital Marketing Complete Course',
    slug: 'digital-marketing-a-to-z',
    category: 'digital-marketing',
    badge: 'Popular',
    badge_color: '#EF4444',
    thumbnail: '/assets/extracted/course-dm.png',
    lessons_count: 48,
    duration_weeks: 12,
    rating: 4.8,
    review_count: 2964,
    current_price: 3990,
    previous_price: 6500,
    discount_percent: 38,
    featured: true,
    published: true,
    trainer_id: 'trainer-1',
    trainer_name: 'Shariar Islam Sohel',
    trainer_avatar: '/assets/extracted/trainer-1.png',
    description: 'Complete 360-degree digital marketing roadmap: Meta Ads manager mastery, Google Search & Display Ads, SEO ranking blueprints, content strategies, and freelancing on Upwork & Fiverr.',
  },
  {
    id: 'course-3',
    title: 'Graphics Design Mastery',
    subtitle: 'Graphics Design Professional',
    slug: 'graphics-design-mastery',
    category: 'graphics-design',
    badge: 'Trending',
    badge_color: '#8B5CF6',
    thumbnail: '/assets/extracted/course-gd.png',
    lessons_count: 40,
    duration_weeks: 10,
    rating: 4.9,
    review_count: 2187,
    current_price: 3500,
    previous_price: 5500,
    discount_percent: 36,
    featured: true,
    published: true,
    trainer_id: 'trainer-3',
    trainer_name: 'Zara Islam',
    trainer_avatar: '/assets/extracted/trainer-3.png',
    description: 'Master industry-standard Adobe Photoshop, Illustrator, Figma, and Canva. Learn typography, brand identity, social media creatives, print design, and building a world-class Behance portfolio.',
  },
  {
    id: 'course-4',
    title: 'Full Stack Web Development',
    subtitle: 'Web Development Full Stack',
    slug: 'full-stack-web-development',
    category: 'web-dev',
    badge: 'Career Focused',
    badge_color: '#EC4899',
    thumbnail: '/assets/extracted/course-web.png',
    lessons_count: 64,
    duration_weeks: 16,
    rating: 4.9,
    review_count: 1908,
    current_price: 7990,
    previous_price: 12500,
    discount_percent: 36,
    featured: true,
    published: true,
    trainer_id: 'trainer-2',
    trainer_name: 'Omar Faruque Razib',
    trainer_avatar: '/assets/extracted/trainer-2.png',
    description: 'Become a professional software engineer with React, Next.js, TypeScript, Node.js, Express, MongoDB, and Tailwind CSS. Build 5 enterprise-grade portfolio projects from scratch.',
  },
];

const initialServices = [
  {
    id: 'srv-1',
    slug: 'ai-solutions',
    title: 'AI Solutions',
    tagline: 'AI Automation & Integration',
    category: 'AI & Automation',
    icon_name: 'Bot',
    short_description: 'AI Automation & Integration',
    full_description: 'Empower your company with intelligent automated pipelines, custom LLM fine-tuning, autonomous customer service bots, and zero-touch CRM sync.',
    starting_price: 25000,
    duration: '2-3 Weeks',
    featured: true,
  },
  {
    id: 'srv-2',
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    tagline: 'SEO, SMM, SEM & Ads',
    category: 'Marketing',
    icon_name: 'Megaphone',
    short_description: 'SEO, SMM, SEM & Ads',
    full_description: 'Data-driven performance marketing campaigns engineered to generate profitable sales leads, viral brand recognition, and top-tier Google rankings.',
    starting_price: 20000,
    duration: 'Monthly Retainer',
    featured: true,
  },
  {
    id: 'srv-3',
    slug: 'graphics-design',
    title: 'Graphics Design',
    tagline: 'Branding, Logo & Creative',
    category: 'Design',
    icon_name: 'PenTool',
    short_description: 'Branding, Logo & Creative',
    full_description: 'World-class visual identities, vector logos, UI design systems, social media kits, and corporate branding assets that command authority.',
    starting_price: 15000,
    duration: '7-10 Days',
    featured: true,
  },
  {
    id: 'srv-4',
    slug: 'web-development',
    title: 'Web Development',
    tagline: 'Website, E-commerce & Apps',
    category: 'Engineering',
    icon_name: 'Code',
    short_description: 'Website, E-commerce & Apps',
    full_description: 'Lightning-fast, mobile-first web applications, robust e-commerce platforms, custom web portals, and headless WordPress builds.',
    starting_price: 35000,
    duration: '2-4 Weeks',
    featured: true,
  },
  {
    id: 'srv-5',
    slug: 'business-automation',
    title: 'Business Automation',
    tagline: 'Tools, Workflow & CRM',
    category: 'Automation',
    icon_name: 'Workflow',
    short_description: 'Tools, Workflow & CRM',
    full_description: 'Eliminate repetitive manual data entry, streamline customer onboarding, and synchronize your sales pipelines with custom automated workflows.',
    starting_price: 20000,
    duration: '1-2 Weeks',
    featured: true,
  },
  {
    id: 'srv-6',
    slug: 'it-consulting',
    title: 'IT Consulting',
    tagline: 'Strategy & Growth',
    category: 'Consulting',
    icon_name: 'Headphones',
    short_description: 'Strategy & Growth',
    full_description: 'Strategic technology guidance, cloud infrastructure audits, digital transformation roadmaps, and cybersecurity advisory for scaling enterprises.',
    starting_price: 30000,
    duration: 'Flexible / Project-based',
    featured: true,
  },
];

const initialTrainers = [
  {
    id: 'trainer-1',
    name: 'SHARIAR ISLAM SOHEL',
    designation: 'Digital Marketing Expert',
    expertise: 'AI Automation Specialist',
    experience_years: 12,
    avatar: '/assets/extracted/trainer-1.png',
    bio: 'Pioneer digital strategist and AI automation consultant who has trained over 5,000+ graduates and managed international ad budgets exceeding $1.5M.',
    rating: 4.9,
    total_students: 4200,
  },
  {
    id: 'trainer-2',
    name: 'Omar Faruque Razib',
    designation: 'Web Development Expert',
    expertise: 'Full Stack Developer',
    experience_years: 8,
    avatar: '/assets/extracted/trainer-2.png',
    bio: 'Lead software engineer with extensive background building enterprise SaaS platforms, React ecosystems, microservices, and distributed cloud applications.',
    rating: 4.9,
    total_students: 3100,
  },
  {
    id: 'trainer-3',
    name: 'Zara Islam',
    designation: 'Graphics Design Instructor',
    expertise: 'UI/UX & Branding Expert',
    experience_years: 6,
    avatar: '/assets/extracted/trainer-3.png',
    bio: 'Award-winning visual brand designer specializing in high-ticket brand books, Figma component systems, typography mastery, and Behance featured case studies.',
    rating: 4.9,
    total_students: 2800,
  },
  {
    id: 'trainer-4',
    name: 'Tanvir Ahmed',
    designation: 'SEO & SMM Specialist',
    expertise: 'Growth Marketing Expert',
    experience_years: 7,
    avatar: '/assets/extracted/trainer-4.png',
    bio: 'Technical SEO strategist and social growth hacker who has successfully ranked 120+ client websites in competitive global niches on Google Page 1.',
    rating: 4.8,
    total_students: 1900,
  },
];

const initialTestimonials = [
  {
    id: 'test-1',
    student_name: 'Rafiqul Islam',
    profession: 'Freelancer',
    avatar: '/assets/extracted/student-1.png',
    rating: 5,
    quote_bengali: '“TETRA’র Digital Marketing কোর্সটি আমার ফ্রিল্যান্সিং ক্যারিয়ার শুরু করতে অনেক সাহায্য করেছে!”',
    course_title: 'Digital Marketing (A to Z)',
    approved: true,
    featured: true,
  },
  {
    id: 'test-2',
    student_name: 'Nusrat Jahan',
    profession: 'Graphics Designer',
    avatar: '/assets/extracted/student-2.png',
    rating: 5,
    quote_bengali: '“প্র্যাকটিক্যাল ক্লাস, সাপোর্ট এবং মেন্টরের গাইডলাইন এগুলো সত্যিই অসাধারণ। ধন্যবাদ TETRA!”',
    course_title: 'Graphics Design Mastery',
    approved: true,
    featured: true,
  },
  {
    id: 'test-3',
    student_name: 'Imran Hossain',
    profession: 'Web Developer',
    avatar: '/assets/extracted/student-3.png',
    rating: 5,
    quote_bengali: '“কোর্স শেষে প্রথম ক্লায়েন্ট পেয়েছি। বাস্তবমুখী প্রজেক্ট করার অভিজ্ঞতা অসাধারণ ছিল!”',
    course_title: 'Full Stack Web Development',
    approved: true,
    featured: true,
  },
];

async function seed() {
  console.log('Seeding initial data into Supabase...');

  const { error: cErr } = await supabase.from('courses').upsert(initialCourses);
  if (cErr) console.warn('Courses upsert notice:', cErr.message);
  else console.log('✓ Courses seeded successfully');

  const { error: sErr } = await supabase.from('services').upsert(initialServices);
  if (sErr) console.warn('Services upsert notice:', sErr.message);
  else console.log('✓ Services seeded successfully');

  const { error: tErr } = await supabase.from('trainers').upsert(initialTrainers);
  if (tErr) console.warn('Trainers upsert notice:', tErr.message);
  else console.log('✓ Trainers seeded successfully');

  const { error: testErr } = await supabase.from('testimonials').upsert(initialTestimonials);
  if (testErr) console.warn('Testimonials upsert notice:', testErr.message);
  else console.log('✓ Testimonials seeded successfully');

  console.log('Done!');
}

seed();
