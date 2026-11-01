import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PlayCircle,
  CheckCircle2,
  FileText,
  Download,
  Send,
  HelpCircle,
  Award,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

export const StudentLearnPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, enrollments, markLessonComplete, submitAssignment } = useData();
  const { user } = useAuth();

  const course = courses.find((c) => c.id === courseId || c.slug === courseId) || courses[0];
  const enrollment = enrollments.find(
    (e) => e.courseId === course.id && (e.studentId === user?.id || e.studentEmail === user?.email)
  );

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const [activeLesson, setActiveLesson] = useState(allLessons[0] || {
    id: 'l1-1',
    title: 'Welcome to TETRA AI Automation Mastery',
    duration: '12:40',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  });

  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'assignment' | 'quiz'>('notes');
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  // Interactive Quiz state
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const isLessonCompleted = Boolean(
    enrollment?.completedLessons.includes(activeLesson.id)
  );

  const handleToggleComplete = () => {
    markLessonComplete(course.id, activeLesson.id);
    if (!isLessonCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionLink || !user) return;
    submitAssignment(
      'asg-' + course.id,
      submissionLink,
      submissionNotes,
      user.id,
      user.name,
      user.email
    );
    setAssignmentSubmitted(true);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="bg-[#0B1528] min-h-screen text-slate-200">
      {/* Top Navbar */}
      <div className="bg-[#071426] border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/student/dashboard"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="text-[11px] text-[#00A9FF] font-semibold uppercase tracking-wider">
              Classroom &bull; {course.title}
            </div>
            <div className="text-sm font-bold text-white truncate max-w-md sm:max-w-xl">
              {activeLesson.title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <span>Overall Progress:</span>
            <span className="font-bold text-[#00A9FF]">{enrollment?.progressPercent || 0}%</span>
          </div>

          <button
            type="button"
            onClick={handleToggleComplete}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isLessonCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-[#00A9FF] hover:bg-[#0096e6] text-white shadow'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isLessonCompleted ? 'Lesson Completed' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>

      {/* Classroom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-65px)]">
        {/* Left: Video Player & Tab Modules (8 cols) */}
        <div className="lg:col-span-8 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6">
          {/* HD Video Player */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl">
            <iframe
              src={activeLesson.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
              title={activeLesson.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Lesson Tabs */}
          <div className="bg-[#071426] rounded-3xl p-6 border border-white/10 flex-1 space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs sm:text-sm">
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-[#00A9FF] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Lesson Notes &amp; Overview
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                  activeTab === 'resources'
                    ? 'bg-[#00A9FF] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Resources &amp; Files
              </button>
              <button
                onClick={() => setActiveTab('assignment')}
                className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                  activeTab === 'assignment'
                    ? 'bg-[#00A9FF] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Submit Project
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-[#00A9FF] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Knowledge Quiz
              </button>
            </div>

            {/* Tab: Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed animate-fadeIn">
                <h3 className="text-base font-bold text-white">{activeLesson.title}</h3>
                <p>
                  In this session, we analyze the real-world architecture required to build robust solutions. Make sure to download the exercise project files and execute each workflow step alongside the video demonstration.
                </p>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="font-bold text-[#00A9FF]">Key Takeaways:</div>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>Understand client delivery requirements and project scope documentation.</li>
                    <li>Configure environments without manual dependencies.</li>
                    <li>Test edge cases and deploy production-ready endpoints.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Resources */}
            {activeTab === 'resources' && (
              <div className="space-y-3 animate-fadeIn text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#00A9FF]" />
                    <div>
                      <div className="font-bold text-white">Lesson-Exercise-Files.zip</div>
                      <div className="text-xs text-gray-400">14.2 MB &bull; Source Templates &amp; Prompts</div>
                    </div>
                  </div>
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Download simulation started: Lesson-Exercise-Files.zip');
                    }}
                    className="p-2.5 rounded-xl bg-[#00A9FF] text-white hover:bg-[#0096e6] transition"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Tab: Assignment Submission */}
            {activeTab === 'assignment' && (
              <div className="space-y-4 animate-fadeIn text-xs sm:text-sm">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Capstone Project Submission
                  </h3>
                  <p className="text-gray-400 text-xs">
                    Submit your GitHub repo, Figma prototype, or Google Drive link for trainer evaluation.
                  </p>
                </div>

                {!assignmentSubmitted ? (
                  <form onSubmit={handleAssignmentSubmit} className="space-y-3">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Project Link (GitHub / Figma / Live URL)</label>
                      <input
                        type="url"
                        required
                        placeholder="https://github.com/your-username/tetra-capstone"
                        value={submissionLink}
                        onChange={(e) => setSubmissionLink(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#00A9FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Notes / Instructions for Mentor</label>
                      <textarea
                        rows={3}
                        placeholder="Describe key challenges overcome and specific features implemented..."
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0B1528] border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#00A9FF]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#00A9FF] hover:bg-[#0096e6] text-white font-bold transition flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit for Evaluation</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold">Project Submitted Successfully!</div>
                      <div className="text-xs text-emerald-400/80">
                        Your assigned instructor has received your submission and will post marks and feedback on your dashboard.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Quiz */}
            {activeTab === 'quiz' && (
              <div className="space-y-4 animate-fadeIn text-xs sm:text-sm">
                <h3 className="text-base font-bold text-white">Module 1 Checkpoint Quiz</h3>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="font-semibold text-white">
                    Question 1: Which of the following is the primary advantage of deploying asynchronous webhook triggers in automation pipelines?
                  </div>

                  <div className="space-y-2">
                    {[
                      'Eliminating need for continuous polling while reacting immediately to events',
                      'Increasing memory consumption and server overhead',
                      'Preventing API authentication security checks',
                    ].map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setQuizAnswer(i)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer flex items-center gap-2.5 ${
                          quizAnswer === i
                            ? 'bg-[#00A9FF]/20 border-[#00A9FF] text-white'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px]">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={quizAnswer === null}
                      onClick={() => setQuizSubmitted(true)}
                      className="px-5 py-2 rounded-xl bg-[#00A9FF] text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
                    >
                      Submit Answer
                    </button>
                  </div>

                  {quizSubmitted && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                      {quizAnswer === 0 ? '✓ Correct! Webhook triggers eliminate polling and run instantly upon event dispatch.' : 'Incorrect. Option A is the optimal answer.'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Curriculum Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-[#071426] border-l border-white/10 p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-65px)]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-white text-sm">Course Syllabus</h3>
            <span className="text-xs text-gray-400">{allLessons.length} lessons</span>
          </div>

          <div className="space-y-3">
            {course.modules.map((mod, modIdx) => (
              <div key={mod.id} className="border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-3.5 bg-white/5 font-semibold text-xs text-gray-200">
                  {mod.title}
                </div>
                <div className="divide-y divide-white/5 bg-[#091830]">
                  {mod.lessons.map((lesson) => {
                    const isCompleted = enrollment?.completedLessons.includes(lesson.id);
                    const isActive = activeLesson.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full text-left p-3 flex items-center justify-between transition cursor-pointer ${
                          isActive
                            ? 'bg-[#00A9FF]/15 text-[#00A9FF] font-bold'
                            : 'hover:bg-white/5 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-gray-500 shrink-0" />
                          )}
                          <span className="text-xs truncate">{lesson.title}</span>
                        </div>
                        <span className="text-[11px] text-gray-400 shrink-0 ml-2">
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Certificate Claim when 100% */}
          {enrollment?.progressPercent === 100 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-center space-y-2">
              <Award className="w-8 h-8 text-amber-400 mx-auto" />
              <div className="font-bold text-white text-xs">Course 100% Completed!</div>
              <p className="text-[11px] text-gray-300">
                You are eligible to claim your official digital certificate.
              </p>
              <Link
                to="/verify-certificate?id=TETRA-2026-AI-8839"
                className="inline-block px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-bold text-xs"
              >
                View Certificate
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
