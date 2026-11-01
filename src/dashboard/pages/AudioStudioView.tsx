import React, { useState } from 'react';
import {
  Music,
  Volume2,
  VolumeX,
  Play,
  Square,
  Plus,
  Sliders,
  Sparkles,
  Wind,
  Footprints,
  Compass,
} from 'lucide-react';
import { Project } from '../../shared/types/project';
import { AudioClip } from '../../shared/types/editor';
import { audioMixer } from '../../engines/audio-engine/audio-mixer';

interface AudioStudioViewProps {
  project?: Project;
}

export const AudioStudioView: React.FC<AudioStudioViewProps> = ({ project }) => {
  const [playingPreset, setPlayingPreset] = useState<string | null>(null);
  const [dialogueVolume, setDialogueVolume] = useState(1.0);
  const [bgmVolume, setBgmVolume] = useState(0.6);
  const [ambientVolume, setAmbientVolume] = useState(0.4);
  const [sfxVolume, setSfxVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const presets = [
    {
      id: 'riser',
      name: 'Cinematic Tension Riser',
      category: 'cinematic',
      desc: 'Deep sub bass ascending into high frequency metallic climax',
      play: () => audioMixer.playBuffer(audioMixer.createCinematicRiserBuffer(), sfxVolume, 'riser'),
    },
    {
      id: 'village',
      name: 'Rural Village Atmosphere',
      category: 'ambient',
      desc: 'Afternoon countryside breeze and distant crickets',
      play: () => audioMixer.playBuffer(audioMixer.createVillageAmbienceBuffer(), ambientVolume, 'village'),
    },
    {
      id: 'footsteps',
      name: 'Rustic Footsteps on Dirt Road',
      category: 'footsteps',
      desc: 'Rhythmic footsteps on compacted village dirt road',
      play: () => audioMixer.playBuffer(audioMixer.createFootstepsBuffer(), sfxVolume, 'footsteps'),
    },
  ];

  const handlePlayPreset = (id: string, playFn: () => void) => {
    if (playingPreset === id) {
      audioMixer.stopClip(id);
      setPlayingPreset(null);
    } else {
      audioMixer.stopAll();
      playFn();
      setPlayingPreset(id);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Music className="w-4 h-4" />
            Sound Design & Multi-Track Audio Engine
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Audio Studio</h1>
          <p className="text-xs text-slate-400">
            Mix dialogue, cinematic background scores, environmental ambiances, and Foley sound effects.
          </p>
        </div>

        <button
          onClick={() => {
            audioMixer.stopAll();
            setPlayingPreset(null);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
        >
          <Square className="w-3.5 h-3.5" />
          <span>Stop All Audio</span>
        </button>
      </div>

      {/* Multi-Track Console */}
      <div className="glass-card p-6 rounded-xl border-slate-800 space-y-5">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Master Multi-Track Console
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Track 1: Dialogue */}
          <div className="p-4 rounded-xl bg-[#05070D] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Track 1: Dialogue</span>
              <span className="font-mono text-cyan-400">{Math.round(dialogueVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={dialogueVolume}
              onChange={(e) => setDialogueVolume(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
            <div className="text-[10px] text-slate-500">Character spoken dialogue & voiceovers</div>
          </div>

          {/* Track 2: BGM */}
          <div className="p-4 rounded-xl bg-[#05070D] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Track 2: Music (BGM)</span>
              <span className="font-mono text-purple-400">{Math.round(bgmVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={bgmVolume}
              onChange={(e) => setBgmVolume(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="text-[10px] text-slate-500">Cinematic score & orchestral cues</div>
          </div>

          {/* Track 3: Ambient */}
          <div className="p-4 rounded-xl bg-[#05070D] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Track 3: Ambience</span>
              <span className="font-mono text-emerald-400">{Math.round(ambientVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={ambientVolume}
              onChange={(e) => setAmbientVolume(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="text-[10px] text-slate-500">Location environmental acoustics</div>
          </div>

          {/* Track 4: SFX */}
          <div className="p-4 rounded-xl bg-[#05070D] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Track 4: Foley SFX</span>
              <span className="font-mono text-amber-400">{Math.round(sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={sfxVolume}
              onChange={(e) => setSfxVolume(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="text-[10px] text-slate-500">Sound effects, footsteps, cinematic hits</div>
          </div>
        </div>
      </div>

      {/* Preset Foley & Cinematic Sound Library */}
      <div className="glass-card p-6 rounded-xl border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white">Synthesized Cinematic Sound FX Presets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <div key={preset.id} className="p-4 rounded-xl bg-[#05070D] border border-slate-800 space-y-3">
              <div>
                <h3 className="text-xs font-bold text-white">{preset.name}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{preset.desc}</p>
              </div>

              <button
                onClick={() => handlePlayPreset(preset.id, preset.play)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  playingPreset === preset.id
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {playingPreset === preset.id ? (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>Stop Playing</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Audition Sound</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
