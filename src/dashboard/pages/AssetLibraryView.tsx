import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Film,
  Music,
  Trash2,
  Download,
  Upload,
  HardDrive,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { Project } from '../../shared/types/project';
import { Character } from '../../shared/types/character';
import { Environment } from '../../shared/types/environment';
import { StoryboardScene } from '../../shared/types/storyboard';

interface AssetLibraryViewProps {
  project?: Project;
  characters: Character[];
  environments: Environment[];
  scenes: StoryboardScene[];
  storageInfo: { totalBytes: number; count: number; formatted: string };
  onRefreshStorage: () => void;
}

export const AssetLibraryView: React.FC<AssetLibraryViewProps> = ({
  project,
  characters,
  environments,
  scenes,
  storageInfo,
  onRefreshStorage,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'characters' | 'environments' | 'videos'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Collect all character images
  const charAssets = characters.flatMap((c) =>
    c.references.map((r) => ({
      id: r.id,
      title: `${c.name} (${r.viewType})`,
      type: 'character',
      url: r.imageUrl,
      createdAt: r.uploadedAt,
    }))
  );

  // Collect all environment images
  const envAssets = environments.flatMap((e) =>
    e.references.map((r) => ({
      id: r.id,
      title: `${e.name} (${r.viewType})`,
      type: 'environment',
      url: r.imageUrl,
      createdAt: r.uploadedAt,
    }))
  );

  // Collect all generated scene videos
  const videoAssets = scenes
    .filter((s) => s.videoUrl)
    .map((s) => ({
      id: `vid-${s.id}`,
      title: `Scene ${s.sceneNumber}: ${s.title}`,
      type: 'video',
      url: s.videoUrl!,
      createdAt: s.updatedAt,
    }));

  const allAssets = [...charAssets, ...envAssets, ...videoAssets];

  const filtered = allAssets.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || a.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <ImageIcon className="w-4 h-4" />
            Binary Asset Vault
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Asset Library</h1>
          <p className="text-xs text-slate-400">
            Browse, manage, and download persistent binary assets, face anchors, environment maps, and generated video masters.
          </p>
        </div>

        {/* Storage Pill */}
        <div className="flex items-center gap-3 p-3 bg-[#0B0F19] rounded-xl border border-slate-800 text-xs">
          <HardDrive className="w-4 h-4 text-purple-400" />
          <div>
            <span className="text-slate-400">IndexedDB Storage: </span>
            <strong className="text-white font-mono">{storageInfo.formatted}</strong>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets by name or tag..."
            className="w-full px-3.5 py-1.5 bg-[#05070D] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { key: 'all', label: `All (${allAssets.length})` },
            { key: 'character', label: `Characters (${charAssets.length})` },
            { key: 'environment', label: `Locations (${envAssets.length})` },
            { key: 'video', label: `Videos (${videoAssets.length})` },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key as any)}
              className={`px-3 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                filterType === f.key
                  ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-semibold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl space-y-3">
          <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-300">No assets in this category.</div>
          <p className="text-xs text-slate-500">
            Upload character photos, location references, or generate scene clips to populate your vault.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((asset) => (
            <div key={asset.id} className="glass-card rounded-xl border-slate-800 overflow-hidden flex flex-col justify-between group">
              <div className="aspect-square bg-black relative overflow-hidden flex items-center justify-center">
                {asset.type === 'video' ? (
                  <video src={asset.url} className="w-full h-full object-cover" />
                ) : (
                  <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                )}
                <div className="absolute top-2 left-2">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-slate-300 uppercase">
                    {asset.type}
                  </span>
                </div>
              </div>
              <div className="p-3 space-y-1">
                <h4 className="text-xs font-semibold text-white truncate" title={asset.title}>
                  {asset.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                  <a
                    href={asset.url}
                    download={asset.title}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400"
                    title="Download asset"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
