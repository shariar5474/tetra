import React, { useState } from 'react';
import {
  Compass,
  Lock,
  Unlock,
  Plus,
  Upload,
  Camera,
  Trash2,
  CheckCircle2,
  Sun,
  Moon,
  CloudRain,
  Image as ImageIcon,
} from 'lucide-react';
import { Environment, EnvironmentReferenceImage, EnvironmentViewType } from '../../shared/types/environment';
import { Project } from '../../shared/types/project';
import { generateId, fileToBase64 } from '../../shared/utils/helpers';

interface EnvironmentStudioViewProps {
  project?: Project;
  environments: Environment[];
  onSaveEnvironment: (env: Environment) => Promise<void>;
  onDeleteEnvironment: (id: string) => Promise<void>;
}

export const EnvironmentStudioView: React.FC<EnvironmentStudioViewProps> = ({
  project,
  environments,
  onSaveEnvironment,
  onDeleteEnvironment,
}) => {
  const [selectedEnvId, setSelectedEnvId] = useState<string>(environments[0]?.id || '');
  const [viewTypeToUpload, setViewTypeToUpload] = useState<EnvironmentViewType>('wide');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const selectedEnv = environments.find((e) => e.id === selectedEnvId) || environments[0];

  const handleAddNewEnvironment = () => {
    if (!project) return;
    const newEnv: Environment = {
      id: generateId('env'),
      projectId: project.id,
      name: `Location ${environments.length + 1}`,
      code: `ENV-00${environments.length + 1}`,
      description: 'A key cinematic film location.',
      locationType: 'interior',
      architecture: 'Rustic wooden structure with corrugated tin roof',
      furnitureAndDecor: 'Long timber counter, wall shelves, wooden benches',
      keyProps: ['Glass tea cups', 'Kettle', 'Hanging snack packets'],
      lightingMood: 'Atmospheric golden afternoon light with visible dust motes',
      colorPalette: ['#854D0E', '#1E293B', '#F59E0B'],
      defaultTime: 'day',
      defaultWeather: 'sunny',
      ambientAudioNotes: 'Distant birds, cicadas, breeze rustling bamboo leaves',
      isLocked: false,
      references: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onSaveEnvironment(newEnv);
    setSelectedEnvId(newEnv.id);
  };

  const handleUpdateField = (field: keyof Environment, value: any) => {
    if (!selectedEnv) return;
    const updated: Environment = {
      ...selectedEnv,
      [field]: value,
      updatedAt: Date.now(),
    };
    onSaveEnvironment(updated);
    showSavedNotification();
  };

  const showSavedNotification = () => {
    setSaveSuccessMsg('Location changes saved!');
    setTimeout(() => setSaveSuccessMsg(''), 2500);
  };

  const toggleLock = (env: Environment) => {
    const updated: Environment = {
      ...env,
      isLocked: !env.isLocked,
      lockedAt: !env.isLocked ? Date.now() : undefined,
      updatedAt: Date.now(),
    };
    onSaveEnvironment(updated);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedEnv) return;

    try {
      const base64 = await fileToBase64(file);
      const newRef: EnvironmentReferenceImage = {
        id: generateId('env-ref'),
        environmentId: selectedEnv.id,
        viewType: viewTypeToUpload,
        imageUrl: base64,
        isPrimaryAnchor: selectedEnv.references.length === 0,
        uploadedAt: Date.now(),
      };

      const updated: Environment = {
        ...selectedEnv,
        references: [...selectedEnv.references, newRef],
        updatedAt: Date.now(),
      };
      await onSaveEnvironment(updated);
      showSavedNotification();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePhoto = async (refId: string) => {
    if (!selectedEnv) return;
    const updated: Environment = {
      ...selectedEnv,
      references: selectedEnv.references.filter((r) => r.id !== refId),
      updatedAt: Date.now(),
    };
    await onSaveEnvironment(updated);
    showSavedNotification();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            Environment Bible & Spatial Consistency
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Environment Studio</h1>
          <p className="text-xs text-slate-400">
            Define architectural layouts, lock props and lighting, upload visual reference photos, and prevent background drift.
          </p>
        </div>

        <button
          onClick={handleAddNewEnvironment}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Location</span>
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {environments.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl space-y-3">
          <Compass className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-300">No environments created yet.</div>
          <p className="text-xs text-slate-500">
            Extract environments from your screenplay or add one manually.
          </p>
          <button
            onClick={handleAddNewEnvironment}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Location
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Environment Sidebar */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Locations ({environments.length})
            </span>
            <div className="space-y-2">
              {environments.map((env) => {
                const isSelected = env.id === selectedEnv?.id;
                const primaryRef = env.references[0];
                return (
                  <div
                    key={env.id}
                    onClick={() => setSelectedEnvId(env.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/20 shadow-md shadow-cyan-500/10'
                        : 'border-slate-800 bg-[#080C14] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden border border-slate-700 flex items-center justify-center shrink-0">
                        {primaryRef ? (
                          <img src={primaryRef.imageUrl} alt={env.name} className="w-full h-full object-cover" />
                        ) : (
                          <Compass className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white line-clamp-1">{env.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono capitalize">{env.locationType}</div>
                      </div>
                    </div>
                    {env.isLocked ? (
                      <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <Lock className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="p-1 rounded bg-slate-800 text-slate-500">
                        <Unlock className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details & Reference Sheets */}
          {selectedEnv && (
            <div className="lg:col-span-3 space-y-6">
              {/* Banner with Editable Name & Lock Toggle */}
              <div className="glass-card p-6 rounded-xl border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={selectedEnv.name}
                        onChange={(e) => handleUpdateField('name', e.target.value)}
                        className="px-3 py-1 bg-[#05070D] border border-slate-700 rounded-lg text-sm font-bold text-white focus:outline-none focus:border-cyan-500 flex-1 max-w-sm"
                        placeholder="Location Name"
                      />
                      <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                        {selectedEnv.code}
                      </span>
                      <select
                        value={selectedEnv.locationType}
                        onChange={(e) => handleUpdateField('locationType', e.target.value)}
                        className="px-2 py-1 bg-[#05070D] border border-slate-700 rounded-lg text-xs text-purple-300 focus:outline-none uppercase font-mono"
                      >
                        <option value="interior">INTERIOR</option>
                        <option value="exterior">EXTERIOR</option>
                        <option value="mixed">INT/EXT</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={selectedEnv.description}
                      onChange={(e) => handleUpdateField('description', e.target.value)}
                      className="w-full px-3 py-1 bg-[#05070D] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                      placeholder="Brief location summary..."
                    />
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => toggleLock(selectedEnv)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedEnv.isLocked
                          ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
                          : 'bg-amber-600/20 border border-amber-500/40 text-amber-300'
                      }`}
                    >
                      {selectedEnv.isLocked ? (
                        <>
                          <Lock className="w-4 h-4 text-emerald-400" />
                          <span>LOCKED</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4 text-amber-400" />
                          <span>LOCK ENVIRONMENT</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onDeleteEnvironment(selectedEnv.id)}
                      className="p-2 rounded-xl bg-slate-800/60 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-700/60 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Spatial Architecture Details Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Architecture & Materials</label>
                    <textarea
                      rows={2}
                      value={selectedEnv.architecture}
                      onChange={(e) => handleUpdateField('architecture', e.target.value)}
                      className="w-full p-2.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Furniture & Decor</label>
                    <textarea
                      rows={2}
                      value={selectedEnv.furnitureAndDecor}
                      onChange={(e) => handleUpdateField('furnitureAndDecor', e.target.value)}
                      className="w-full p-2.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Lighting Atmosphere</label>
                    <input
                      type="text"
                      value={selectedEnv.lightingMood}
                      onChange={(e) => handleUpdateField('lightingMood', e.target.value)}
                      className="w-full p-2.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Key Props (comma separated)</label>
                    <input
                      type="text"
                      value={selectedEnv.keyProps.join(', ')}
                      onChange={(e) => handleUpdateField('keyProps', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                      className="w-full p-2.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Reference Gallery */}
              <div className="glass-card p-6 rounded-xl border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Camera className="w-4 h-4 text-cyan-400" />
                      Location Visual References ({selectedEnv.references.length})
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Upload wide establishing angles, interior shots, and architectural reference photos.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={viewTypeToUpload}
                      onChange={(e) => setViewTypeToUpload(e.target.value as EnvironmentViewType)}
                      className="px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                    >
                      <option value="wide">Wide Establishing Shot</option>
                      <option value="interior">Interior View</option>
                      <option value="exterior">Exterior View</option>
                      <option value="front">Front Elevation</option>
                      <option value="left">Left Angle</option>
                      <option value="right">Right Angle</option>
                      <option value="detail">Props Detail</option>
                    </select>

                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm shadow-cyan-600/30">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Reference</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
                    </label>
                  </div>
                </div>

                {selectedEnv.references.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-slate-800 rounded-xl space-y-2">
                    <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">No location reference photos uploaded.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedEnv.references.map((ref) => (
                      <div key={ref.id} className="group relative rounded-xl overflow-hidden border border-slate-800 bg-[#05070D] aspect-video">
                        <img src={ref.imageUrl} alt={ref.viewType} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDeletePhoto(ref.id)}
                            className="p-1 rounded bg-red-900/80 hover:bg-red-800 text-white cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                          <span className="text-[10px] font-semibold text-white capitalize bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                            {ref.viewType}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
