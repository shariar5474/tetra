import React from 'react';
import {
  Film,
  Search,
  Cpu,
  Sparkles,
  Settings,
  Bell,
  ChevronDown,
  Plus,
  Download,
} from 'lucide-react';
import { Project } from '../../shared/types/project';
import { FlowSessionState } from '../../shared/types/flow';

interface TopNavProps {
  projects: Project[];
  activeProject?: Project;
  onSelectProject: (id: string) => void;
  onNewMovie: () => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
  flowSession?: FlowSessionState;
  activeJobCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onNewMovie,
  onOpenExport,
  onOpenSettings,
  flowSession,
  activeJobCount,
}) => {
  return (
    <header className="h-16 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between z-10 shrink-0">
      {/* Left: Project Selector */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <Film className="w-4 h-4 text-cyan-400 absolute left-3 pointer-events-none" />
          <select
            value={activeProject?.id || ''}
            onChange={(e) => onSelectProject(e.target.value)}
            className="pl-9 pr-8 py-1.5 bg-[#05070D] border border-slate-700/80 rounded-lg text-xs font-semibold text-slate-200 hover:border-slate-600 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer appearance-none max-w-[240px] truncate"
          >
            {projects.length === 0 ? (
              <option value="">No Projects (Click + New)</option>
            ) : (
              projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))
            )}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
        </div>

        <button
          onClick={onNewMovie}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Movie</span>
        </button>
      </div>

      {/* Center: Search / Stats */}
      <div className="hidden md:flex items-center gap-2 max-w-sm w-full mx-6">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search characters, scenes, prompts, audio..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#05070D] border border-slate-800 rounded-lg text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-colors"
          />
        </div>
      </div>

      {/* Right: Flow Pill, Queue, Export, Settings */}
      <div className="flex items-center gap-3">
        {/* Google Flow Status Badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
            flowSession?.status === 'ready' || flowSession?.status === 'generating'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : flowSession?.status === 'tab_detected'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/60'
          }`}
          title={flowSession?.verifiedCreditInfo?.rawText || 'Google Flow Session'}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Flow:</span>
          <span className="capitalize">{flowSession?.status ? flowSession.status.replace(/_/g, ' ') : 'Standby'}</span>
        </div>

        {/* Active Queue Status */}
        {activeJobCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-medium animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeJobCount} active</span>
          </div>
        )}

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Movie</span>
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
