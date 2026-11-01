import { getDB } from './indexeddb';
import { Project, ProjectSettings } from '../shared/types/project';
import { ScriptDocument } from '../shared/types/script';
import { Character, CharacterReferenceImage, CharacterCostume } from '../shared/types/character';
import { Environment, EnvironmentReferenceImage } from '../shared/types/environment';
import { StoryboardScene } from '../shared/types/storyboard';
import { VideoTimeline } from '../shared/types/editor';
import { generateId } from '../shared/utils/helpers';

export async function getAllProjects(): Promise<Project[]> {
  const db = await getDB();
  const projects = await db.getAllFromIndex('projects', 'by-date');
  return projects.reverse();
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const db = await getDB();
  return db.get('projects', id);
}

export async function createProject(params: {
  name: string;
  description?: string;
  settings?: Partial<ProjectSettings>;
}): Promise<Project> {
  const db = await getDB();
  const id = generateId('proj');
  const now = Date.now();

  const project: Project = {
    id,
    name: params.name || 'Untitled Cinematic Movie',
    description: params.description || '',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    settings: {
      aspectRatio: params.settings?.aspectRatio || '16:9',
      resolution: params.settings?.resolution || '1080p',
      fps: params.settings?.fps || 30,
      targetDurationMinutes: params.settings?.targetDurationMinutes || 5,
      visualStyle: params.settings?.visualStyle || 'Ultra-realistic cinematic film, 35mm anamorphic lens, natural lighting, professional grading',
      genre: params.settings?.genre || 'Cinematic Drama',
      language: params.settings?.language || 'en',
      dialect: params.settings?.dialect || '',
      ...params.settings,
    },
    stats: {
      totalScenes: 0,
      completedScenes: 0,
      totalCharacters: 0,
      totalEnvironments: 0,
      totalDurationSeconds: 0,
    },
  };

  await db.put('projects', project);

  // Initialize empty script
  const script: ScriptDocument = {
    id: generateId('script'),
    projectId: id,
    rawText: '',
    wordCount: 0,
    updatedAt: now,
  };
  await db.put('scripts', script);

  // Initialize empty timeline
  const timeline: VideoTimeline = {
    id: generateId('timeline'),
    projectId: id,
    videoClips: [],
    audioClips: [],
    subtitles: [],
    subtitleStyle: {
      fontFamily: 'Inter, sans-serif',
      fontSize: 24,
      color: '#FFFFFF',
      backgroundColor: 'rgba(0,0,0,0.6)',
      outlineColor: '#000000',
      outlineWidth: 2,
      position: 'bottom',
      burnIn: true,
    },
    totalDurationSeconds: 0,
    updatedAt: now,
  };
  await db.put('video_timelines', timeline);

  return project;
}

export async function updateProject(project: Project): Promise<void> {
  const db = await getDB();
  project.updatedAt = Date.now();
  await db.put('projects', project);
}

export async function deleteProject(projectId: string): Promise<void> {
  const db = await getDB();
  await db.delete('projects', projectId);

  // Clean related items
  const scripts = await db.getAllFromIndex('scripts', 'by-project', projectId);
  for (const s of scripts) await db.delete('scripts', s.id);

  const characters = await db.getAllFromIndex('characters', 'by-project', projectId);
  for (const c of characters) {
    await db.delete('characters', c.id);
    const refs = await db.getAllFromIndex('character_references', 'by-character', c.id);
    for (const r of refs) await db.delete('character_references', r.id);
    const costumes = await db.getAllFromIndex('character_costumes', 'by-character', c.id);
    for (const cost of costumes) await db.delete('character_costumes', cost.id);
  }

  const environments = await db.getAllFromIndex('environments', 'by-project', projectId);
  for (const e of environments) {
    await db.delete('environments', e.id);
    const refs = await db.getAllFromIndex('environment_references', 'by-environment', e.id);
    for (const r of refs) await db.delete('environment_references', r.id);
  }

  const scenes = await db.getAllFromIndex('storyboard_scenes', 'by-project', projectId);
  for (const sc of scenes) await db.delete('storyboard_scenes', sc.id);

  const timelines = await db.getAllFromIndex('video_timelines', 'by-project', projectId);
  for (const t of timelines) await db.delete('video_timelines', t.id);

  const jobs = await db.getAllFromIndex('generation_jobs', 'by-project', projectId);
  for (const j of jobs) await db.delete('generation_jobs', j.id);
}

// Script methods
export async function getScript(projectId: string): Promise<ScriptDocument | undefined> {
  const db = await getDB();
  const scripts = await db.getAllFromIndex('scripts', 'by-project', projectId);
  return scripts[0];
}

export async function saveScript(script: ScriptDocument): Promise<void> {
  const db = await getDB();
  script.updatedAt = Date.now();
  await db.put('scripts', script);
}

// Character methods
export async function getCharacters(projectId: string): Promise<Character[]> {
  const db = await getDB();
  const chars = await db.getAllFromIndex('characters', 'by-project', projectId);
  for (const c of chars) {
    c.references = await db.getAllFromIndex('character_references', 'by-character', c.id);
    c.costumes = await db.getAllFromIndex('character_costumes', 'by-character', c.id);
  }
  return chars;
}

export async function saveCharacter(character: Character): Promise<void> {
  const db = await getDB();
  character.updatedAt = Date.now();
  await db.put('characters', character);

  // Sync references: clean up deleted references
  const existingRefs = await db.getAllFromIndex('character_references', 'by-character', character.id);
  const currentRefIds = new Set((character.references || []).map((r) => r.id));
  for (const er of existingRefs) {
    if (!currentRefIds.has(er.id)) {
      await db.delete('character_references', er.id);
    }
  }
  if (character.references) {
    for (const ref of character.references) {
      await db.put('character_references', ref);
    }
  }

  // Sync costumes: clean up deleted costumes
  const existingCostumes = await db.getAllFromIndex('character_costumes', 'by-character', character.id);
  const currentCostumeIds = new Set((character.costumes || []).map((c) => c.id));
  for (const ec of existingCostumes) {
    if (!currentCostumeIds.has(ec.id)) {
      await db.delete('character_costumes', ec.id);
    }
  }
  if (character.costumes) {
    for (const costume of character.costumes) {
      await db.put('character_costumes', costume);
    }
  }
}

export async function deleteCharacter(characterId: string): Promise<void> {
  const db = await getDB();
  await db.delete('characters', characterId);
  const refs = await db.getAllFromIndex('character_references', 'by-character', characterId);
  for (const r of refs) await db.delete('character_references', r.id);
  const costumes = await db.getAllFromIndex('character_costumes', 'by-character', characterId);
  for (const c of costumes) await db.delete('character_costumes', c.id);
}

// Environment methods
export async function getEnvironments(projectId: string): Promise<Environment[]> {
  const db = await getDB();
  const envs = await db.getAllFromIndex('environments', 'by-project', projectId);
  for (const e of envs) {
    e.references = await db.getAllFromIndex('environment_references', 'by-environment', e.id);
  }
  return envs;
}

export async function saveEnvironment(environment: Environment): Promise<void> {
  const db = await getDB();
  environment.updatedAt = Date.now();
  await db.put('environments', environment);

  // Sync references: clean up deleted references
  const existingRefs = await db.getAllFromIndex('environment_references', 'by-environment', environment.id);
  const currentRefIds = new Set((environment.references || []).map((r) => r.id));
  for (const er of existingRefs) {
    if (!currentRefIds.has(er.id)) {
      await db.delete('environment_references', er.id);
    }
  }
  if (environment.references) {
    for (const ref of environment.references) {
      await db.put('environment_references', ref);
    }
  }
}

export async function deleteEnvironment(environmentId: string): Promise<void> {
  const db = await getDB();
  await db.delete('environments', environmentId);
  const refs = await db.getAllFromIndex('environment_references', 'by-environment', environmentId);
  for (const r of refs) await db.delete('environment_references', r.id);
}

// Storyboard Scene methods
export async function getScenes(projectId: string): Promise<StoryboardScene[]> {
  const db = await getDB();
  const scenes = await db.getAllFromIndex('storyboard_scenes', 'by-project', projectId);
  return scenes.sort((a, b) => a.order - b.order);
}

export async function saveScene(scene: StoryboardScene): Promise<void> {
  const db = await getDB();
  scene.updatedAt = Date.now();
  await db.put('storyboard_scenes', scene);
}

export async function replaceProjectScenes(projectId: string, scenes: StoryboardScene[]): Promise<void> {
  const db = await getDB();
  const existing = await db.getAllFromIndex('storyboard_scenes', 'by-project', projectId);
  for (const es of existing) {
    await db.delete('storyboard_scenes', es.id);
  }
  const tx = db.transaction('storyboard_scenes', 'readwrite');
  for (const s of scenes) {
    s.updatedAt = Date.now();
    await tx.store.put(s);
  }
  await tx.done;
}

export async function saveScenes(scenes: StoryboardScene[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('storyboard_scenes', 'readwrite');
  for (const s of scenes) {
    s.updatedAt = Date.now();
    await tx.store.put(s);
  }
  await tx.done;
}

export async function deleteScene(sceneId: string): Promise<void> {
  const db = await getDB();
  await db.delete('storyboard_scenes', sceneId);
}

// Video Timeline methods
export async function getTimeline(projectId: string): Promise<VideoTimeline | undefined> {
  const db = await getDB();
  const timelines = await db.getAllFromIndex('video_timelines', 'by-project', projectId);
  return timelines[0];
}

export async function saveTimeline(timeline: VideoTimeline): Promise<void> {
  const db = await getDB();
  timeline.updatedAt = Date.now();
  await db.put('video_timelines', timeline);
}
