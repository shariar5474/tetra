import React, { useState, useEffect } from 'react';
import {
  Cpu,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Play,
  Pause,
  Copy,
  Info,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { FlowSessionState } from '../../shared/types/flow';
import {
  openOfficialFlowTab,
  inspectFlowSession,
  getAllOpenTabs,
  DetectedTabInfo,
  OFFICIAL_FLOW_URLS,
} from '../../flow/flow-detector';

interface GoogleFlowViewProps {
  flowSession?: FlowSessionState;
  onRefreshStatus: (targetTabId?: number) => Promise<void>;
}

export const GoogleFlowView: React.FC<GoogleFlowViewProps> = ({
  flowSession,
  onRefreshStatus,
}) => {
  const [checking, setChecking] = useState(false);
  const [openTabs, setOpenTabs] = useState<DetectedTabInfo[]>([]);
  const [customUrl, setCustomUrl] = useState('');
  const [selectedTabId, setSelectedTabId] = useState<number | undefined>(flowSession?.tabId);

  useEffect(() => {
    refreshTabList();
  }, []);

  const refreshTabList = async () => {
    const tabs = await getAllOpenTabs();
    setOpenTabs(tabs);
  };

  const handleOpenAndConnect = async (url = OFFICIAL_FLOW_URLS[0]) => {
    setChecking(true);
    try {
      const tab = await openOfficialFlowTab(url);
      await new Promise((r) => setTimeout(r, 1200));
      await onRefreshStatus(tab.id);
      await refreshTabList();
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  const handleCheckConnection = async (targetId?: number) => {
    setChecking(true);
    try {
      await onRefreshStatus(targetId || selectedTabId);
      await refreshTabList();
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  const handleSelectTab = async (tabId: number) => {
    setSelectedTabId(tabId);
    await handleCheckConnection(tabId);
  };

  const isConnected =
    flowSession?.status === 'ready' ||
    flowSession?.status === 'generating' ||
    flowSession?.status === 'tab_detected';

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            Primary Video Engine Integration
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Google Flow Studio Controller</h1>
          <p className="text-xs text-slate-400">
            Connect your active Google Flow or AI Studio tab to render cinematic scenes using your Google account credits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleCheckConnection()}
            disabled={checking}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>Check Connection</span>
          </button>
          <button
            onClick={() => handleOpenAndConnect(OFFICIAL_FLOW_URLS[0])}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Google Flow in Tab</span>
          </button>
        </div>
      </div>

      {/* Main Connection Status Card */}
      <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                isConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}
            >
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Google Flow Browser Status</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isConnected
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {isConnected ? 'CONNECTED / READY' : 'TAB NOT FOUND'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isConnected
                  ? `Synced with tab: ${flowSession?.tabUrl || 'Active Google Session'}`
                  : 'Google Flow or AI Studio tab was not detected. Select a tab below or launch a new tab.'}
              </p>
            </div>
          </div>
        </div>

        {/* Diagnostic Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#05070D] border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Chrome Tab Status</span>
            <div className="font-semibold text-slate-200">
              {flowSession?.tabId ? `Tab Active (#${flowSession.tabId})` : 'Waiting for Tab'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#05070D] border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Google Account Login</span>
            <div className="font-semibold text-slate-200">
              {flowSession?.isLoggedIn ? 'Authenticated' : 'Sign-In Required'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#05070D] border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Verified Credits</span>
            <div className="font-semibold text-slate-200 truncate">
              {flowSession?.verifiedCreditInfo?.rawText || 'Verify in Google Flow'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#05070D] border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Active Engine / Model</span>
            <div className="font-semibold text-cyan-400 truncate">
              {flowSession?.detectedModel || 'Google Veo / Flow Studio'}
            </div>
          </div>
        </div>

        {/* Direct Tab Selector: Shows all open tabs so user can pick ANY tab with 1 click */}
        <div className="p-5 rounded-xl bg-[#05070D] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Detected Browser Tabs in Chrome ({openTabs.length})
            </span>
            <button
              onClick={refreshTabList}
              className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Scan Tabs</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Click <strong>"Connect this Tab"</strong> next to your open Google Flow, Google AI Studio, or VideoFX tab:
          </p>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {openTabs.length === 0 ? (
              <div className="text-xs text-slate-500 italic p-3">No browser tabs found.</div>
            ) : (
              openTabs.map((t) => {
                const isCurrentActive = flowSession?.tabId === t.id;
                return (
                  <div
                    key={t.id}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs transition-colors ${
                      isCurrentActive
                        ? 'border-emerald-500/60 bg-emerald-950/20 text-emerald-200'
                        : t.isLikelyFlow
                        ? 'border-cyan-500/40 bg-cyan-950/20 text-slate-200'
                        : 'border-slate-800/80 bg-slate-900/40 text-slate-400'
                    }`}
                  >
                    <div className="space-y-0.5 truncate flex-1">
                      <div className="font-semibold text-slate-200 truncate flex items-center gap-2">
                        <span>{t.title}</span>
                        {t.isLikelyFlow && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                            FLOW / VEO / STUDIO
                          </span>
                        )}
                        {isCurrentActive && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            CURRENTLY SYNCED
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate font-mono">{t.url}</div>
                    </div>

                    <button
                      onClick={() => handleSelectTab(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                        isCurrentActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white'
                      }`}
                    >
                      {isCurrentActive ? 'Connected' : 'Connect this Tab'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Launch URLs */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <span className="text-xs font-bold text-slate-300 block">Launch Official Google Studios:</span>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleOpenAndConnect('https://labs.google/fx/tools/flow')}
              className="px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-800 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Labs Flow</span>
            </button>
            <button
              onClick={() => handleOpenAndConnect('https://aistudio.google.com/')}
              className="px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google AI Studio (Veo)</span>
            </button>
            <button
              onClick={() => handleOpenAndConnect('https://aitestkitchen.withgoogle.com/tools/video-fx')}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>VideoFX (AI Test Kitchen)</span>
            </button>
          </div>
        </div>

        {/* Ethical Safety Notice */}
        <div className="p-4 rounded-xl bg-[#05070D] border border-blue-500/20 text-xs text-slate-300 space-y-2">
          <div className="font-bold text-blue-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero-Trust Security & Google Privacy Compliance</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            CineForge AI strictly complies with Google Chrome extension standards:
            <br />
            • <strong>No password collection:</strong> You log into Google directly on the official Flow tab.
            <br />
            • <strong>No cookie extraction:</strong> CineForge never reads, steals, or transmits your session tokens.
            <br />
            • <strong>No CAPTCHA bypass:</strong> Human verification challenges remain entirely under your control.
            <br />
            • <strong>Credit authenticity:</strong> Credits are only displayed if visibly confirmed on Google Flow.
          </p>
        </div>
      </div>

      {/* Manual Handoff Mode Walkthrough */}
      <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          Seamless Manual Handoff Mode
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          If Google updates Flow's button selectors or if automated insertion encounters a challenge, CineForge automatically switches to Manual Handoff Mode:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#05070D] border border-slate-800 space-y-1">
            <strong className="text-cyan-400">1. One-Click Copy</strong>
            <p className="text-slate-400 text-[11px]">Copy the optimized prompt and reference images from CineForge.</p>
          </div>
          <div className="p-3.5 rounded-lg bg-[#05070D] border border-slate-800 space-y-1">
            <strong className="text-cyan-400">2. Generate in Flow</strong>
            <p className="text-slate-400 text-[11px]">Paste prompt in Flow tab and generate video with your account credits.</p>
          </div>
          <div className="p-3.5 rounded-lg bg-[#05070D] border border-slate-800 space-y-1">
            <strong className="text-cyan-400">3. Instant Import</strong>
            <p className="text-slate-400 text-[11px]">Click "Import Generated Video" to attach the clip directly to the timeline.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
