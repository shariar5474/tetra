import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Clapperboard, ExternalLink, Sparkles, CheckCircle2, AlertCircle, Film, RefreshCw, Cpu } from 'lucide-react';
import { getAllProjects } from '../database/project-store';
import { getAllActiveJobs } from '../database/job-store';
import { inspectFlowSession } from '../flow/flow-detector';
import { Project } from '../shared/types/project';
import { GenerationJob } from '../shared/types/job';
import { FlowSessionState } from '../shared/types/flow';

export const PopupApp: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeJobs, setActiveJobs] = useState<GenerationJob[]>([]);
  const [flowSession, setFlowSession] = useState<FlowSessionState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const projs = await getAllProjects();
      setProjects(projs);
      const jobs = await getAllActiveJobs();
      setActiveJobs(jobs);
      const session = await inspectFlowSession();
      setFlowSession(session);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openStudio = () => {
    chrome.runtime.sendMessage({ type: 'OPEN_DASHBOARD' });
    window.close();
  };

  const currentProject = projects[0];
  const activeJob = activeJobs[0];

  return (
    <div className="w-[360px] bg-[#05070D] text-slate-100 p-4 border border-slate-800 flex flex-col gap-4 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Clapperboard className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              CineForge <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400">One Script. One World. One Movie.</p>
          </div>
        </div>
        <button
          onClick={loadData}
          title="Refresh"
          className="p-1.5 rounded-md hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main CTA: Open Studio */}
      <button
        onClick={openStudio}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-cyan-500/40 transition-all duration-200 cursor-pointer active:scale-[0.98]"
      >
        <ExternalLink className="w-4 h-4" />
        Open Full Studio Dashboard
      </button>

      {/* Quick Connection Status */}
      <div className="bg-[#0B0F19] border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Google Flow Engine
          </span>
          {flowSession?.status === 'ready' || flowSession?.status === 'generating' ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          ) : flowSession?.status === 'tab_detected' ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <AlertCircle className="w-3 h-3" /> Tab Found
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full">
              Standby
            </span>
          )}
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          {flowSession?.verifiedCreditInfo?.rawText || 'Credits managed via your authorized Google account.'}
        </p>
      </div>

      {/* Current Project */}
      <div className="bg-[#0B0F19] border border-slate-800/80 rounded-xl p-3 flex flex-col gap-1.5">
        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-blue-400" />
          Active Movie Project
        </span>
        {currentProject ? (
          <div>
            <div className="text-xs font-semibold text-slate-200 truncate">{currentProject.name}</div>
            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{currentProject.settings.aspectRatio}</span>
              <span>•</span>
              <span>{currentProject.settings.resolution}</span>
              <span>•</span>
              <span>{currentProject.stats.totalScenes} scenes</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic">No movie project created yet.</div>
        )}
      </div>

      {/* Active Generation Job */}
      {activeJob && (
        <div className="bg-[#0B0F19] border border-blue-500/30 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              Generating Scene
            </span>
            <span className="text-[10px] font-bold text-cyan-400">{activeJob.progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${activeJob.progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 truncate">{activeJob.statusMessage}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-1 border-t border-slate-800/60">
        <span className="text-[10px] text-slate-500">CineForge AI v1.0 • Manifest V3</span>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('popup-root')!);
root.render(<PopupApp />);
