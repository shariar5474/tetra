import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Briefcase,
  ShieldAlert,
  GraduationCap,
} from 'lucide-react';
import { TetraLogo } from './TetraLogo';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const Navbar: React.FC = () => {
  const { user, logout, switchRoleDemo } = useAuth();
  const { services, courses } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [coursesDropdown, setCoursesDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [demoRoleDropdown, setDemoRoleDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.role === 'super_admin') return '/admin/dashboard';
    if (user.role === 'trainer') return '/trainer/dashboard';
    return '/student/dashboard';
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#071426]/95 backdrop-blur-md shadow-lg border-b border-white/10'
          : 'bg-[#071426] border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Official TETRA Logo */}
          <div className="flex-shrink-0 flex items-center">
            <TetraLogo variant="horizontal" theme="dark" size="md" />
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'text-[#00A9FF] font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              Home
            </NavLink>

            {/* Services with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                onClick={() => navigate('/services')}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesDropdown ? 'rotate-180 text-[#00A9FF]' : ''
                  }`}
                />
              </button>

              {/* Services Dropdown Menu */}
              {servicesDropdown && (
                <div className="absolute left-0 mt-1 w-72 rounded-xl bg-[#0B1B33] border border-white/10 shadow-2xl p-2 z-50 animate-fadeIn">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 px-3 py-1.5 border-b border-white/10">
                    Digital Agency Services
                  </div>
                  {services.map((srv) => (
                    <Link
                      key={srv.id}
                      to={`/services/${srv.slug}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-[#00A9FF]/15 transition-all"
                      onClick={() => setServicesDropdown(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-[#00A9FF]">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{srv.title}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[170px]">
                          {srv.shortDescription}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="pt-1 mt-1 border-t border-white/10">
                    <Link
                      to="/services"
                      className="block text-center text-xs font-medium text-[#00A9FF] hover:underline py-1.5"
                      onClick={() => setServicesDropdown(false)}
                    >
                      View All Services &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Courses with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCoursesDropdown(true)}
              onMouseLeave={() => setCoursesDropdown(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                onClick={() => navigate('/courses')}
              >
                <span>Courses</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    coursesDropdown ? 'rotate-180 text-[#00A9FF]' : ''
                  }`}
                />
              </button>

              {/* Courses Dropdown Menu */}
              {coursesDropdown && (
                <div className="absolute left-0 mt-1 w-80 rounded-xl bg-[#0B1B33] border border-white/10 shadow-2xl p-2 z-50 animate-fadeIn">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 px-3 py-1.5 border-b border-white/10">
                    Popular Training Programs
                  </div>
                  {courses.slice(0, 4).map((c) => (
                    <Link
                      key={c.id}
                      to={`/courses/${c.slug}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-[#00A9FF]/15 transition-all"
                      onClick={() => setCoursesDropdown(false)}
                    >
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-10 h-7 object-cover rounded shadow"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">{c.title}</div>
                        <div className="text-xs text-[#00A9FF] flex items-center gap-2">
                          <span>৳ {c.currentPrice.toLocaleString()}</span>
                          <span className="text-gray-400 line-through text-[11px]">৳ {c.previousPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="pt-1 mt-1 border-t border-white/10">
                    <Link
                      to="/courses"
                      className="block text-center text-xs font-medium text-[#00A9FF] hover:underline py-1.5"
                      onClick={() => setCoursesDropdown(false)}
                    >
                      View All Courses &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/trainers"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive ? 'text-[#00A9FF] font-semibold' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              Trainers
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive ? 'text-[#00A9FF] font-semibold' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              About Us
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive ? 'text-[#00A9FF] font-semibold' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              Contact Us
            </NavLink>
          </nav>

          {/* Right: Actions / Auth */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Demo Role Switcher Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoRoleDropdown(!demoRoleDropdown)}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 hover:text-white transition cursor-pointer"
                title="Switch role instantly to test all features"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00A9FF]" />
                <span>
                  {user ? (user.role === 'super_admin' ? 'Admin' : user.role === 'trainer' ? 'Trainer' : 'Student') : 'Demo Persona'}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {demoRoleDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0B1B33] border border-white/15 shadow-2xl p-2 z-50 text-xs">
                  <div className="px-2 py-1 text-gray-400 font-semibold uppercase text-[10px]">
                    Quick Persona Switcher
                  </div>
                  <button
                    onClick={() => {
                      switchRoleDemo('super_admin');
                      setDemoRoleDropdown(false);
                      navigate('/admin/dashboard');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2 text-white"
                  >
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-emerald-400">Super Admin</div>
                      <div className="text-[11px] text-gray-400">Full CMS & control panel</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchRoleDemo('trainer');
                      setDemoRoleDropdown(false);
                      navigate('/trainer/dashboard');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2 text-white"
                  >
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="font-semibold text-purple-400">Trainer</div>
                      <div className="text-[11px] text-gray-400">Courses & grading</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchRoleDemo('student');
                      setDemoRoleDropdown(false);
                      navigate('/student/dashboard');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2 text-white"
                  >
                    <User className="w-4 h-4 text-[#00A9FF]" />
                    <div>
                      <div className="font-semibold text-[#00A9FF]">Student</div>
                      <div className="text-[11px] text-gray-400">LMS classroom & player</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setDemoRoleDropdown(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-red-500/10 text-gray-300 hover:text-red-400 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out (Public Visitor)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Authenticated user vs Guest */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 transition cursor-pointer"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-[#00A9FF]"
                  />
                  <span className="text-sm font-medium text-white max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0B1B33] border border-white/15 shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-white/10">
                      <div className="font-medium text-white text-sm truncate">{user.name}</div>
                      <div className="text-xs text-[#00A9FF] capitalize">{user.role.replace('_', ' ')}</div>
                    </div>
                    <Link
                      to={getDashboardRoute()}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-white/10 mt-1"
                      onClick={() => setUserDropdown(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#00A9FF]" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                {/* Login Button matching Reference (Dark pill with user icon) */}
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-[#0e213d] hover:bg-[#132d54] border border-white/10 transition shadow-sm"
                >
                  <User className="w-4 h-4 text-gray-300" />
                  <span>Login</span>
                </Link>

                {/* Registration Button matching Reference (Solid Electric Blue) */}
                <Link
                  to="/register"
                  className="flex items-center justify-center px-5 py-2 rounded-md text-sm font-semibold text-white bg-[#00A9FF] hover:bg-[#0096e6] transition shadow-md shadow-[#00A9FF]/20"
                >
                  Registration
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#071426] border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/services"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            to="/courses"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Courses
          </Link>
          <Link
            to="/trainers"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Trainers
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact Us
          </Link>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={getDashboardRoute()}
                  className="w-full py-2.5 text-center font-medium bg-[#00A9FF] text-white rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Go to {user.role.replace('_', ' ')} Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm text-red-400"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="py-2.5 text-center font-medium bg-white/10 text-white rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="py-2.5 text-center font-semibold bg-[#00A9FF] text-white rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registration
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
