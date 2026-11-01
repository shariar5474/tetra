import React from 'react';
import {
  ListOrdered,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { GenerationJob, JobStatus } from '../../shared/types/job';
import { Project } from '../../shared/types/project';

interface ProductionQueueViewProps {
  project?: Project;
  jobs: GenerationJob[];
  onRetryJob: (jobId: string) => Promise<void>;
  onCancelJob: (jobId: string) => Promise<void>;
  onClearCompleted: () => Promise<void>;
  onOpenManualHandoff: (job: GenerationJob) => void;
}

export const ProductionQueueView: React.FC<ProductionQueueViewProps> = ({
  project,
  jobs,
  onRetryJob,
  onCancelJob,
  onClearCompleted,
  onOpenManualHandoff,
}) => {
  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'generating':
      case 'processing':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30 animate-pulse">
            <Sparkles className="w-3 h-3 animate-spin" /> In Production
          </span>
        );
      case 'preparing':
      case 'ready':
      case 'waiting':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/30">
            <Clock className="w-3 h-3" /> Queued
          </span>
        );
      case 'needs_manual_action':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
            <AlertCircle className="w-3 h-3" /> Needs Flow Action
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/30">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <ListOrdered className="w-4 h-4" />
            Background Production & Concurrency
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Production Queue</h1>
          <p className="text-xs text-slate-400">
            Track real-time generation jobs, manage retry policies, and resolve manual Google Flow interventions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onClearCompleted}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Clear Completed
          </button>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl space-y-3">
          <ListOrdered className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-300">Queue is currently empty.</div>
          <p className="text-xs text-slate-500">
            Select scenes in Scene Generator or Storyboard to queue shots for Flow rendering.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="glass-card rounded-xl border-slate-800 p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{job.sceneTitle}</h3>
                    {getStatusBadge(job.status)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Job ID: {job.id} • Provider: {job.provider.replace(/_/g, ' ')} • Model: {job.model}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {job.status === 'needs_manual_action' && (
                    <button
                      onClick={() => onOpenManualHandoff(job)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Resolve in Flow</span>
                    </button>
                  )}
                  {job.status === 'failed' && (
                    <button
                      onClick={() => onRetryJob(job.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Retry</span>
                    </button>
                  )}
                  {(job.status === 'waiting' || job.status === 'generating') && (
                    <button
                      onClick={() => onCancelJob(job.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{job.statusMessage}</span>
                  <span className="font-mono text-cyan-400 font-bold">{job.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${job.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Error display if present */}
              {job.error && (
                <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-lg text-xs text-red-300 space-y-1">
                  <div className="font-semibold text-red-400">{job.error.message}</div>
                  <div className="text-[11px] text-slate-400">{job.error.fixSuggestion}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
