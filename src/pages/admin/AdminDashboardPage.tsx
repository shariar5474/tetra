import React, { useState } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Sliders,
  BookOpen,
  Briefcase,
  Users,
  MessageSquare,
  Mail,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  TrendingUp,
  Award,
  DollarSign,
  Eye,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Course, ServiceItem, Trainer, HeroSlide } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    courses,
    services,
    trainers,
    testimonials,
    heroSlides,
    statistics,
    websiteSettings,
    enrollments,
    inquiries,
    subscribers,
    updateHeroSlide,
    addHeroSlide,
    deleteHeroSlide,
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
    updateWebsiteSettings,
    updateInquiryStatus,
    deleteInquiry,
    resetToDefaults,
  } = useData();

  type AdminTab =
    | 'overview'
    | 'homepage'
    | 'hero'
    | 'statistics'
    | 'courses'
    | 'services'
    | 'trainers'
    | 'testimonials'
    | 'inquiries'
    | 'subscribers'
    | 'users'
    | 'payments'
    | 'activity'
    | 'settings';

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const showSaveNotice = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // State for editing Hero Slide 1 in Homepage Builder
  const primaryHero = heroSlides[0];
  const [heroForm, setHeroForm] = useState({
    badgeText: primaryHero?.badgeText || 'Learn • Build • Grow with TETRA',
    headlineLine1: primaryHero?.headlineLine1 || 'Master In-Demand',
    headlineLine2: primaryHero?.headlineLine2 || 'IT Skills & Build',
    headlineHighlight: primaryHero?.headlineHighlight || 'Your Career',
    description: primaryHero?.description || '',
    primaryBtnText: primaryHero?.primaryBtnText || 'Explore Courses',
    primaryBtnLink: primaryHero?.primaryBtnLink || '/courses',
    secondaryBtnText: primaryHero?.secondaryBtnText || 'Our Services',
    secondaryBtnLink: primaryHero?.secondaryBtnLink || '/services',
  });

  // State for editing Settings
  const [settingsForm, setSettingsForm] = useState({
    phone: websiteSettings.phone,
    email: websiteSettings.email,
    officeAddress: websiteSettings.officeAddress,
    googleMapsUrl: websiteSettings.googleMapsUrl,
    footerBio: websiteSettings.footerBio,
    copyright: websiteSettings.copyright,
    ctaTitle: websiteSettings.ctaBanner.title,
    ctaSubtitle: websiteSettings.ctaBanner.subtitle,
    ctaBtnText: websiteSettings.ctaBanner.buttonText,
  });

  // State for editing Statistics
  const [statsForm, setStatsForm] = useState({
    learnersCount: statistics.learnersCount,
    trainersCount: statistics.trainersCount,
    coursesCount: statistics.coursesCount,
    servicesCount: statistics.servicesCount,
    successRate: statistics.successRate,
  });

  // Calculation for total simulated revenue
  const totalRevenue = enrollments.reduce((acc, curr) => acc + (curr.amount || 0), 1250000);

  const handleSaveHomepageHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (primaryHero?.id) {
      updateHeroSlide(primaryHero.id, heroForm);
      showSaveNotice('Homepage Hero updated! Changes are live on the public site.');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteSettings({
      phone: settingsForm.phone,
      email: settingsForm.email,
      officeAddress: settingsForm.officeAddress,
      googleMapsUrl: settingsForm.googleMapsUrl,
      footerBio: settingsForm.footerBio,
      copyright: settingsForm.copyright,
      ctaBanner: {
        ...websiteSettings.ctaBanner,
        title: settingsForm.ctaTitle,
        subtitle: settingsForm.ctaSubtitle,
        buttonText: settingsForm.ctaBtnText,
      },
    });
    showSaveNotice('Global Website Settings & Footer saved live!');
  };

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatistics(statsForm);
    showSaveNotice('Statistics bar numbers updated live!');
  };

  return (
    <div className="bg-[#0B1528] min-h-screen text-slate-100 flex flex-col md:flex-row">
      {/* Admin Sidebar matching Requirement 17 */}
      <aside className="w-full md:w-64 bg-[#071426] border-r border-white/10 p-5 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00A9FF] to-[#087BFF] flex items-center justify-center font-bold text-white shadow-lg">
              T
            </div>
            <div>
              <div className="font-extrabold text-sm text-white tracking-wide">TETRA ADMIN</div>
              <div className="text-[10px] text-emerald-400 font-semibold uppercase">Super Master CMS</div>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#00A9FF] text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('homepage')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'homepage'
                  ? 'bg-[#00A9FF] text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Homepage Live Builder</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'hero'
                  ? 'bg-[#00A9FF] text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Hero Carousel Manager</span>
            </button>

            <button
              onClick={() => setActiveTab('statistics')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'statistics'
                  ? 'bg-[#00A9FF] text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Statistics Bar Manager</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-[#00A9FF] text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Course Catalog ({courses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#00A9FF] text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Service Solutions ({services.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('trainers')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'trainers'
                  ? 'bg-[#00A9FF] text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Faculty &amp; Trainers ({trainers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'testimonials'
                  ? 'bg-[#00A9FF] text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Student Testimonials ({testimonials.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[#00A9FF] text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Project Inquiries ({inquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('subscribers')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'subscribers'
                  ? 'bg-[#00A9FF] text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Newsletter Subscribers ({subscribers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#00A9FF] text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-[#00A9FF] text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Payment Ledger</span>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'activity'
                  ? 'bg-[#00A9FF] text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Activity Audit Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#00A9FF] text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Global Settings &amp; Footer</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer info */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition"
          >
            <Eye className="w-3.5 h-3.5 text-[#00A9FF]" />
            <span>Open Public Website</span>
          </a>

          <button
            onClick={resetToDefaults}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </aside>

      {/* Admin Main Workspace */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Success Alert Banner */}
        {saveSuccessNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{saveSuccessNotice}</span>
          </div>
        )}

        {/* VIEW: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Super Admin Management Console
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Full control over courses, live content, faculty members, and client project leads.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400">Database Live &amp; Synced</span>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-3xl bg-[#071426] border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-gray-400 text-xs font-semibold">
                  <span>Total Enrollments</span>
                  <BookOpen className="w-4 h-4 text-[#00A9FF]" />
                </div>
                <div className="text-3xl font-black text-white">{enrollments.length + 1240}</div>
                <div className="text-[11px] text-emerald-400">+18% this month</div>
              </div>

              <div className="p-6 rounded-3xl bg-[#071426] border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-gray-400 text-xs font-semibold">
                  <span>Gross Tuition Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white">৳ {totalRevenue.toLocaleString()}</div>
                <div className="text-[11px] text-emerald-400">Verified platform payments</div>
              </div>

              <div className="p-6 rounded-3xl bg-[#071426] border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-gray-400 text-xs font-semibold">
                  <span>Agency Leads</span>
                  <Briefcase className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-white">{inquiries.length}</div>
                <div className="text-[11px] text-[#00A9FF]">Client service inquiries</div>
              </div>

              <div className="p-6 rounded-3xl bg-[#071426] border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-gray-400 text-xs font-semibold">
                  <span>Subscribers</span>
                  <Mail className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white">{subscribers.length + 380}</div>
                <div className="text-[11px] text-gray-400">Tech tips newsletter</div>
              </div>
            </div>

            {/* Recent Leads Queue */}
            <div className="bg-[#071426] rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="font-bold text-base text-white">Recent Client Inquiries</h3>
              <div className="divide-y divide-white/5">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{inq.name}</span> &bull; {inq.serviceCategory} &bull; <span className="text-[#00A9FF]">{inq.budget}</span>
                      <p className="text-gray-400 text-[11px] mt-0.5">{inq.message}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-[#00A9FF] font-semibold text-[10px] capitalize">
                      {inq.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: HOMEPAGE BUILDER */}
        {activeTab === 'homepage' && (
          <div className="space-y-6 animate-fadeIn max-w-4xl">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Homepage Live Builder</h2>
              <p className="text-xs text-gray-400 mt-1">
                Edit headlines, descriptions, and CTA links. Saves directly to the public website without altering code.
              </p>
            </div>

            <form onSubmit={handleSaveHomepageHero} className="bg-[#071426] rounded-3xl p-8 border border-white/10 space-y-5 text-xs sm:text-sm">
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-bold text-base text-white text-[#00A9FF]">Hero Section Copy</h3>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Badge Pill Text</label>
                <input
                  type="text"
                  value={heroForm.badgeText}
                  onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Headline Line 1</label>
                  <input
                    type="text"
                    value={heroForm.headlineLine1}
                    onChange={(e) => setHeroForm({ ...heroForm, headlineLine1: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Headline Line 2</label>
                  <input
                    type="text"
                    value={heroForm.headlineLine2}
                    onChange={(e) => setHeroForm({ ...heroForm, headlineLine2: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Highlight (Blue Gradient)</label>
                  <input
                    type="text"
                    value={heroForm.headlineHighlight}
                    onChange={(e) => setHeroForm({ ...heroForm, headlineHighlight: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Description Paragraph</label>
                <textarea
                  rows={3}
                  value={heroForm.description}
                  onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    value={heroForm.primaryBtnText}
                    onChange={(e) => setHeroForm({ ...heroForm, primaryBtnText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Primary Button Target URL</label>
                  <input
                    type="text"
                    value={heroForm.primaryBtnLink}
                    onChange={(e) => setHeroForm({ ...heroForm, primaryBtnLink: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Secondary Button Text</label>
                  <input
                    type="text"
                    value={heroForm.secondaryBtnText}
                    onChange={(e) => setHeroForm({ ...heroForm, secondaryBtnText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Secondary Button Link</label>
                  <input
                    type="text"
                    value={heroForm.secondaryBtnLink}
                    onChange={(e) => setHeroForm({ ...heroForm, secondaryBtnLink: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#00A9FF] hover:bg-[#0096e6] text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-[#00A9FF]/30"
              >
                <Save className="w-4 h-4" />
                <span>Save &amp; Publish to Homepage</span>
              </button>
            </form>
          </div>
        )}

        {/* VIEW: STATISTICS MANAGER */}
        {activeTab === 'statistics' && (
          <div className="space-y-6 animate-fadeIn max-w-2xl">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Statistics Bar Counters</h2>
              <p className="text-xs text-gray-400 mt-1">
                Update the numbers displayed on the horizontal stats bar.
              </p>
            </div>

            <form onSubmit={handleSaveStats} className="bg-[#071426] rounded-3xl p-8 border border-white/10 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Learners Counter</label>
                <input
                  type="text"
                  value={statsForm.learnersCount}
                  onChange={(e) => setStatsForm({ ...statsForm, learnersCount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Trainers Counter</label>
                <input
                  type="text"
                  value={statsForm.trainersCount}
                  onChange={(e) => setStatsForm({ ...statsForm, trainersCount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Courses Counter</label>
                <input
                  type="text"
                  value={statsForm.coursesCount}
                  onChange={(e) => setStatsForm({ ...statsForm, coursesCount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Services Counter</label>
                <input
                  type="text"
                  value={statsForm.servicesCount}
                  onChange={(e) => setStatsForm({ ...statsForm, servicesCount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Success Rate Counter</label>
                <input
                  type="text"
                  value={statsForm.successRate}
                  onChange={(e) => setStatsForm({ ...statsForm, successRate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#00A9FF] hover:bg-[#0096e6] text-white font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Statistics Bar</span>
              </button>
            </form>
          </div>
        )}

        {/* VIEW: COURSE CATALOG MANAGER */}
        {activeTab === 'courses' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-white">Course Catalog Manager</h2>
                <p className="text-xs text-gray-400 mt-1">Add, edit pricing, discounts, and manage publishing status.</p>
              </div>
            </div>

            <div className="bg-[#071426] rounded-3xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#0B1B33] text-gray-400 font-semibold border-b border-white/10">
                  <tr>
                    <th className="p-4">Course</th>
                    <th className="p-4">Badge</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-200">
                  {courses.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5">
                      <td className="p-4 flex items-center gap-3">
                        <img src={c.thumbnail} alt={c.title} className="w-12 h-8 object-cover rounded shadow" />
                        <div>
                          <div className="font-bold text-white">{c.title}</div>
                          <div className="text-[11px] text-gray-400">{c.lessonsCount} lessons &bull; {c.durationWeeks} weeks</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-[#00A9FF] font-bold text-[10px]">
                          {c.badge}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">
                        ৳ {c.currentPrice.toLocaleString()}
                      </td>
                      <td className="p-4 text-red-400 font-bold">{c.discountPercent}% Off</td>
                      <td className="p-4">★ {c.rating} ({c.reviewCount})</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            const newPrice = prompt('Enter new price for ' + c.title, String(c.currentPrice));
                            if (newPrice) {
                              updateCourse(c.id, { currentPrice: Number(newPrice) });
                              showSaveNotice(`Updated price for ${c.title}!`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#00A9FF] mr-2 cursor-pointer"
                          title="Edit Price"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: SETTINGS & FOOTER */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn max-w-4xl">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Global Settings, Footer &amp; Contact</h2>
              <p className="text-xs text-gray-400 mt-1">Manage official phone, email, office address, and CTA banner.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-[#071426] rounded-3xl p-8 border border-white/10 space-y-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Official Phone</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Official Email</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Physical Office Address</label>
                <input
                  type="text"
                  value={settingsForm.officeAddress}
                  onChange={(e) => setSettingsForm({ ...settingsForm, officeAddress: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Footer Bio Description</label>
                <textarea
                  rows={3}
                  value={settingsForm.footerBio}
                  onChange={(e) => setSettingsForm({ ...settingsForm, footerBio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                />
              </div>

              <div className="border-t border-white/10 pt-4">
                <h4 className="font-bold text-white mb-3 text-[#00A9FF]">Call to Action (CTA) Banner</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">CTA Headline</label>
                    <input
                      type="text"
                      value={settingsForm.ctaTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, ctaTitle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">CTA Subtitle</label>
                    <input
                      type="text"
                      value={settingsForm.ctaSubtitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, ctaSubtitle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#00A9FF] hover:bg-[#0096e6] text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-[#00A9FF]/30"
              >
                <Save className="w-4 h-4" />
                <span>Save All Website Settings</span>
              </button>
            </form>
          </div>
        )}

        {/* VIEW: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Student Testimonials Manager</h2>
              <p className="text-xs text-gray-400 mt-1">Approve, add or delete reviews displayed on the homepage.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl bg-[#071426] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={t.avatar} alt={t.studentName} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-white text-xs">{t.studentName}</div>
                        <div className="text-[11px] text-gray-400">{t.profession}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">★ {t.rating}.0</span>
                  </div>
                  <p className="text-xs text-gray-300 font-bengali italic">{t.quoteBengali}</p>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold">Approved</span>
                    <button
                      onClick={() => deleteTestimonial(t.id)}
                      className="text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Agency Service Inquiries</h2>
              <p className="text-xs text-gray-400 mt-1">Leads captured from the public service request forms.</p>
            </div>

            <div className="bg-[#071426] rounded-3xl border border-white/10 overflow-hidden">
              <div className="divide-y divide-white/5">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-white text-sm">
                        {inq.name} &bull; <span className="text-gray-400 font-normal">{inq.email}</span> &bull; {inq.phone}
                      </div>
                      <div className="text-xs text-[#00A9FF]">
                        Service: {inq.serviceCategory} &bull; Budget: {inq.budget}
                      </div>
                      <p className="text-xs text-gray-300 bg-white/5 p-3 rounded-xl mt-2">
                        "{inq.message}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={inq.status}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                        className="bg-[#0B1528] border border-white/15 text-xs text-white rounded-lg px-2.5 py-1.5"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>

                      <button
                        onClick={() => deleteInquiry(inq.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-extrabold text-white">User Directory &amp; Role Access</h2>
              <p className="text-xs text-gray-400 mt-1">Manage accounts for Students, Faculty Trainers, and Platform Administrators.</p>
            </div>

            <div className="bg-[#071426] rounded-3xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#0B1B33] text-gray-400 font-semibold border-b border-white/10">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Registered Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-200">
                  <tr className="hover:bg-white/5">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">SA</div>
                      <div>
                        <div className="font-bold text-white">TETRA Super Admin</div>
                        <div className="text-[11px] text-gray-400">admin@tetra.com.bd</div>
                      </div>
                    </td>
                    <td className="p-4"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Super Admin</span></td>
                    <td className="p-4 text-emerald-400 font-semibold">Active (Protected)</td>
                    <td className="p-4 text-gray-400">2026-01-01</td>
                    <td className="p-4 text-right text-gray-500">Root Account</td>
                  </tr>
                  {trainers.map((tr) => (
                    <tr key={tr.id} className="hover:bg-white/5">
                      <td className="p-4 flex items-center gap-3">
                        <img src={tr.avatar} alt={tr.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-white">{tr.name}</div>
                          <div className="text-[11px] text-gray-400">{tr.designation}</div>
                        </div>
                      </td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold text-[10px]">Trainer</span></td>
                      <td className="p-4 text-emerald-400 font-semibold">Authorized Faculty</td>
                      <td className="p-4 text-gray-400">2026-01-15</td>
                      <td className="p-4 text-right">
                        <button onClick={() => alert(`Reset password link dispatched for ${tr.name}`)} className="text-[#00A9FF] hover:underline text-xs">Reset Credential</button>
                      </td>
                    </tr>
                  ))}
                  {enrollments.map((enr) => (
                    <tr key={enr.id} className="hover:bg-white/5">
                      <td className="p-4">
                        <div className="font-bold text-white">{enr.studentName}</div>
                        <div className="text-[11px] text-gray-400">{enr.studentEmail}</div>
                      </td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded bg-blue-500/20 text-[#00A9FF] font-bold text-[10px]">Student</span></td>
                      <td className="p-4 text-emerald-400 font-semibold">Active Student</td>
                      <td className="p-4 text-gray-400">{enr.enrolledAt}</td>
                      <td className="p-4 text-right">
                        <span className="text-gray-400 text-xs">Verified Learner</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: PAYMENT LEDGER */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Platform Payment Ledger</h2>
              <p className="text-xs text-gray-400 mt-1">Real-time ledger of tuition fees and client retainer settlements.</p>
            </div>

            <div className="bg-[#071426] rounded-3xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#0B1B33] text-gray-400 font-semibold border-b border-white/10">
                  <tr>
                    <th className="p-4">Trx ID</th>
                    <th className="p-4">Learner / Client</th>
                    <th className="p-4">Course / Service</th>
                    <th className="p-4">Channel</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-200">
                  <tr className="hover:bg-white/5 font-mono">
                    <td className="p-4 text-[#00A9FF]">TRX-BK-994821</td>
                    <td className="p-4 font-sans font-bold text-white">Tanvir Hossain</td>
                    <td className="p-4 font-sans">AI Automation &amp; Productivity</td>
                    <td className="p-4 font-sans text-pink-400 font-bold">bKash Merchant</td>
                    <td className="p-4 font-bold text-white">৳ 4,500</td>
                    <td className="p-4 text-right font-sans"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Settled</span></td>
                  </tr>
                  <tr className="hover:bg-white/5 font-mono">
                    <td className="p-4 text-[#00A9FF]">TRX-NG-773210</td>
                    <td className="p-4 font-sans font-bold text-white">Nusrat Jahan</td>
                    <td className="p-4 font-sans">Full Stack Web Development</td>
                    <td className="p-4 font-sans text-orange-400 font-bold">Nagad Express</td>
                    <td className="p-4 font-bold text-white">৳ 7,990</td>
                    <td className="p-4 text-right font-sans"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Settled</span></td>
                  </tr>
                  <tr className="hover:bg-white/5 font-mono">
                    <td className="p-4 text-[#00A9FF]">TRX-VS-110294</td>
                    <td className="p-4 font-sans font-bold text-white">Apex Business Corp</td>
                    <td className="p-4 font-sans">AI Lead Automation Solution</td>
                    <td className="p-4 font-sans text-blue-400 font-bold">Corporate Visa / Wire</td>
                    <td className="p-4 font-bold text-white">৳ 50,000</td>
                    <td className="p-4 text-right font-sans"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Settled</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: ACTIVITY AUDIT LOGS */}
        {activeTab === 'activity' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-extrabold text-white">System Activity Audit Trail</h2>
              <p className="text-xs text-gray-400 mt-1">Immutable security ledger capturing platform events and content updates.</p>
            </div>

            <div className="bg-[#071426] rounded-3xl border border-white/10 p-6 space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-gray-300">
                <span>[2026-10-31 17:02:18] AUTH: Super Admin session initialized from Agrabad Headquarters IP</span>
                <span className="text-emerald-400 font-semibold">SUCCESS</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-gray-300">
                <span>[2026-10-31 16:45:00] CMS: Homepage Hero Headline updated dynamically</span>
                <span className="text-emerald-400 font-semibold">COMMITTED</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-gray-300">
                <span>[2026-10-31 15:20:12] LMS: Student Tanvir Hossain completed module checkpoint quiz</span>
                <span className="text-[#00A9FF] font-semibold">100% SCORE</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-gray-300">
                <span>[2026-10-31 14:10:05] LEAD: New agency inquiry received from Apex BD (AI Solutions)</span>
                <span className="text-amber-400 font-semibold">NOTIFIED</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
