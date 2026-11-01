import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  Cpu,
  Layers,
  Users,
  Film,
  Download,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const HelpDocsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'quickstart' | 'flow' | 'consistency' | 'troubleshoot'>('quickstart');

  return (
    <div className="p-8 max-w-5xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          Documentation & Filmmaking Guide
        </div>
        <h1 className="text-2xl font-bold text-white mt-1">CineForge AI Manual</h1>
        <p className="text-xs text-slate-400">
          Everything you need to know about directing full movies, locking character bibles, and integrating Google Flow.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        {[
          { key: 'quickstart', label: '1. Quickstart Filmmaking Guide', icon: BookOpen },
          { key: 'flow', label: '2. Google Flow Integration', icon: Cpu },
          { key: 'consistency', label: '3. Character & Environment Locks', icon: Users },
          { key: 'troubleshoot', label: '4. Troubleshooting & FAQ', icon: AlertCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section 1: Quickstart */}
      {activeSection === 'quickstart' && (
        <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-5 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-sm font-bold text-white">Full Filmmaking Lifecycle in 5 Steps</h2>

          <div className="space-y-4">
            <div className="p-4 bg-[#05070D] rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-cyan-400 block">Step 1: Create a Project & Input Script</span>
              <p className="text-slate-400">
                Open <strong>New Movie</strong>, configure your genre, aspect ratio (e.g. 16:9 for cinema or 9:16 for vertical reels), and language. Navigate to <strong>Script Studio</strong> to paste your story or click "Load Chatgaiya Sample Script".
              </p>
            </div>

            <div className="p-4 bg-[#05070D] rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-cyan-400 block">Step 2: Script Intelligence & Storyboard Extraction</span>
              <p className="text-slate-400">
                Click <strong>Analyze Script</strong>. CineForge analyzes the entire 3-act story arc, extracts character identities, locations, and divides the script into structured scenes. Click <strong>Commit to Storyboard</strong> to populate scene cards.
              </p>
            </div>

            <div className="p-4 bg-[#05070D] rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-cyan-400 block">Step 3: Character & Environment Consistency Locks</span>
              <p className="text-slate-400">
                In <strong>Character Studio</strong>, upload real face reference photos for each character. Click <strong>LOCK CHARACTER</strong> to freeze facial bone structure, skin tone, and signature costume across every scene.
              </p>
            </div>

            <div className="p-4 bg-[#05070D] rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-cyan-400 block">Step 4: Connect Google Flow & Produce Scenes</span>
              <p className="text-slate-400">
                In <strong>Google Flow</strong>, click "Open Google Flow in Tab" and log into your Google Account. In <strong>Scene Generator</strong>, choose your scene and click <strong>Generate via Google Flow</strong> or use Manual Handoff Mode.
              </p>
            </div>

            <div className="p-4 bg-[#05070D] rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-cyan-400 block">Step 5: Timeline Editing, Voice Tracks & Final Export</span>
              <p className="text-slate-400">
                In <strong>Cinematic Editor</strong>, arrange approved video clips on the multi-track timeline, add speech or background music, customize burned-in subtitles, and render a final high-definition MP4.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Google Flow */}
      {activeSection === 'flow' && (
        <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-sm font-bold text-white">How Google Flow Integration Works</h2>
          <p className="text-slate-400">
            CineForge AI uses your own browser session and eligible Google Flow / Veo account credits. No separate extension or desktop app is needed.
          </p>

          <div className="p-4 bg-[#05070D] rounded-xl border border-blue-500/30 space-y-2">
            <span className="font-bold text-cyan-400 block">Automated vs Manual Handoff Mode</span>
            <p className="text-slate-400">
              When automated insertion is supported, CineForge injects the prompt and reference images into your active Flow tab and watches for completion. If Google prompts you for CAPTCHA or changes a UI element, <strong>Manual Handoff Mode</strong> presents you with a 1-click Copy button and an Import button to attach your video seamlessly.
            </p>
          </div>
        </div>
      )}

      {/* Section 3: Consistency */}
      {activeSection === 'consistency' && (
        <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-sm font-bold text-white">Character & Environment Locking Explained</h2>
          <p className="text-slate-400">
            The biggest challenge in AI filmmaking is character drift between cuts. CineForge solves this through descriptive attribute fingerprints and reference image anchors:
          </p>

          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li><strong>Face Anchor:</strong> Primary face reference is appended as the identity token in every prompt.</li>
            <li><strong>Costume Versioning:</strong> Wardrobe changes must be explicitly versioned so characters do not unexpectedly change clothing mid-scene.</li>
            <li><strong>Environment Anchors:</strong> Locked locations reuse architectural materials and key props across all shots.</li>
          </ul>
        </div>
      )}

      {/* Section 4: Troubleshooting */}
      {activeSection === 'troubleshoot' && (
        <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-sm font-bold text-white">Troubleshooting & FAQ</h2>

          <div className="space-y-3">
            <div className="p-3.5 bg-[#05070D] rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-white">Why does Flow Status say "Tab Not Found"?</span>
              <p className="text-slate-400">
                Click "Open Google Flow in Tab" from the Google Flow studio page or top bar to launch the tab.
              </p>
            </div>

            <div className="p-3.5 bg-[#05070D] rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-white">How do I load this extension into Chrome?</span>
              <p className="text-slate-400">
                1. Open <code className="text-cyan-400 font-mono">chrome://extensions</code> in Chrome.<br />
                2. Toggle on <strong>Developer mode</strong> (top right).<br />
                3. Click <strong>Load unpacked</strong> and select the project's <code className="text-cyan-400 font-mono">dist</code> folder.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
