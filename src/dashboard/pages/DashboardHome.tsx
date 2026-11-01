import React from 'react';
import {
  Film,
  Plus,
  Sparkles,
  Cpu,
  Layers,
  Users,
  HardDrive,
  Clock,
  Play,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  FileText,
} from 'lucide-react';
import { Project } from '../../shared/types/project';
import { FlowSessionState } from '../../shared/types/flow';
import { GenerationJob } from '../../shared/types/job';
import { NavItemKey } from '../layouts/Sidebar';

interface DashboardHomeProps {
  projects: Project[];
  activeProject?: Project;
  flowSession?: FlowSessionState;
  activeJobs: GenerationJob[];
  storageInfo: { totalBytes: number; count: number; formatted: string };
  onNavigate: (view: NavItemKey) => void;
  onNewMovie: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  projects,
  activeProject,
  flowSession,
  activeJobs,
  storageInfo,
  onNavigate,
  onNewMovie,
}) => {
  const isFlowReady = flowSession?.status === 'ready' || flowSession?.status === 'generating';

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/20 border border-blue-500/30 p-8 shadow-2xl shadow-blue-950/40">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            AI Cinematic Film Production Studio
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            One Script. One World.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              One Complete Movie.
            </span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Welcome to CineForge AI. Direct full cinematic films inside Google Chrome using your own Google Flow credits and consistent character bibles.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNewMovie}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Movie</span>
            </button>
            <button
              onClick={() => onNavigate('script_studio')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-medium transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Open Script Studio</span>
            </button>
            <button
              onClick={() => onNavigate('google_flow')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-medium transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Check Google Flow</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-[-10%] top-[-30%] w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-[20%] bottom-[-40%] w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Production Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-xl flex items-center justify-between border-slate-800">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400">Active Project</span>
            <div className="text-base font-bold text-white truncate max-w-[150px]">
              {activeProject ? activeProject.name : 'None Selected'}
            </div>
            <div className="text-[11px] text-cyan-400 font-mono">
              {activeProject ? `${activeProject.settings.aspectRatio} • ${activeProject.settings.resolution}` : 'Create to begin'}
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Film className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl flex items-center justify-between border-slate-800">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400">Storyboard Scenes</span>
            <div className="text-xl font-bold text-white">
              {activeProject?.stats?.totalScenes || 0}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" />
              <span>{activeProject?.stats?.completedScenes || 0} approved</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl flex items-center justify-between border-slate-800">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400">Google Flow Engine</span>
            <div className="text-base font-bold text-white flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isFlowReady ? 'bg-emerald-400 shadow-md shadow-emerald-400' : 'bg-amber-400'}`} />
              <span className="capitalize">{flowSession?.status ? flowSession.status.replace(/_/g, ' ') : 'Offline'}</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
              {flowSession?.verifiedCreditInfo?.rawText || 'Verified through user session'}
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl flex items-center justify-between border-slate-800">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400">Local DB Storage</span>
            <div className="text-xl font-bold text-white">
              {storageInfo.formatted}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {storageInfo.count} persistent assets
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Current Production & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Queue & Quick Access */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Generation Queue Card */}
          <div className="glass-card rounded-xl p-6 border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Production Queue Status</h3>
                  <p className="text-xs text-slate-400">Scene rendering and Flow pipeline</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('queue')}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeJobs.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-slate-800 rounded-xl space-y-2">
                <Clock className="w-7 h-7 text-slate-600 mx-auto" />
                <p className="text-xs font-medium text-slate-400">No active generation tasks in queue.</p>
                <p className="text-[11px] text-slate-500">Go to Scene Generator or Storyboard to queue shots.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeJobs.map((job) => (
                  <div key={job.id} className="p-3.5 rounded-lg bg-[#080C14] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{job.sceneTitle}</span>
                      <span className="font-mono text-cyan-400 font-bold">{job.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300"
                        style={{ width: `${job.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{job.statusMessage}</span>
                      <span className="capitalize text-slate-500">{job.provider.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filmmaking Pipeline Shortcuts */}
          <div className="glass-card rounded-xl p-6 border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Filmmaking Studio Modules</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { title: 'Script Studio', desc: 'Story breakdown & dialogue', view: 'script_studio', icon: FileText, color: 'text-blue-400' },
                { title: 'Character Studio', desc: 'Face bibles & wardrobe lock', view: 'character_studio', icon: Users, color: 'text-purple-400' },
                { title: 'Storyboard', desc: 'Scene cards & camera motion', view: 'storyboard', icon: Layers, color: 'text-cyan-400' },
                { title: 'Scene Generator', desc: 'Cinematic Flow prompts', view: 'scene_generator', icon: Sparkles, color: 'text-amber-400' },
                { title: 'Voice & Audio', desc: 'Speech synthesis & Foley SFX', view: 'voice_studio', icon: Play, color: 'text-emerald-400' },
                { title: 'Cinematic Editor', desc: 'Multi-track timeline & export', view: 'editor', icon: Film, color: 'text-pink-400' },
              ].map((mod) => {
                const Icon = mod.icon;
                return (
                  <button
                    key={mod.view}
                    onClick={() => onNavigate(mod.view as NavItemKey)}
                    className="p-3.5 rounded-xl bg-[#080C14] border border-slate-800/80 hover:border-slate-700 text-left space-y-1.5 transition-all cursor-pointer group"
                  >
                    <Icon className={`w-4 h-4 ${mod.color} group-hover:scale-110 transition-transform`} />
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-white">{mod.title}</div>
                    <div className="text-[10px] text-slate-500 leading-tight">{mod.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Recent Projects */}
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6 border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-cyan-400" />
                Recent Projects
              </h3>
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                All ({projects.length})
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-slate-800 rounded-xl space-y-2">
                <Film className="w-7 h-7 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No movie projects yet.</p>
                <button
                  onClick={onNewMovie}
                  className="text-xs font-semibold text-cyan-400 hover:underline"
                >
                  Create your first movie
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {projects.slice(0, 5).map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => onNavigate('projects')}
                    className="p-3 rounded-lg bg-[#080C14] border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-800/20 transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                      <span className="truncate max-w-[170px]">{proj.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50">
                        {proj.settings.aspectRatio}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{proj.settings.genre}</span>
                      <span>{proj.stats.totalScenes} scenes</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Flow Connection Card */}
          <div className="glass-card rounded-xl p-6 border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Google Flow Integration
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              CineForge AI automates scene generation through your own authorized Google account on Google Flow. No API fees, no cookies collected.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('google_flow')}
                className="w-full py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Manage Flow Connection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
