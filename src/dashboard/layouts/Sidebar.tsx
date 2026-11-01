import React from 'react';
import {
  LayoutDashboard,
  Film,
  FolderKanban,
  FileText,
  Users,
  Compass,
  Layers,
  Sparkles,
  ListOrdered,
  Mic,
  Music,
  Scissors,
  Image as ImageIcon,
  Cpu,
  Boxes,
  Settings,
  HelpCircle,
  Clapperboard,
} from 'lucide-react';

export type NavItemKey =
  | 'dashboard'
  | 'new_movie'
  | 'projects'
  | 'script_studio'
  | 'character_studio'
  | 'environment_studio'
  | 'storyboard'
  | 'scene_generator'
  | 'queue'
  | 'voice_studio'
  | 'audio_studio'
  | 'editor'
  | 'assets'
  | 'google_flow'
  | 'ai_models'
  | 'settings'
  | 'help';

interface SidebarProps {
  activeView: NavItemKey;
  onSelectView: (view: NavItemKey) => void;
  queueCount?: number;
  flowConnected?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  queueCount = 0,
  flowConnected = false,
}) => {
  const menuItems: { key: NavItemKey; label: string; icon: React.FC<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'new_movie', label: 'New Movie', icon: Film },
    { key: 'projects', label: 'My Projects', icon: FolderKanban },
    { key: 'script_studio', label: 'Script Studio', icon: FileText },
    { key: 'character_studio', label: 'Character Studio', icon: Users },
    { key: 'environment_studio', label: 'Environment Studio', icon: Compass },
    { key: 'storyboard', label: 'Storyboard', icon: Layers },
    { key: 'scene_generator', label: 'Scene Generator', icon: Sparkles },
    { key: 'queue', label: 'Production Queue', icon: ListOrdered, badge: queueCount > 0 ? queueCount : undefined, badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' },
    { key: 'voice_studio', label: 'Voice Studio', icon: Mic },
    { key: 'audio_studio', label: 'Audio Studio', icon: Music },
    { key: 'editor', label: 'Cinematic Editor', icon: Scissors },
    { key: 'assets', label: 'Asset Library', icon: ImageIcon },
    { key: 'google_flow', label: 'Google Flow', icon: Cpu, badge: flowConnected ? 'ONLINE' : 'OFFLINE', badgeColor: flowConnected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700' },
    { key: 'ai_models', label: 'AI Models', icon: Boxes },
    { key: 'settings', label: 'Settings', icon: Settings },
    { key: 'help', label: 'Help & Docs', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col h-screen select-none shrink-0 z-20">
      {/* Studio Brand */}
      <div className="h-16 flex items-center px-5 gap-3 border-b border-slate-800/80 bg-[#080C14]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Clapperboard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
            CINEFORGE <span className="text-cyan-400 text-xs px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 font-mono">AI</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-wider">CHROME MOVIE STUDIO</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectView(item.key)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-cyan-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User / Storage Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#080C14]">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            Local IndexedDB
          </span>
          <span className="font-mono text-slate-500 text-[10px]">MV3 Ready</span>
        </div>
      </div>
    </aside>
  );
};
