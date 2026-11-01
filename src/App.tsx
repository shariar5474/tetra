import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { CoursesPage } from './pages/public/CoursesPage';
import { CourseDetailsPage } from './pages/public/CourseDetailsPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ServiceDetailsPage } from './pages/public/ServiceDetailsPage';
import { TrainersPage } from './pages/public/TrainersPage';
import { TrainerProfilePage } from './pages/public/TrainerProfilePage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { BlogPage } from './pages/public/BlogPage';
import { BlogDetailsPage } from './pages/public/BlogDetailsPage';
import { VerifyCertificatePage } from './pages/public/VerifyCertificatePage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { TrainerLoginPage } from './pages/auth/TrainerLoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Student Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { StudentLearnPage } from './pages/student/StudentLearnPage';
import { StudentCertificatesPage } from './pages/student/StudentCertificatesPage';
import { StudentAssignmentsPage } from './pages/student/StudentAssignmentsPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Trainer Pages
import { TrainerDashboardPage } from './pages/trainer/TrainerDashboardPage';

// Super Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Main Public Layout with Sticky Nav & Footer
const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Website Pages with Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:slug" element={<CourseDetailsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailsPage />} />
          <Route path="/trainers" element={<TrainersPage />} />
          <Route path="/trainers/:id" element={<TrainerProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailsPage />} />
          <Route path="/verify-certificate" element={<VerifyCertificatePage />} />
          
          {/* Dashboard views under layout */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student', 'super_admin']}>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/certificates"
            element={
              <ProtectedRoute allowedRoles={['student', 'super_admin']}>
                <StudentCertificatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/assignments"
            element={
              <ProtectedRoute allowedRoles={['student', 'super_admin']}>
                <StudentAssignmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={['student', 'super_admin']}>
                <StudentProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['trainer', 'super_admin']}>
                <TrainerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Specialized Focus / Fullscreen Classroom Learner View */}
        <Route
          path="/student/learn/:courseId"
          element={
            <ProtectedRoute allowedRoles={['student', 'super_admin', 'trainer']}>
              <StudentLearnPage />
            </ProtectedRoute>
          }
        />

        {/* Standalone Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/trainer-login" element={<TrainerLoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
