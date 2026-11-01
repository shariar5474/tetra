import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ExternalLink, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const StudentAssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const { submissions } = useData();

  const userSubmissions = submissions.filter(
    (s) => s.studentId === user?.id || s.studentEmail === user?.email
  );

  return (
    <div className="bg-[#F5F7FC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071426]">
              Assignments &amp; Capstone Submissions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review your graded tasks, test scores, and instructor feedback.
            </p>
          </div>

          <Link to="/student/dashboard" className="text-xs font-bold text-[#00A9FF] hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          {userSubmissions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {userSubmissions.map((subm) => (
                <div key={subm.id} className="p-6 sm:p-8 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-[#00A9FF] uppercase tracking-wider">
                        Capstone Project Submission
                      </div>
                      <div className="text-sm font-semibold text-slate-800 mt-1">
                        Repository / Demo Link:{' '}
                        <a
                          href={subm.submissionLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#00A9FF] underline font-mono"
                        >
                          {subm.submissionLink}
                        </a>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${
                        subm.status === 'graded'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {subm.status === 'graded' ? 'Graded' : 'Awaiting Review'}
                    </span>
                  </div>

                  {subm.notes && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl">
                      <strong>My Notes:</strong> {subm.notes}
                    </div>
                  )}

                  {subm.status === 'graded' && (
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800">Trainer Evaluation</span>
                        <span className="text-sm font-extrabold text-emerald-700">
                          {subm.marksObtained} / 100 Marks
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700 italic">
                        "{subm.feedback}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-3">
              <CheckSquare className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No assignment submissions yet</h3>
              <p className="text-xs text-slate-400">
                Open your course classroom to submit your project files and code repositories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
