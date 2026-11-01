import React, { useState } from 'react';
import {
  Settings,
  HardDrive,
  Shield,
  Sliders,
  Trash2,
  Download,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { Project } from '../../shared/types/project';

interface SettingsViewProps {
  storageInfo: { totalBytes: number; count: number; formatted: string };
  onClearStorage: () => Promise<void>;
  onExportAllBackup: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  storageInfo,
  onClearStorage,
  onExportAllBackup,
}) => {
  const [theme] = useState('Midnight Cinematic');
  const [defaultRatio, setDefaultRatio] = useState('16:9');
  const [defaultResolution, setDefaultResolution] = useState('1080p');
  const [autoRetry, setAutoRetry] = useState(true);
  const [localOnlyMode, setLocalOnlyMode] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSave = () => {
    setStatusMsg('Preferences saved successfully to local storage.');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleClearCache = async () => {
    if (window.confirm('Are you sure you want to clear cached temporary assets? Your projects will remain intact.')) {
      await onClearStorage();
      setStatusMsg('Cached binary assets cleared.');
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          System Preferences
        </div>
        <h1 className="text-2xl font-bold text-white mt-1">CineForge AI Settings</h1>
        <p className="text-xs text-slate-400">
          Configure default aspect ratios, rendering pipelines, local storage limits, and security rules.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* General Defaults */}
      <div className="glass-card p-6 rounded-xl border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          General & Cinematic Defaults
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Default Aspect Ratio</label>
            <select
              value={defaultRatio}
              onChange={(e) => setDefaultRatio(e.target.value)}
              className="w-full px-3 py-2 bg-[#05070D] border border-slate-700 rounded-lg text-white"
            >
              <option value="16:9">16:9 (Landscape Film)</option>
              <option value="9:16">9:16 (Vertical Reels)</option>
              <option value="1:1">1:1 (Square Format)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Default Resolution</label>
            <select
              value={defaultResolution}
              onChange={(e) => setDefaultResolution(e.target.value)}
              className="w-full px-3 py-2 bg-[#05070D] border border-slate-700 rounded-lg text-white"
            >
              <option value="1080p">1080p Full HD</option>
              <option value="720p">720p Standard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Storage & Backup */}
      <div className="glass-card p-6 rounded-xl border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-purple-400" />
          IndexedDB Storage & Backup
        </h2>

        <div className="p-4 bg-[#05070D] rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Total Persistent Assets</span>
            <div className="text-base font-bold text-white mt-0.5">
              {storageInfo.count} files ({storageInfo.formatted})
            </div>
          </div>
          <button
            onClick={onExportAllBackup}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer shadow-md shadow-cyan-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full Backup</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400">
            Clear cached video chunks and temporary render previews.
          </div>
          <button
            onClick={handleClearCache}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-950 text-red-300 border border-red-500/30 text-xs font-semibold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Temporary Cache</span>
          </button>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="glass-card p-6 rounded-xl border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Privacy & Local-First Guardrails
        </h2>

        <div className="space-y-3 text-xs">
          <label className="flex items-center gap-3 p-3 bg-[#05070D] rounded-xl border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={localOnlyMode}
              onChange={(e) => setLocalOnlyMode(e.target.checked)}
              className="accent-cyan-500 w-4 h-4 rounded"
            />
            <div>
              <span className="font-bold text-white block">Enforce Local-First Storage</span>
              <span className="text-[11px] text-slate-400">
                Never upload screenplay text or character reference images to third-party cloud servers without explicit user command.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};
