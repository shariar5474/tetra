import React, { useState } from 'react';
import { Film, Sparkles, Check, ArrowRight, Wand2 } from 'lucide-react';
import { Project, AspectRatio, Resolution } from '../../shared/types/project';
import { SUPPORTED_LANGUAGES } from '../../shared/constants/languages';

interface NewMovieViewProps {
  onCreateProject: (params: {
    name: string;
    description: string;
    settings: any;
  }) => Promise<Project>;
  onCancel: () => void;
  onSuccess: (project: Project) => void;
}

export const NewMovieView: React.FC<NewMovieViewProps> = ({
  onCreateProject,
  onCancel,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Cinematic Drama');
  const [language, setLanguage] = useState('bn');
  const [dialect, setDialect] = useState('bn-ctg (Chittagong / Chatgaiya)');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [resolution, setResolution] = useState<Resolution>('1080p');
  const [fps, setFps] = useState(30);
  const [targetDurationMinutes, setTargetDurationMinutes] = useState(5);
  const [visualStyle, setVisualStyle] = useState(
    'Ultra-realistic cinematic film, 35mm anamorphic lens, shallow depth of field, natural lighting, professional color grading'
  );
  const [creating, setCreating] = useState(false);

  const selectedLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      const project = await onCreateProject({
        name: name.trim(),
        description: description.trim(),
        settings: {
          genre,
          language,
          dialect,
          aspectRatio,
          resolution,
          fps,
          targetDurationMinutes,
          visualStyle,
        },
      });
      onSuccess(project);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const stylePresets = [
    {
      title: 'Ultra-Realistic 35mm',
      desc: '35mm anamorphic lens, lifelike skin textures, shallow depth of field, natural lighting',
    },
    {
      title: 'Rural Golden Hour (Village Indie)',
      desc: 'Warm sun-drenched atmosphere, rustic wooden textures, handheld camera, atmospheric haze',
    },
    {
      title: 'Dark Cinematic Noir',
      desc: 'High contrast chiaroscuro, moody shadows, neon rain reflections, slow atmospheric dolly',
    },
    {
      title: 'Vibrant Commercial',
      desc: 'Crisp 8k lighting, vivid pop colors, dynamic sweeping camera, flawless studio composition',
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto overflow-y-auto space-y-6">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Film className="w-4 h-4" />
          Project Creation
        </div>
        <h1 className="text-2xl font-bold text-white mt-1">Create New Cinematic Movie</h1>
        <p className="text-xs text-slate-400">
          Configure movie dimensions, cinematic style, language, and regional dialect settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="glass-card p-6 rounded-xl border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white">1. Movie Identity</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Movie Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. The Shopkeeper of Chittagong (চাঁটগাঁর নানটু)"
                className="w-full px-3.5 py-2 bg-[#05070D] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Story Synopsis / Logline</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A compelling logline of your movie story arc..."
                className="w-full px-3.5 py-2 bg-[#05070D] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-3 py-2 bg-[#05070D] border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="Cinematic Drama">Cinematic Drama</option>
                  <option value="Comedy / Satire">Comedy / Satire</option>
                  <option value="Action & Thriller">Action & Thriller</option>
                  <option value="Sci-Fi & Cyberpunk">Sci-Fi & Cyberpunk</option>
                  <option value="Documentary / Realism">Documentary / Realism</option>
                  <option value="Story-Based Advertisement">Story-Based Advertisement</option>
                  <option value="Short Film / Reel">Short Film / Reel</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Duration</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={targetDurationMinutes}
                    onChange={(e) => setTargetDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#05070D] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-xs text-slate-400">minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Language & Dialect Support */}
        <div className="glass-card p-6 rounded-xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">2. Language & Dialect Preservation</h2>
            <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
              Unicode & Regional Preserved
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Primary Language</label>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  const matched = SUPPORTED_LANGUAGES.find((l) => l.code === e.target.value);
                  setDialect(matched?.dialects?.[0]?.name || '');
                }}
                className="w-full px-3 py-2 bg-[#05070D] border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Dialect / Vernacular</label>
              <select
                value={dialect}
                onChange={(e) => setDialect(e.target.value)}
                className="w-full px-3 py-2 bg-[#05070D] border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {selectedLangObj?.dialects ? (
                  selectedLangObj.dialects.map((d) => (
                    <option key={d.code} value={d.name}>
                      {d.name}
                    </option>
                  ))
                ) : (
                  <option value="Standard">Standard</option>
                )}
              </select>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed bg-[#05070D] p-3 rounded-lg border border-slate-800">
            💡 <strong className="text-slate-300">Preservation Rule:</strong> Original dialogue and regional vocabulary (such as Chittagong/Chatgaiya expressions <span className="text-cyan-300 font-mono">অনরে, হনডে, খাইস্যন, গম আছননি</span>) are never converted into standard Bengali. Spoken cadences remain 100% faithful.
          </p>
        </div>

        {/* Visual Style & Presets */}
        <div className="glass-card p-6 rounded-xl border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white">3. Cinematic Visual Style</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {stylePresets.map((preset) => (
              <div
                key={preset.title}
                onClick={() => setVisualStyle(preset.desc)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  visualStyle === preset.desc
                    ? 'border-cyan-500 bg-cyan-950/20 text-cyan-200'
                    : 'border-slate-800 bg-[#080C14] hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="text-xs font-semibold text-white flex items-center justify-between">
                  <span>{preset.title}</span>
                  {visualStyle === preset.desc && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">{preset.desc}</div>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Custom Style Prompt Modifier</label>
            <input
              type="text"
              value={visualStyle}
              onChange={(e) => setVisualStyle(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#05070D] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Cinematic Technical Specs */}
        <div className="glass-card p-6 rounded-xl border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white">4. Technical Specifications</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full px-3 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
              >
                <option value="16:9">16:9 (Landscape / Film)</option>
                <option value="9:16">9:16 (Vertical / Reels)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="2.39:1">2.39:1 (Anamorphic Cinema)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Resolution</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as Resolution)}
                className="w-full px-3 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
              >
                <option value="1080p">1080p Full HD</option>
                <option value="720p">720p Standard HD</option>
                <option value="4k">4K (AI Upscaled)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Frame Rate</label>
              <select
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
              >
                <option value={24}>24 fps (Cinematic Film)</option>
                <option value={30}>30 fps (Broadcast / Web)</option>
                <option value={60}>60 fps (High Motion)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Primary Engine</label>
              <div className="w-full px-3 py-1.5 bg-[#05070D] border border-slate-800 rounded-lg text-xs text-cyan-400 font-mono">
                Google Flow
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            {creating ? (
              <>
                <Wand2 className="w-4 h-4 animate-spin" />
                <span>Initializing Project...</span>
              </>
            ) : (
              <>
                <span>Launch Movie Project</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
