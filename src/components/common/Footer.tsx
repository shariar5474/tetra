import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { TetraLogo } from './TetraLogo';
import { useData } from '../../context/DataContext';

export const Footer: React.FC = () => {
  const { websiteSettings, subscribeToNewsletter } = useData();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subMessage, setSubMessage] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribing(true);
    const res = await subscribeToNewsletter(newsletterEmail);
    setSubscribing(false);
    setSubMessage(res.message);
    if (res.success) {
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#050D1A] text-gray-300 pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <TetraLogo variant="horizontal" theme="dark" size="md" />
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed pr-4">
              {websiteSettings.footerBio}
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {/* Facebook */}
              <a
                href={websiteSettings.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-[#1877F2]/20 hover:bg-[#1877F2] text-[#1877F2] hover:text-white flex items-center justify-center transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={websiteSettings.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-[#FF0000]/20 hover:bg-[#FF0000] text-[#FF0000] hover:text-white flex items-center justify-center transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href={websiteSettings.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-[#0A66C2]/20 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white flex items-center justify-center transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={websiteSettings.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-[#E4405F]/20 hover:bg-[#E4405F] text-[#E4405F] hover:text-white flex items-center justify-center transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href={websiteSettings.socialLinks.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-gray-200 hover:text-black flex items-center justify-center transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-[#00A9FF] transition flex items-center gap-1.5">
                  <span className="text-[#00A9FF]">•</span> Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-[#00A9FF] transition flex items-center gap-1.5">
                  <span className="text-[#00A9FF]">•</span> Courses
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#00A9FF] transition flex items-center gap-1.5">
                  <span className="text-[#00A9FF]">•</span> Services
                </Link>
              </li>
              <li>
                <Link to="/trainers" className="hover:text-[#00A9FF] transition flex items-center gap-1.5">
                  <span className="text-[#00A9FF]">•</span> Trainers
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#00A9FF] transition flex items-center gap-1.5">
                  <span className="text-[#00A9FF]">•</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#00A9FF] transition flex items-center gap-1.5">
                  <span className="text-[#00A9FF]">•</span> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/verify-certificate" className="hover:text-[#00A9FF] transition flex items-center gap-1.5">
                  <span className="text-[#00A9FF]">•</span> Verify Certificate
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Services (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/services/ai-solutions" className="hover:text-[#00A9FF] transition flex items-center gap-1.5">
                  <span className="text-[#00A9FF]">•</span> AI Solutions
                </Link>
              </li>
              <li>
                <Link to="/services/digital-marketing" className="hover:text-[#00A9FF] transition flex items-center gap-1.5">
                  <span className="text-[#00A9FF]">•</span> Digital Marketing
                </Link>
              </li>
              <li>
                <Link to="/services/graphics-design" className="hover:text-[#00A9FF] transition flex items-center gap-1.5">
                  <span className="text-[#00A9FF]">•</span> Graphics Design
                </Link>
              </li>
              <li>
                <Link to="/services/web-development" className="hover:text-[#00A9FF] transition flex items-center gap-1.5">
                  <span className="text-[#00A9FF]">•</span> Web Development
                </Link>
              </li>
              <li>
                <Link to="/services/business-automation" className="hover:text-[#00A9FF] transition flex items-center gap-1.5">
                  <span className="text-[#00A9FF]">•</span> Business Automation
                </Link>
              </li>
              <li>
                <Link to="/services/it-consulting" className="hover:text-[#00A9FF] transition flex items-center gap-1.5">
                  <span className="text-[#00A9FF]">•</span> IT Consulting
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us & Newsletter (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#00A9FF] shrink-0 mt-0.5" />
                <a href={`tel:${websiteSettings.phone}`} className="hover:text-white transition">
                  {websiteSettings.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#00A9FF] shrink-0 mt-0.5" />
                <a href={`mailto:${websiteSettings.email}`} className="hover:text-white transition">
                  {websiteSettings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00A9FF] shrink-0 mt-0.5" />
                <span className="leading-snug">{websiteSettings.officeAddress}</span>
              </li>
            </ul>

            {/* View on Map link matching Reference */}
            <div>
              <a
                href={websiteSettings.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#00A9FF] transition"
              >
                <MapPin className="w-3 h-3" />
                <span>View on Map</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            </div>

            {/* Newsletter Subscription Box matching Reference */}
            <div className="pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-white mb-1">
                Newsletter
              </div>
              <p className="text-xs text-gray-400 mb-2">
                Subscribe to get course updates, offers and tech tips.
              </p>
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-[#0B1B33] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#00A9FF] pr-12 transition shadow-inner"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#00A9FF] hover:bg-[#0096e6] text-white rounded-md flex items-center justify-center transition disabled:opacity-50 cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              {subMessage && (
                <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{subMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar matching Reference */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <div>{websiteSettings.copyright}</div>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/about" className="hover:text-gray-300 transition">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link to="/about" className="hover:text-gray-300 transition">
              Terms &amp; Conditions
            </Link>
            <span>|</span>
            <Link to="/about" className="hover:text-gray-300 transition">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
