export type UserRole = 'student' | 'trainer' | 'super_admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  bio?: string;
  designation?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: 'ai' | 'digital-marketing' | 'graphics-design' | 'web-dev' | 'automation';
  badge: 'Bestseller' | 'Popular' | 'Trending' | 'Career Focused' | 'New';
  badgeColor?: string;
  thumbnail: string;
  lessonsCount: number;
  durationWeeks: number;
  rating: number;
  reviewCount: number;
  currentPrice: number;
  previousPrice: number;
  discountPercent: number;
  featured: boolean;
  published: boolean;
  trainerId: string;
  trainerName: string;
  trainerAvatar: string;
  description: string;
  whatYouWillLearn: string[];
  requirements: string[];
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isFreePreview?: boolean;
  resources?: { name: string; url: string }[];
  completed?: boolean;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  iconName: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  deliverables: string[];
  startingPrice: number;
  duration: string;
  featured: boolean;
}

export interface Trainer {
  id: string;
  name: string;
  designation: string;
  expertise: string;
  experienceYears: number;
  avatar: string;
  bio: string;
  skills: string[];
  social: {
    linkedin?: string;
    youtube?: string;
    website?: string;
    facebook?: string;
    github?: string;
  };
  assignedCourses: string[];
  rating: number;
  totalStudents: number;
}

export interface Testimonial {
  id: string;
  studentName: string;
  profession: string;
  avatar: string;
  rating: number;
  quoteBengali: string;
  quoteEnglish?: string;
  courseTitle: string;
  approved: boolean;
  featured: boolean;
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  order: number;
  enabled: boolean;
  badgeText: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineHighlight: string;
  description: string;
  featurePills: { icon: string; label: string }[];
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  studentImage: string;
  floatingTags: { icon: string; label: string }[];
}

export interface StatisticsData {
  learnersCount: string;
  trainersCount: string;
  coursesCount: string;
  servicesCount: string;
  successRate: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
  enrolledAt: string;
  progressPercent: number;
  completedLessons: string[];
  paymentStatus: 'paid' | 'pending' | 'free';
  amount: number;
  certificateIssued: boolean;
  certificateId?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submissionLink: string;
  notes: string;
  submittedAt: string;
  marksObtained?: number;
  feedback?: string;
  status: 'pending' | 'graded';
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  trainerName: string;
  issueDate: string;
  grade: string;
  verificationUrl: string;
}

export interface ServiceInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceCategory: string;
  budget: string;
  message: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed';
  notes?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface WebsiteSettings {
  brandName: string;
  tagline: string;
  phone: string;
  email: string;
  officeAddress: string;
  googleMapsUrl: string;
  socialLinks: {
    facebook: string;
    youtube: string;
    linkedin: string;
    instagram: string;
    tiktok: string;
  };
  whyChooseTetra: {
    title: string;
    items: string[];
  };
  ctaBanner: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  };
  footerBio: string;
  copyright: string;
}
