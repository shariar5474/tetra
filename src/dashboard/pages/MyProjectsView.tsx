import React, { useState } from 'react';
import {
  FolderKanban,
  Film,
  Plus,
  Copy,
  Trash2,
  Download,
  Upload,
  ExternalLink,
  Archive,
  Edit2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Project } from '../../shared/types/project';
import { getProjectById, saveProject } from '../../database/project-store';

interface MyProjectsViewProps {
  projects: Project[];
  activeProjectId?: string;
  onSelectProject: (id: string) => void;
  onNewMovie: () => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (project: Project) => void;
  onExportBackup: (project: Project) => void;
  onImportBackup: (file: File) => void;
}

export const MyProjectsView: React.FC<MyProjectsViewProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onNewMovie,
  onDeleteProject,
  onDuplicateProject,
  onExportBackup,
  onImportBackup,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.settings.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <FolderKanban className="w-4 h-4" />
            Project Archive & Manager
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">My Movie Projects</h1>
          <p className="text-xs text-slate-400">
            Create, manage, duplicate, backup, and switch between your cinematic movie projects.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json,.zip"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <button
            onClick={onNewMovie}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Movie</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search movie title, genre, logline..."
            className="w-full px-3.5 py-1.5 bg-[#05070D] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {['all', 'draft', 'storyboarding', 'production', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                filterStatus === status
                  ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-semibold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl space-y-3">
          <Film className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-300">No movies match your criteria.</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Get started by creating a new project or importing an existing movie production backup.
          </p>
          <button
            onClick={onNewMovie}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Movie
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((proj) => {
            const isActive = proj.id === activeProjectId;
            return (
              <div
                key={proj.id}
                className={`glass-card rounded-xl p-5 border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                  isActive
                    ? 'border-cyan-500/60 shadow-lg shadow-cyan-500/10 bg-[#0B0F19]'
                    : 'border-slate-800 hover:border-slate-700 bg-[#080C14]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-white hover:text-cyan-300 transition-colors line-clamp-1">
                          {proj.name}
                        </h2>
                        {isActive && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 uppercase">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                        <span>{proj.settings.aspectRatio}</span>
                        <span>•</span>
                        <span>{proj.settings.resolution}</span>
                        <span>•</span>
                        <span>{proj.settings.fps} FPS</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {proj.description || 'No detailed logline specified.'}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      {proj.stats.totalScenes} scenes
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(proj.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectProject(proj.id)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isActive ? 'Current Studio' : 'Open Project'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicateProject(proj)}
                      title="Duplicate Project"
                      className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onExportBackup(proj)}
                      title="Export Backup (JSON/ZIP)"
                      className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      title="Delete Project"
                      className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
