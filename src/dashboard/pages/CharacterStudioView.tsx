import React, { useState } from 'react';
import {
  Users,
  Lock,
  Unlock,
  Plus,
  Upload,
  Camera,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  Shirt,
  UserCheck,
  Save,
  Edit3,
} from 'lucide-react';
import { Character, CharacterReferenceImage, CharacterCostume, CharacterViewType } from '../../shared/types/character';
import { Project } from '../../shared/types/project';
import { generateId, fileToBase64 } from '../../shared/utils/helpers';
import { generateSyntheticCharacterPortrait } from '../../engines/character-engine/portrait-generator';

interface CharacterStudioViewProps {
  project?: Project;
  characters: Character[];
  onSaveCharacter: (char: Character) => Promise<void>;
  onDeleteCharacter: (id: string) => Promise<void>;
  onCleanBogusCharacters?: () => Promise<void>;
}

export const CharacterStudioView: React.FC<CharacterStudioViewProps> = ({
  project,
  characters,
  onSaveCharacter,
  onDeleteCharacter,
  onCleanBogusCharacters,
}) => {
  const [selectedCharId, setSelectedCharId] = useState<string>(characters[0]?.id || '');
  const [viewTypeToUpload, setViewTypeToUpload] = useState<CharacterViewType>('face');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const selectedChar = characters.find((c) => c.id === selectedCharId) || characters[0];
  const primaryFace = selectedChar?.references?.find((r) => r.isPrimaryFace) || selectedChar?.references?.[0];

  const handleAddNewCharacter = async () => {
    if (!project) return;
    const charId = generateId('char');
    const newChar: Character = {
      id: charId,
      projectId: project.id,
      name: `Character ${characters.length + 1}`,
      code: `CHAR-00${characters.length + 1}`,
      description: 'A key character in the cinematic story arc.',
      age: '30s',
      gender: 'Male',
      faceShape: 'Oval with defined jawline',
      skinAppearance: 'Natural sun-warmed tone',
      eyes: 'Deep dark brown, expressive',
      hair: 'Short natural dark hair',
      facialHair: 'Light stubble',
      bodyType: 'Athletic / Average',
      height: '5 ft 9 in',
      personality: 'Honest, quick-witted, grounded',
      speakingStyle: 'Natural regional conversational',
      isLocked: false,
      references: [],
      costumes: [
        {
          id: generateId('costume'),
          characterId: charId,
          name: 'Signature Wardrobe',
          description: 'Standard character attire',
          colorScheme: ['#1E3A8A', '#0F172A'],
          isDefault: true,
          sceneIdsApplied: [],
          approved: true,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      const portrait = await generateSyntheticCharacterPortrait(newChar);
      newChar.references = [
        {
          id: generateId('ref'),
          characterId: charId,
          viewType: 'face',
          imageUrl: portrait,
          isPrimaryFace: true,
          uploadedAt: Date.now(),
        },
      ];
    } catch (_) {}

    await onSaveCharacter(newChar);
    setSelectedCharId(newChar.id);
    showSavedNotification();
  };

  const handleUpdateField = (field: keyof Character, value: any) => {
    if (!selectedChar) return;
    const updated: Character = {
      ...selectedChar,
      [field]: value,
      updatedAt: Date.now(),
    };
    onSaveCharacter(updated);
    showSavedNotification();
  };

  const showSavedNotification = () => {
    setSaveSuccessMsg('Character changes saved!');
    setTimeout(() => setSaveSuccessMsg(''), 2500);
  };

  const toggleLock = (char: Character) => {
    const updated: Character = {
      ...char,
      isLocked: !char.isLocked,
      lockedAt: !char.isLocked ? Date.now() : undefined,
      fingerprintHash: !char.isLocked
        ? `fp-${char.name}-${char.faceShape}-${char.skinAppearance}-${Date.now().toString(36)}`
        : undefined,
      updatedAt: Date.now(),
    };
    onSaveCharacter(updated);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChar) return;

    try {
      const base64 = await fileToBase64(file);
      const newRef: CharacterReferenceImage = {
        id: generateId('ref'),
        characterId: selectedChar.id,
        viewType: 'face',
        imageUrl: base64,
        isPrimaryFace: true,
        uploadedAt: Date.now(),
      };

      // Set existing refs to non-primary
      const existingRefs = selectedChar.references.map((r) => ({ ...r, isPrimaryFace: false }));
      const updatedRefs = [newRef, ...existingRefs];
      const updated: Character = {
        ...selectedChar,
        references: updatedRefs,
        updatedAt: Date.now(),
      };
      await onSaveCharacter(updated);
      setSaveSuccessMsg('Face photo uploaded & set as Primary Face!');
      setTimeout(() => setSaveSuccessMsg(''), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateAIPortrait = async () => {
    if (!selectedChar) return;
    try {
      const dataUrl = await generateSyntheticCharacterPortrait(selectedChar);
      const newRef: CharacterReferenceImage = {
        id: generateId('ref'),
        characterId: selectedChar.id,
        viewType: 'face',
        imageUrl: dataUrl,
        isPrimaryFace: true,
        uploadedAt: Date.now(),
      };
      const existingRefs = selectedChar.references.map((r) => ({ ...r, isPrimaryFace: false }));
      const updatedRefs = [newRef, ...existingRefs];
      const updated: Character = {
        ...selectedChar,
        references: updatedRefs,
        updatedAt: Date.now(),
      };
      await onSaveCharacter(updated);
      setSaveSuccessMsg('AI Face Portrait generated & locked as Primary Face!');
      setTimeout(() => setSaveSuccessMsg(''), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePhoto = async (refId: string) => {
    if (!selectedChar) return;
    const updatedRefs = selectedChar.references.filter((r) => r.id !== refId);
    const updated: Character = {
      ...selectedChar,
      references: updatedRefs,
      updatedAt: Date.now(),
    };
    await onSaveCharacter(updated);
    showSavedNotification();
  };

  const handleSetPrimaryPhoto = async (refId: string) => {
    if (!selectedChar) return;
    const updatedRefs = selectedChar.references.map((r) => ({
      ...r,
      isPrimaryFace: r.id === refId,
    }));
    const updated: Character = {
      ...selectedChar,
      references: updatedRefs,
      updatedAt: Date.now(),
    };
    await onSaveCharacter(updated);
    showSavedNotification();
  };

  const handleAddCostume = () => {
    if (!selectedChar) return;
    const newCostume: CharacterCostume = {
      id: generateId('costume'),
      characterId: selectedChar.id,
      name: `Costume ${selectedChar.costumes.length + 1}`,
      description: 'Alternative scene wardrobe',
      colorScheme: ['#3B82F6'],
      isDefault: false,
      sceneIdsApplied: [],
      approved: true,
    };
    const updated: Character = {
      ...selectedChar,
      costumes: [...selectedChar.costumes, newCostume],
      updatedAt: Date.now(),
    };
    onSaveCharacter(updated);
    showSavedNotification();
  };

  const handleDeleteCostume = (costumeId: string) => {
    if (!selectedChar) return;
    const updatedCostumes = selectedChar.costumes.filter((c) => c.id !== costumeId);
    const updated: Character = {
      ...selectedChar,
      costumes: updatedCostumes,
      updatedAt: Date.now(),
    };
    onSaveCharacter(updated);
    showSavedNotification();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            Character Bible & Consistency Engine
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Character Studio</h1>
          <p className="text-xs text-slate-400">
            Edit character names, customize biometric traits, upload face photos, and lock identity anchors for Google Flow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onCleanBogusCharacters && (
            <button
              onClick={onCleanBogusCharacters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-600/30 text-xs font-semibold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>🧹 Clean Bogus Characters</span>
            </button>
          )}

          <button
            onClick={handleAddNewCharacter}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Character</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {characters.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-300">No characters in this movie yet.</div>
          <p className="text-xs text-slate-500">
            Extract characters automatically from your script or click "Add New Character" to build one manually.
          </p>
          <button
            onClick={handleAddNewCharacter}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Character
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Character List Sidebar */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Project Characters ({characters.length})
            </span>
            <div className="space-y-2">
              {characters.map((char) => {
                const isSelected = char.id === selectedChar?.id;
                const primaryFace = char.references.find((r) => r.isPrimaryFace || r.viewType === 'face') || char.references[0];
                return (
                  <div
                    key={char.id}
                    onClick={() => setSelectedCharId(char.id)}
                    className={`group p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/20 shadow-md shadow-cyan-500/10'
                        : 'border-slate-800 bg-[#080C14] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden border border-slate-700 flex items-center justify-center shrink-0">
                        {primaryFace ? (
                          <img src={primaryFace.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserCheck className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white line-clamp-1">{char.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{char.code}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {char.isLocked ? (
                        <span title="Locked Consistency Anchor" className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <Lock className="w-3 h-3" />
                        </span>
                      ) : (
                        <span title="Unlocked (May vary)" className="p-1 rounded bg-slate-800 text-slate-500">
                          <Unlock className="w-3 h-3" />
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCharacter(char.id);
                        }}
                        title="Delete this character"
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/40 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Character Details & Face Studio */}
          {selectedChar && (
            <div className="lg:col-span-3 space-y-6">
              {/* Card Banner with Editable Name & Lock Toggle */}
              <div className="glass-card p-6 rounded-xl border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Clickable Avatar to change/upload face photo directly */}
                    <label
                      title="Click to change or upload face photo"
                      className="group relative w-20 h-20 rounded-2xl bg-slate-800 overflow-hidden border-2 border-cyan-500/60 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20 cursor-pointer"
                    >
                      {primaryFace ? (
                        <img src={primaryFace.imageUrl} alt={selectedChar.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-8 h-8 text-cyan-400" />
                      )}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                        <Camera className="w-5 h-5 text-cyan-300" />
                        <span className="text-[9px] font-bold mt-1">Upload Face</span>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
                    </label>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={selectedChar.name}
                          onChange={(e) => handleUpdateField('name', e.target.value)}
                          className="px-3 py-1 bg-[#05070D] border border-slate-700 rounded-lg text-sm font-bold text-white focus:outline-none focus:border-cyan-500 flex-1 max-w-sm"
                          placeholder="Character Name"
                        />
                        <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                          {selectedChar.code}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={selectedChar.description}
                        onChange={(e) => handleUpdateField('description', e.target.value)}
                        className="w-full px-3 py-1 bg-[#05070D] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                        placeholder="Character role or logline (e.g. Village grocery shopkeeper)"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={handleGenerateAIPortrait}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-md shadow-purple-600/20"
                      title="Auto-generate high resolution face portrait"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate AI Face</span>
                    </button>

                    <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer shadow-md shadow-cyan-600/20">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Real Face</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
                    </label>

                    <button
                      onClick={() => toggleLock(selectedChar)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedChar.isLocked
                          ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10 hover:bg-emerald-600/30'
                          : 'bg-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-600/30'
                      }`}
                    >
                      {selectedChar.isLocked ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-emerald-400" />
                          <span>LOCKED</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5 text-amber-400" />
                          <span>LOCK</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onDeleteCharacter(selectedChar.id)}
                      title="Delete Character"
                      className="p-2 rounded-xl bg-slate-800/60 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-700/60 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Editable Biometric & Visual Traits Form */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Biometric & Visual Attributes (Editable)
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 mb-1 block">Age</label>
                      <input
                        type="text"
                        value={selectedChar.age}
                        onChange={(e) => handleUpdateField('age', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 mb-1 block">Face Shape</label>
                      <input
                        type="text"
                        value={selectedChar.faceShape}
                        onChange={(e) => handleUpdateField('faceShape', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 mb-1 block">Skin Appearance</label>
                      <input
                        type="text"
                        value={selectedChar.skinAppearance}
                        onChange={(e) => handleUpdateField('skinAppearance', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 mb-1 block">Eyes</label>
                      <input
                        type="text"
                        value={selectedChar.eyes}
                        onChange={(e) => handleUpdateField('eyes', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 mb-1 block">Hair / Hairstyle</label>
                      <input
                        type="text"
                        value={selectedChar.hair}
                        onChange={(e) => handleUpdateField('hair', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 mb-1 block">Facial Hair</label>
                      <input
                        type="text"
                        value={selectedChar.facialHair || ''}
                        onChange={(e) => handleUpdateField('facialHair', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                        placeholder="e.g. Light stubble"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 mb-1 block">Body Structure</label>
                      <input
                        type="text"
                        value={selectedChar.bodyType}
                        onChange={(e) => handleUpdateField('bodyType', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 mb-1 block">Speaking Style</label>
                      <input
                        type="text"
                        value={selectedChar.speakingStyle}
                        onChange={(e) => handleUpdateField('speakingStyle', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reference Images Gallery */}
              <div className="glass-card p-6 rounded-xl border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Camera className="w-4 h-4 text-cyan-400" />
                      Face & Reference Photos ({selectedChar.references.length})
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Upload front portraits, side views, expression sheets, and full body photos.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleGenerateAIPortrait}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-sm shadow-purple-600/30"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate AI Portrait</span>
                    </button>

                    <select
                      value={viewTypeToUpload}
                      onChange={(e) => setViewTypeToUpload(e.target.value as CharacterViewType)}
                      className="px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                    >
                      <option value="face">Primary Face Anchor</option>
                      <option value="front">Front Portrait</option>
                      <option value="side">Side Profile</option>
                      <option value="full_body">Full Body View</option>
                      <option value="expressions">Expressions Sheet</option>
                      <option value="costume">Costume Reference</option>
                    </select>

                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm shadow-cyan-600/30">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
                    </label>
                  </div>
                </div>

                {selectedChar.references.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-slate-800 rounded-xl space-y-3">
                    <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-300">No reference images uploaded yet for {selectedChar.name}.</p>
                    <p className="text-[10px] text-slate-500 max-w-sm mx-auto">
                      Click "Generate AI Portrait" for an instant biometric anchor, or upload your own real face photo.
                    </p>
                    <button
                      onClick={handleGenerateAIPortrait}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-purple-600/20 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate AI Face Portrait Now</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {selectedChar.references.map((ref) => (
                      <div key={ref.id} className="group relative rounded-xl overflow-hidden border border-slate-800 bg-[#05070D] aspect-square flex flex-col justify-between">
                        <img src={ref.imageUrl} alt={ref.viewType} className="w-full h-full object-cover" />
                        
                        {/* Overlay Controls */}
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDeletePhoto(ref.id)}
                            title="Delete Photo"
                            className="p-1 rounded bg-red-900/80 hover:bg-red-800 text-white cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-white capitalize bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                            {ref.isPrimaryFace ? '★ Primary Face' : ref.viewType.replace(/_/g, ' ')}
                          </span>
                          {!ref.isPrimaryFace && (
                            <button
                              onClick={() => handleSetPrimaryPhoto(ref.id)}
                              className="text-[9px] text-cyan-300 hover:underline cursor-pointer font-bold"
                            >
                              Set Primary
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Wardrobe & Costume Versions */}
              <div className="glass-card p-6 rounded-xl border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-purple-400" />
                    Wardrobe & Costume Versions ({selectedChar.costumes.length})
                  </h3>
                  <button
                    onClick={handleAddCostume}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-medium hover:bg-purple-600/30 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Costume</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedChar.costumes.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-lg bg-[#05070D] border border-slate-800 flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={c.name}
                            onChange={(e) => {
                              const updatedCostumes = selectedChar.costumes.map((co) =>
                                co.id === c.id ? { ...co, name: e.target.value } : co
                              );
                              handleUpdateField('costumes', updatedCostumes);
                            }}
                            className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-xs font-bold text-white focus:outline-none"
                          />
                          {c.isDefault && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={c.description}
                          onChange={(e) => {
                            const updatedCostumes = selectedChar.costumes.map((co) =>
                              co.id === c.id ? { ...co, description: e.target.value } : co
                            );
                            handleUpdateField('costumes', updatedCostumes);
                          }}
                          className="w-full px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-300 focus:outline-none"
                          placeholder="Costume description..."
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteCostume(c.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Delete Costume"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
