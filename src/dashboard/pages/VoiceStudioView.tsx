import React, { useState, useEffect } from 'react';
import {
  Mic,
  Play,
  Square,
  Upload,
  Volume2,
  Users,
  CheckCircle2,
  Radio,
  FileAudio,
} from 'lucide-react';
import { Character, CharacterVoiceProfile } from '../../shared/types/character';
import { Project } from '../../shared/types/project';
import {
  getAvailableBrowserVoices,
  VoiceOption,
  speakPreview,
  stopSpeaking,
  VoiceRecorder,
} from '../../engines/voice-engine/voice-manager';
import { fileToBase64 } from '../../shared/utils/helpers';

interface VoiceStudioViewProps {
  project?: Project;
  characters: Character[];
  onSaveCharacter: (char: Character) => Promise<void>;
}

export const VoiceStudioView: React.FC<VoiceStudioViewProps> = ({
  project,
  characters,
  onSaveCharacter,
}) => {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedCharId, setSelectedCharId] = useState<string>(characters[0]?.id || '');
  const [previewText, setPreviewText] = useState('ও ভাই রহিম! হনডে যার? আঁর দোয়ানো এক্কানা বয়!');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder] = useState(() => new VoiceRecorder());

  const selectedChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  useEffect(() => {
    getAvailableBrowserVoices().then((v) => setVoices(v));
  }, []);

  const handleVoiceChange = (field: keyof CharacterVoiceProfile, value: any) => {
    if (!selectedChar) return;
    const currentProfile: CharacterVoiceProfile = selectedChar.voiceProfile || {
      engine: 'browser_tts',
      name: 'Default Natural Voice',
      language: project?.settings.language || 'bn',
      pitch: 1.0,
      rate: 1.0,
    };

    const updatedProfile = { ...currentProfile, [field]: value };
    const updatedChar: Character = {
      ...selectedChar,
      voiceProfile: updatedProfile,
      updatedAt: Date.now(),
    };
    onSaveCharacter(updatedChar);
  };

  const handleTestPreview = async () => {
    if (!selectedChar || !previewText.trim()) return;
    setIsPlaying(true);
    try {
      const profile = selectedChar.voiceProfile || {
        engine: 'browser_tts',
        name: 'Default',
        language: project?.settings.language || 'bn',
        pitch: 1.0,
        rate: 1.0,
      };
      await speakPreview(previewText, profile);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleToggleRecord = async () => {
    if (!isRecording) {
      try {
        await recorder.startRecording();
        setIsRecording(true);
      } catch (err) {
        console.error('Microphone access denied:', err);
      }
    } else {
      try {
        const audioBlob = await recorder.stopRecording();
        setIsRecording(false);
        const url = URL.createObjectURL(audioBlob);
        handleVoiceChange('sampleAudioUrl', url);
      } catch (err) {
        console.error(err);
        setIsRecording(false);
      }
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      handleVoiceChange('sampleAudioUrl', base64);
    } catch (err) {
      console.error(err);
    }
  };

  if (characters.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400">
        No characters available. Create characters in Character Studio first.
      </div>
    );
  }

  const profile = selectedChar?.voiceProfile || {
    engine: 'browser_tts',
    name: 'Default Natural Voice',
    language: project?.settings.language || 'bn',
    pitch: 1.0,
    rate: 1.0,
  };

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Mic className="w-4 h-4" />
            Character Voice & Spoken Cadence
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Voice Studio</h1>
          <p className="text-xs text-slate-400">
            Assign distinctive vocal personalities to characters, preview synthesized dialogue, or record live voice tracks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Character Selector */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Characters ({characters.length})
          </span>
          <div className="space-y-2">
            {characters.map((c) => {
              const isSelected = c.id === selectedChar?.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCharId(c.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/20 shadow-md shadow-cyan-500/10'
                      : 'border-slate-800 bg-[#080C14] hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h3 className="text-xs font-bold text-white">{c.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">{c.code}</p>
                  </div>
                  {c.voiceProfile?.sampleAudioUrl ? (
                    <FileAudio className="w-4 h-4 text-emerald-400" title="Audio Sample Attached" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Voice Customization Panel */}
        {selectedChar && (
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 rounded-xl border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-white">{selectedChar.name} — Vocal Blueprint</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Speaking Style: {selectedChar.speakingStyle}
                  </p>
                </div>
              </div>

              {/* Voice Synthesizer Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    System Synthesis Voice
                  </label>
                  <select
                    value={profile.voiceId || ''}
                    onChange={(e) => handleVoiceChange('voiceId', e.target.value)}
                    className="w-full px-3 py-2 bg-[#05070D] border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="">Default OS Engine Voice</option>
                    {voices.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Pitch</span>
                      <span className="font-mono text-cyan-400">{profile.pitch}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={1.8}
                      step={0.1}
                      value={profile.pitch}
                      onChange={(e) => handleVoiceChange('pitch', Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Speaking Rate</span>
                      <span className="font-mono text-cyan-400">{profile.rate}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={1.8}
                      step={0.1}
                      value={profile.rate}
                      onChange={(e) => handleVoiceChange('rate', Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>

                {/* Live Preview Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Dialogue Test Line
                  </label>
                  <textarea
                    rows={2}
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    className="w-full p-3 bg-[#05070D] border border-slate-700 rounded-lg text-xs font-mono text-cyan-200 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleTestPreview}
                    disabled={isPlaying}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isPlaying ? 'Synthesizing...' : 'Preview Voice'}</span>
                  </button>
                  <button
                    onClick={stopSpeaking}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Direct Recording / Upload section */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Live Voice Actor Recording / Sample Upload
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleToggleRecord}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isRecording
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>{isRecording ? 'Stop Recording' : 'Record from Mic'}</span>
                  </button>

                  <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Upload Audio File</span>
                    <input type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
                  </label>
                </div>

                {profile.sampleAudioUrl && (
                  <div className="p-3 bg-[#05070D] border border-slate-800 rounded-lg flex items-center justify-between">
                    <span className="text-xs text-slate-300">Custom Audio Sample Attached</span>
                    <audio src={profile.sampleAudioUrl} controls className="h-8 max-w-xs" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
