import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Course,
  ServiceItem,
  Trainer,
  Testimonial,
  HeroSlide,
  StatisticsData,
  WebsiteSettings,
  Enrollment,
  ServiceInquiry,
  ContactMessage,
  NewsletterSubscriber,
  Certificate,
  Submission,
} from '../types';
import {
  initialCourses,
  initialServices,
  initialTrainers,
  initialTestimonials,
  initialHeroSlides,
  initialStatistics,
  initialWebsiteSettings,
  initialCertificates,
} from '../data/initialData';

interface DataContextType {
  courses: Course[];
  services: ServiceItem[];
  trainers: Trainer[];
  testimonials: Testimonial[];
  heroSlides: HeroSlide[];
  statistics: StatisticsData;
  websiteSettings: WebsiteSettings;
  enrollments: Enrollment[];
  inquiries: ServiceInquiry[];
  contactMessages: ContactMessage[];
  subscribers: NewsletterSubscriber[];
  certificates: Certificate[];
  submissions: Submission[];

  // Admin controls
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => void;
  addHeroSlide: (slide: HeroSlide) => void;
  deleteHeroSlide: (id: string) => void;
  reorderHeroSlides: (slides: HeroSlide[]) => void;
  updateStatistics: (stats: Partial<StatisticsData>) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addService: (service: ServiceItem) => void;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  addTrainer: (trainer: Trainer) => void;
  updateTrainer: (id: string, updates: Partial<Trainer>) => void;
  deleteTrainer: (id: string) => void;
  approveTestimonial: (id: string) => void;
  deleteTestimonial: (id: string) => void;
  addTestimonial: (test: Omit<Testimonial, 'id' | 'createdAt'>) => void;
  updateWebsiteSettings: (settings: Partial<WebsiteSettings>) => void;

  // Student / User operations
  enrollInCourse: (course: Course, studentId: string, studentName: string, studentEmail: string) => Promise<Enrollment>;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  submitServiceInquiry: (inquiry: Omit<ServiceInquiry, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateInquiryStatus: (id: string, status: ServiceInquiry['status'], notes?: string) => void;
  deleteInquiry: (id: string) => void;
  submitContactForm: (contact: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  subscribeToNewsletter: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyCertificateNumber: (certNum: string) => Certificate | undefined;
  submitAssignment: (assignmentId: string, link: string, notes: string, studentId: string, studentName: string, studentEmail: string) => void;
  gradeSubmission: (submissionId: string, marks: number, feedback: string) => void;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage or fallback to reference defaults
  const [courses, setCourses] = useState<Course[]>(() => {
    const s = localStorage.getItem('tetra_courses');
    return s ? JSON.parse(s) : initialCourses;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const s = localStorage.getItem('tetra_services');
    return s ? JSON.parse(s) : initialServices;
  });

  const [trainers, setTrainers] = useState<Trainer[]>(() => {
    const s = localStorage.getItem('tetra_trainers');
    return s ? JSON.parse(s) : initialTrainers;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const s = localStorage.getItem('tetra_testimonials');
    return s ? JSON.parse(s) : initialTestimonials;
  });

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const s = localStorage.getItem('tetra_hero_slides');
    return s ? JSON.parse(s) : initialHeroSlides;
  });

  const [statistics, setStatistics] = useState<StatisticsData>(() => {
    const s = localStorage.getItem('tetra_statistics');
    return s ? JSON.parse(s) : initialStatistics;
  });

  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() => {
    const s = localStorage.getItem('tetra_settings');
    return s ? JSON.parse(s) : initialWebsiteSettings;
  });

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const s = localStorage.getItem('tetra_enrollments');
    if (s) return JSON.parse(s);
    // Seed initial demo enrollment for student
    return [
      {
        id: 'enr-1',
        studentId: 'student-demo-1',
        studentName: 'Tanvir Hossain',
        studentEmail: 'student@tetra.com.bd',
        courseId: 'course-1',
        courseTitle: 'AI Automation & Productivity',
        courseThumbnail: '/assets/extracted/course-ai.png',
        enrolledAt: '2026-02-14',
        progressPercent: 35,
        completedLessons: ['l1-1'],
        paymentStatus: 'paid',
        amount: 4500,
        certificateIssued: false,
      },
      {
        id: 'enr-2',
        studentId: 'student-demo-1',
        studentName: 'Tanvir Hossain',
        studentEmail: 'student@tetra.com.bd',
        courseId: 'course-4',
        courseTitle: 'Full Stack Web Development',
        courseThumbnail: '/assets/extracted/course-web.png',
        enrolledAt: '2026-02-20',
        progressPercent: 15,
        completedLessons: ['l4-1'],
        paymentStatus: 'paid',
        amount: 7990,
        certificateIssued: false,
      },
    ];
  });

  const [inquiries, setInquiries] = useState<ServiceInquiry[]>(() => {
    const s = localStorage.getItem('tetra_inquiries');
    if (s) return JSON.parse(s);
    return [
      {
        id: 'inq-1',
        name: 'Kazi Mahbub',
        email: 'mahbub@apex-bd.com',
        phone: '+880 1711-223344',
        serviceCategory: 'AI Solutions',
        budget: '৳ 50,000 - 100,000',
        message: 'We require an automated AI lead qualification agent for our real estate business.',
        status: 'new',
        createdAt: '2026-03-10',
      },
    ];
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const s = localStorage.getItem('tetra_contact_messages');
    if (s) return JSON.parse(s);
    return [
      {
        id: 'msg-1',
        name: 'Farhana Ahmed',
        email: 'farhana@gmail.com',
        phone: '+880 1819-334455',
        subject: 'Offline Batch Inquiry in Agrabad Campus',
        message: 'Do you offer weekend in-person classes at the Agrabad campus for Digital Marketing?',
        status: 'unread',
        createdAt: '2026-03-12',
      },
    ];
  });

  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    const s = localStorage.getItem('tetra_subscribers');
    return s ? JSON.parse(s) : [
      { id: 'sub-1', email: 'techlead@dhaka.io', subscribedAt: '2026-02-01' },
      { id: 'sub-2', email: 'sharif@ctgbusiness.com', subscribedAt: '2026-02-18' },
    ];
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const s = localStorage.getItem('tetra_certificates');
    return s ? JSON.parse(s) : initialCertificates;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const s = localStorage.getItem('tetra_submissions');
    return s ? JSON.parse(s) : [
      {
        id: 'subm-1',
        assignmentId: 'asg-1',
        studentId: 'student-demo-1',
        studentName: 'Tanvir Hossain',
        studentEmail: 'student@tetra.com.bd',
        submissionLink: 'https://github.com/tanvir/tetra-ai-capstone',
        notes: 'Completed the automated n8n webhook workflow with Gemini prompt chained triggers.',
        submittedAt: '2026-03-05',
        marksObtained: 95,
        feedback: 'Outstanding implementation of the multi-agent orchestration. Clean execution!',
        status: 'graded',
      },
    ];
  });

  // Sync to local storage
  useEffect(() => { localStorage.setItem('tetra_courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('tetra_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('tetra_trainers', JSON.stringify(trainers)); }, [trainers]);
  useEffect(() => { localStorage.setItem('tetra_testimonials', JSON.stringify(testimonials)); }, [testimonials]);
  useEffect(() => { localStorage.setItem('tetra_hero_slides', JSON.stringify(heroSlides)); }, [heroSlides]);
  useEffect(() => { localStorage.setItem('tetra_statistics', JSON.stringify(statistics)); }, [statistics]);
  useEffect(() => { localStorage.setItem('tetra_settings', JSON.stringify(websiteSettings)); }, [websiteSettings]);
  useEffect(() => { localStorage.setItem('tetra_enrollments', JSON.stringify(enrollments)); }, [enrollments]);
  useEffect(() => { localStorage.setItem('tetra_inquiries', JSON.stringify(inquiries)); }, [inquiries]);
  useEffect(() => { localStorage.setItem('tetra_contact_messages', JSON.stringify(contactMessages)); }, [contactMessages]);
  useEffect(() => { localStorage.setItem('tetra_subscribers', JSON.stringify(subscribers)); }, [subscribers]);
  useEffect(() => { localStorage.setItem('tetra_certificates', JSON.stringify(certificates)); }, [certificates]);
  useEffect(() => { localStorage.setItem('tetra_submissions', JSON.stringify(submissions)); }, [submissions]);

  // Operations
  const updateHeroSlide = (id: string, updates: Partial<HeroSlide>) => {
    setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const addHeroSlide = (slide: HeroSlide) => {
    setHeroSlides((prev) => [...prev, slide]);
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const reorderHeroSlides = (newSlides: HeroSlide[]) => {
    setHeroSlides(newSlides);
  };

  const updateStatistics = (stats: Partial<StatisticsData>) => {
    setStatistics((prev) => ({ ...prev, ...stats }));
  };

  const addCourse = (course: Course) => {
    setCourses((prev) => [course, ...prev]);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const addService = (service: ServiceItem) => {
    setServices((prev) => [...prev, service]);
  };

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const addTrainer = (trainer: Trainer) => {
    setTrainers((prev) => [...prev, trainer]);
  };

  const updateTrainer = (id: string, updates: Partial<Trainer>) => {
    setTrainers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTrainer = (id: string) => {
    setTrainers((prev) => prev.filter((t) => t.id !== id));
  };

  const approveTestimonial = (id: string) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, approved: true } : t)));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const addTestimonial = (test: Omit<Testimonial, 'id' | 'createdAt'>) => {
    const newTest: Testimonial = {
      ...test,
      id: 'test-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTestimonials((prev) => [newTest, ...prev]);
  };

  const updateWebsiteSettings = (newSettings: Partial<WebsiteSettings>) => {
    setWebsiteSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const enrollInCourse = async (
    course: Course,
    studentId: string,
    studentName: string,
    studentEmail: string
  ): Promise<Enrollment> => {
    const existing = enrollments.find((e) => e.courseId === course.id && e.studentId === studentId);
    if (existing) return existing;

    const newEnrollment: Enrollment = {
      id: 'enr-' + Date.now(),
      studentId,
      studentName,
      studentEmail,
      courseId: course.id,
      courseTitle: course.title,
      courseThumbnail: course.thumbnail,
      enrolledAt: new Date().toISOString().split('T')[0],
      progressPercent: 0,
      completedLessons: [],
      paymentStatus: 'paid',
      amount: course.currentPrice,
      certificateIssued: false,
    };

    setEnrollments((prev) => [newEnrollment, ...prev]);
    return newEnrollment;
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    setEnrollments((prev) =>
      prev.map((e) => {
        if (e.courseId === courseId) {
          if (!e.completedLessons.includes(lessonId)) {
            const completed = [...e.completedLessons, lessonId];
            const course = courses.find((c) => c.id === courseId);
            const totalLessons = course?.lessonsCount || 10;
            const progress = Math.min(100, Math.round((completed.length / totalLessons) * 100));
            return {
              ...e,
              completedLessons: completed,
              progressPercent: progress,
              certificateIssued: progress === 100 ? true : e.certificateIssued,
            };
          }
        }
        return e;
      })
    );
  };

  const submitServiceInquiry = async (
    inquiryData: Omit<ServiceInquiry, 'id' | 'createdAt' | 'status'>
  ): Promise<boolean> => {
    const newInquiry: ServiceInquiry = {
      ...inquiryData,
      id: 'inq-' + Date.now(),
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    return true;
  };

  const updateInquiryStatus = (id: string, status: ServiceInquiry['status'], notes?: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status, notes: notes ?? inq.notes } : inq))
    );
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  };

  const submitContactForm = async (
    contactData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>
  ): Promise<boolean> => {
    const newMsg: ContactMessage = {
      ...contactData,
      id: 'msg-' + Date.now(),
      status: 'unread',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setContactMessages((prev) => [newMsg, ...prev]);
    return true;
  };

  const subscribeToNewsletter = async (email: string) => {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
      return { success: true, message: 'You are already subscribed to the TETRA newsletter!' };
    }
    const newSub: NewsletterSubscriber = {
      id: 'sub-' + Date.now(),
      email,
      subscribedAt: new Date().toISOString().split('T')[0],
    };
    setSubscribers((prev) => [newSub, ...prev]);
    return { success: true, message: 'Thank you for subscribing! Check your inbox for updates.' };
  };

  const verifyCertificateNumber = (certNum: string): Certificate | undefined => {
    const cleanNum = certNum.trim().toUpperCase();
    return certificates.find(
      (c) => c.certificateNumber.toUpperCase() === cleanNum || c.id === cleanNum
    );
  };

  const submitAssignment = (
    assignmentId: string,
    link: string,
    notes: string,
    studentId: string,
    studentName: string,
    studentEmail: string
  ) => {
    const newSub: Submission = {
      id: 'subm-' + Date.now(),
      assignmentId,
      studentId,
      studentName,
      studentEmail,
      submissionLink: link,
      notes,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setSubmissions((prev) => [newSub, ...prev]);
  };

  const gradeSubmission = (submissionId: string, marks: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId ? { ...s, marksObtained: marks, feedback, status: 'graded' } : s
      )
    );
  };

  const resetToDefaults = () => {
    setCourses(initialCourses);
    setServices(initialServices);
    setTrainers(initialTrainers);
    setTestimonials(initialTestimonials);
    setHeroSlides(initialHeroSlides);
    setStatistics(initialStatistics);
    setWebsiteSettings(initialWebsiteSettings);
    setCertificates(initialCertificates);
  };

  return (
    <DataContext.Provider
      value={{
        courses,
        services,
        trainers,
        testimonials,
        heroSlides,
        statistics,
        websiteSettings,
        enrollments,
        inquiries,
        contactMessages,
        subscribers,
        certificates,
        submissions,
        updateHeroSlide,
        addHeroSlide,
        deleteHeroSlide,
        reorderHeroSlides,
        updateStatistics,
        addCourse,
        updateCourse,
        deleteCourse,
        addService,
        updateService,
        deleteService,
        addTrainer,
        updateTrainer,
        deleteTrainer,
        approveTestimonial,
        deleteTestimonial,
        addTestimonial,
        updateWebsiteSettings,
        enrollInCourse,
        markLessonComplete,
        submitServiceInquiry,
        updateInquiryStatus,
        deleteInquiry,
        submitContactForm,
        subscribeToNewsletter,
        verifyCertificateNumber,
        submitAssignment,
        gradeSubmission,
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
