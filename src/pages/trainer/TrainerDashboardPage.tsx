import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  CheckSquare,
  Star,
  Plus,
  Edit,
  Trash2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const TrainerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { courses, enrollments, submissions, gradeSubmission, addCourse, updateCourse } = useData();

  const trainerCourses = courses.filter((c) => c.trainerId === user?.id || user?.role === 'super_admin');
  const [activeTab, setActiveTab] = useState<'courses' | 'submissions' | 'students'>('courses');

  // Grading modal state
  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [activeSubmId, setActiveSubmId] = useState<string | null>(null);
  const [marks, setMarks] = useState(90);
  const [feedback, setFeedback] = useState('Excellent work on the architecture and clean organization.');

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSubmId) {
      gradeSubmission(activeSubmId, marks, feedback);
      setGradingModalOpen(false);
    }
  };

  return (
    <div className="bg-[#F5F7FC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Trainer Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || '/assets/extracted/trainer-1.png'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-purple-100 shadow"
            />
            <div>
              <div className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                Faculty Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071426]">
                Instructor Workspace: {user?.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage curriculum, evaluate assignments &amp; mentor future engineers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold">
              Verified Trainer Account
            </span>
          </div>
        </div>

        {/* Quick Trainer Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#071426]">{trainerCourses.length}</div>
              <div className="text-xs text-slate-500 font-medium">Assigned Courses</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#00A9FF] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#071426]">{enrollments.length}</div>
              <div className="text-xs text-slate-500 font-medium">Active Students</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#071426]">{submissions.length}</div>
              <div className="text-xs text-slate-500 font-medium">Project Submissions</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#071426]">4.9 / 5.0</div>
              <div className="text-xs text-slate-500 font-medium">Trainer Rating</div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Assigned Courses ({trainerCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
              activeTab === 'submissions'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Assignment Evaluations ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
              activeTab === 'students'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Enrolled Students ({enrollments.length})
          </button>
        </div>

        {/* Tab Content: Courses */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainerCourses.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-5 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-full aspect-[16/10] object-cover rounded-xl mb-3"
                  />
                  <div className="text-xs font-bold text-purple-600 uppercase">{c.badge}</div>
                  <h3 className="font-bold text-[#071426] text-base mb-1">{c.title}</h3>
                  <div className="text-xs text-slate-500">
                    {c.lessonsCount} Lessons &bull; {c.durationWeeks} Weeks
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Published
                  </span>
                  <Link
                    to={`/courses/${c.slug}`}
                    className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Submissions */}
        {activeTab === 'submissions' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-[#071426] text-base">Student Submissions Queue</h3>
              <p className="text-xs text-slate-500">Review student repositories and assign marks with feedback.</p>
            </div>
            <div className="divide-y divide-slate-100">
              {submissions.map((subm) => (
                <div key={subm.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-[#071426]">
                      {subm.studentName} ({subm.studentEmail})
                    </div>
                    <div className="text-xs text-slate-500">
                      Link:{' '}
                      <a
                        href={subm.submissionLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#00A9FF] underline font-mono font-semibold"
                      >
                        {subm.submissionLink}
                      </a>
                    </div>
                    {subm.notes && (
                      <p className="text-xs text-slate-600 italic">"{subm.notes}"</p>
                    )}
                    {subm.status === 'graded' && (
                      <div className="text-xs text-emerald-600 font-semibold pt-1">
                        Graded: {subm.marksObtained}/100 &bull; Feedback: {subm.feedback}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubmId(subm.id);
                      setGradingModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
                  >
                    {subm.status === 'graded' ? 'Update Grade' : 'Grade Submission'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Students */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-[#071426] text-base">Roster of Active Students</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Course</th>
                    <th className="p-4">Progress</th>
                    <th className="p-4">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {enrollments.map((enr) => (
                    <tr key={enr.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="font-bold text-[#071426]">{enr.studentName}</div>
                        <div className="text-xs text-slate-400">{enr.studentEmail}</div>
                      </td>
                      <td className="p-4">{enr.courseTitle}</td>
                      <td className="p-4">
                        <span className="font-bold text-[#00A9FF]">{enr.progressPercent}%</span>
                      </td>
                      <td className="p-4">
                        {enr.certificateIssued ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold text-xs">
                            Issued
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">In Progress</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Grade Submission Modal */}
      {gradingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-lg text-[#071426]">Evaluate Assignment</h3>
            <form onSubmit={handleGradeSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Marks Obtained (out of 100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructor Feedback</label>
                <textarea
                  rows={3}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                >
                  Save Grade &amp; Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
