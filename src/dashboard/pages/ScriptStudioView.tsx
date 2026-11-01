import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Upload,
  CheckCircle2,
  Users,
  Compass,
  Layers,
  Wand2,
  AlertCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { ScriptDocument, ScriptAnalysisResult } from '../../shared/types/script';
import { Project } from '../../shared/types/project';
import { analyzeScriptWithGemini } from '../../providers/gemini-provider';
import { analyzeScriptHeuristic } from '../../engines/script-engine/script-analyzer';

interface ScriptStudioViewProps {
  project?: Project;
  script?: ScriptDocument;
  onSaveScript: (rawText: string, analysis?: ScriptAnalysisResult) => Promise<void>;
  onApplyToStoryboard: (analysis: ScriptAnalysisResult, autoGenerate?: boolean) => Promise<void>;
  onNavigateToSceneGenerator?: () => void;
}

export const ScriptStudioView: React.FC<ScriptStudioViewProps> = ({
  project,
  script,
  onSaveScript,
  onApplyToStoryboard,
  onNavigateToSceneGenerator,
}) => {
  const [text, setText] = useState(script?.rawText || '');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ScriptAnalysisResult | undefined>(script?.analysis);
  const [activeTab, setActiveTab] = useState<'editor' | 'storyArc' | 'characters' | 'locations' | 'scenes'>('editor');
  const [statusMessage, setStatusMessage] = useState('');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Preset sample script (with Chittagong / Chatgaiya dialogue) for instant one-click demonstration
  const loadChatgaiyaSample = () => {
    const sample = `TITLE: নানটুর দোকান (The Shopkeeper of Chittagong)
GENRE: Cinematic Village Comedy / Drama
LANGUAGE: Bengali (Chittagong / Chatgaiya Dialect)

INT. NANTU'S VILLAGE GROCERY SHOP - AFTERNOON
A rustic rural village grocery shop in Hathazari, Chittagong. Sunbeams filter through the tin roof. Shelves are stocked with tea glasses, hanging biscuits, and earthen jars.

Nantu (32), wearing an unbuttoned blue cotton shirt and lungi, wipes the wooden counter with a dry cloth. He speaks with an authentic Chittagonian cadence.

NANTU
(হাঁক ছেড়ে)
ও ভাই রহিম! হনডে যার? আঁর দোয়ানো এক্কানা বয়! এডে তাজা চা খাইস্যননি?

EXT. VILLAGE ROAD - MOMENTS LATER
Rahim (28), riding a rustic bicycle with a bundle of betel leaves, screeches to a halt beside the wooden bench.

RAHIM
(হেসে)
নানটু ভাই, অনরে তো বহুত দিন বাদে দেখ্যি! গম আছননি বেয়াইগ্গুন? আঁই তো চকবাজার যাইর!

NANTU
চকবাজার যাইবা ফরে! আগে এক গ্লাস লাল চা খাও। আঁর নতুন চা পাতা আইস্যে, একেবারে খাঁটি!

INT. NANTU'S VILLAGE GROCERY SHOP - CONTINUOUS
Nantu pours steaming red tea from a brass kettle into small fluted glasses. The village elders observe with amused expressions.

NANTU
(চায়ের কাপ এগিয়ে দিয়ে)
যে জিন্দেগী! শান্তি ছাড়া কিছু নাইরে রহিম। চা খাও আর মন ঠান্ডা রাখো!`;

    setText(sample);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };

  const runAnalysis = async () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setStatusMessage('Analyzing story structure, characters, and dialects...');

    try {
      // Analyze using the intelligent engine
      const result = await analyzeScriptWithGemini(text);
      setAnalysis(result);
      await onSaveScript(text, result);
      setStatusMessage('Script analyzed successfully! Characters and scenes extracted.');
      setActiveTab('scenes');
    } catch (err: any) {
      console.error(err);
      // Fallback heuristic
      const fallback = analyzeScriptHeuristic(text);
      setAnalysis(fallback);
      await onSaveScript(text, fallback);
      setActiveTab('scenes');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyStoryboard = async () => {
    if (!analysis) return;
    setAnalyzing(true);
    setStatusMessage('Generating scene cards and prompts...');
    try {
      await onApplyToStoryboard(analysis, false);
      setStatusMessage('Scenes successfully synced to Storyboard Studio!');
    } catch (err: any) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCommitAndGenerateAll = async () => {
    if (!analysis) return;
    setAnalyzing(true);
    setStatusMessage('Syncing scenes & initiating batch video generation for all scenes...');
    try {
      await onApplyToStoryboard(analysis, true);
      setStatusMessage('All scenes queued for production! Opening Scene Generator...');
    } catch (err: any) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (!project) {
    return (
      <div className="p-12 text-center text-slate-400">
        Please select or create a movie project first.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            Story Intelligence Engine
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Script Studio</h1>
          <p className="text-xs text-slate-400">
            Paste or upload your screenplay. CineForge automatically analyzes story arcs, characters, locations, and scenes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadChatgaiyaSample}
            className="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-medium transition-colors cursor-pointer"
          >
            Load Chatgaiya Sample Script
          </button>
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload Script (.txt/.md)</span>
            <input type="file" accept=".txt,.md,.text" className="hidden" onChange={handleFileUpload} />
          </label>
          <button
            onClick={runAnalysis}
            disabled={analyzing || !text.trim()}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            {analyzing ? <Wand2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Analyze Script</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 4-Step Production Pipeline Guide */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#080C14] border border-slate-800 text-xs">
        <div className={`flex items-center gap-2 p-2 rounded-lg ${activeTab === 'editor' ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300' : 'text-slate-400'}`}>
          <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">1</span>
          <span className="font-medium">Write / Paste Script</span>
        </div>
        <div className={`flex items-center gap-2 p-2 rounded-lg ${analyzing ? 'bg-blue-950/60 border border-blue-500/40 text-blue-300' : analysis ? 'text-slate-300' : 'text-slate-500'}`}>
          <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">2</span>
          <span className="font-medium">AI Analysis</span>
        </div>
        <div className={`flex items-center gap-2 p-2 rounded-lg ${activeTab === 'scenes' ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300' : 'text-slate-400'}`}>
          <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">3</span>
          <span className="font-medium">Review Scenes</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg text-slate-400">
          <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">4</span>
          <span className="font-medium">Produce Shots & Export</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 text-xs pb-1">
        {[
          { key: 'editor', label: `Screenplay Editor (${wordCount} words)`, icon: FileText },
          { key: 'storyArc', label: 'Story Arc', icon: BookOpen, disabled: !analysis },
          { key: 'characters', label: `Characters (${analysis?.characters?.length || 0})`, icon: Users, disabled: !analysis },
          { key: 'locations', label: `Locations (${analysis?.locations?.length || 0})`, icon: Compass, disabled: !analysis },
          { key: 'scenes', label: `Scene Breakdown (${analysis?.scenes?.length || 0})`, icon: Layers, disabled: !analysis },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              disabled={tab.disabled}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isActive
                  ? 'border-cyan-400 text-cyan-300 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Screenplay Editor */}
      {activeTab === 'editor' && (
        <div className="glass-card rounded-xl border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Direct Screenplay / Dialogue Input</span>
            <span className="font-mono text-cyan-400">
              {project.settings.language.toUpperCase()} • {project.settings.dialect || 'Standard'}
            </span>
          </div>
          <textarea
            rows={20}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write or paste your screenplay here...

Example:
INT. NANTU'S VILLAGE SHOP - AFTERNOON
Nantu wipes the glass counter.
NANTU: ও ভাই রহিম! হনডে যার? আঁর দোয়ানো এক্কানা বয়!..."
            className="w-full p-4 bg-[#05070D] border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 leading-relaxed resize-y"
          />
        </div>
      )}

      {/* Tab 2: Story Arc */}
      {activeTab === 'storyArc' && analysis?.storyArc && (
        <div className="glass-card rounded-xl border-slate-800 p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">{analysis.storyArc.title}</h2>
            <p className="text-xs text-cyan-400 font-mono mt-0.5">{analysis.storyArc.genre}</p>
            <p className="text-xs text-slate-300 mt-2 italic">{analysis.storyArc.logline}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-[#080C14] border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-400">Beginning / Setup</span>
              <p className="text-slate-300">{analysis.storyArc.beginning}</p>
            </div>
            <div className="p-4 rounded-lg bg-[#080C14] border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400">Inciting Incident</span>
              <p className="text-slate-300">{analysis.storyArc.incitingIncident}</p>
            </div>
            <div className="p-4 rounded-lg bg-[#080C14] border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-purple-400">Rising Action & Conflict</span>
              <p className="text-slate-300">{analysis.storyArc.risingAction}</p>
            </div>
            <div className="p-4 rounded-lg bg-[#080C14] border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-red-400">Climax</span>
              <p className="text-slate-300">{analysis.storyArc.climax}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#080C14] border border-slate-800 space-y-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Resolution</span>
            <p className="text-slate-300">{analysis.storyArc.resolution}</p>
          </div>
        </div>
      )}

      {/* Tab 3: Characters Extracted */}
      {activeTab === 'characters' && analysis?.characters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.characters.map((char, i) => (
            <div key={i} className="glass-card rounded-xl border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{char.name}</h3>
                <span className="text-[10px] text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  {char.apparentAge}
                </span>
              </div>
              <p className="text-xs text-slate-300">{char.identity}</p>
              <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800/80">
                <div><strong className="text-slate-300">Appearance:</strong> {char.keyAppearance}</div>
                <div><strong className="text-slate-300">Costume:</strong> {char.costume}</div>
                <div><strong className="text-slate-300">Speaking Style:</strong> {char.speakingStyle}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Locations Extracted */}
      {activeTab === 'locations' && analysis?.locations && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.locations.map((loc, i) => (
            <div key={i} className="glass-card rounded-xl border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{loc.name}</h3>
                <span className="text-[10px] text-purple-400 font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-800">
                  {loc.interiorExterior} • {loc.timeOfDay}
                </span>
              </div>
              <p className="text-xs text-slate-300">{loc.description}</p>
              <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800/80">
                <div><strong className="text-slate-300">Lighting Mood:</strong> {loc.lighting}</div>
                <div><strong className="text-slate-300">Atmosphere / Weather:</strong> {loc.weather}</div>
                <div><strong className="text-slate-300">Key Props:</strong> {loc.keyProps.join(', ')}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Scene Breakdown */}
      {activeTab === 'scenes' && analysis?.scenes && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-cyan-950/40 border border-cyan-500/30">
            <div className="text-xs text-slate-200">
              <strong className="text-cyan-400">{analysis.scenes.length} cinematic scenes</strong> ready for production.
              Choose to commit to storyboard or start full video generation immediately.
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleApplyStoryboard}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700"
              >
                <span>Commit to Storyboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCommitAndGenerateAll}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ Commit & Generate All Videos</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {analysis.scenes.map((sc) => (
              <div key={sc.sceneNumber} className="glass-card rounded-xl border-slate-800 p-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                      Scene {sc.sceneNumber}
                    </span>
                    <span className="text-sm">{sc.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">{sc.estimatedDurationSeconds}s</span>
                    <button
                      onClick={async () => {
                        await handleApplyStoryboard();
                        if (onNavigateToSceneGenerator) {
                          onNavigateToSceneGenerator();
                        }
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700 text-[10px] font-semibold flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Open in Generator</span>
                    </button>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-3">
                  <span><strong>Location:</strong> {sc.locationName}</span>
                  <span>•</span>
                  <span><strong>Time:</strong> {sc.timeOfDay}</span>
                  <span>•</span>
                  <span><strong>Characters:</strong> {sc.characterNames.join(', ')}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{sc.actionDescription}</p>
                {sc.dialogueSnippet && (
                  <div className="p-2.5 rounded bg-[#05070D] border border-slate-800/80 text-xs text-cyan-200 italic font-mono">
                    "{sc.dialogueSnippet}"
                  </div>
                )}
                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span>Camera: {sc.suggestedShot}</span>
                  <span>Tone: {sc.emotionalTone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
