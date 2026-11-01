import React from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle2, Download, ExternalLink, Printer } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { TetraLogo } from '../../components/common/TetraLogo';

export const StudentCertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const { certificates, enrollments } = useData();

  // Find certificates matching this user
  const userCertificates = certificates.filter(
    (c) => c.studentId === user?.id || c.studentName.toLowerCase() === user?.name.toLowerCase()
  );

  return (
    <div className="bg-[#F5F7FC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071426]">
              My Verified Credentials &amp; Certificates
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Official accredited diplomas and certificates earned from TETRA programs.
            </p>
          </div>

          <Link
            to="/student/dashboard"
            className="text-xs font-bold text-[#00A9FF] hover:underline"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {userCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userCertificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified &amp; Authenticated</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{cert.certificateNumber}</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#071426] leading-snug">
                    {cert.courseTitle}
                  </h3>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span>Awarded To:</span>
                      <strong className="text-slate-800">{cert.studentName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Evaluation Grade:</span>
                      <strong className="text-emerald-600">{cert.grade}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Issue Date:</span>
                      <span>{cert.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lead Instructor:</span>
                      <span>{cert.trainerName}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    to={`/verify-certificate?id=${cert.certificateNumber}`}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#00A9FF] hover:bg-[#0096e6] text-white text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Public Credential</span>
                  </Link>

                  <button
                    onClick={() => window.open(`/verify-certificate?id=${cert.certificateNumber}`, '_blank')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                    title="Print / Save PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
            <Award className="w-14 h-14 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">No certificates earned yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete 100% of your course video modules and have your capstone project evaluated to generate your tamper-proof certificate.
            </p>
            <Link
              to="/student/dashboard"
              className="inline-block px-6 py-2.5 rounded-xl bg-[#00A9FF] text-white text-xs font-bold"
            >
              Go to Classroom
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
