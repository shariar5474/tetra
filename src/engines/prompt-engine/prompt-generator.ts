import { StoryboardScene, ScenePrompts } from '../../shared/types/storyboard';
import { Character } from '../../shared/types/character';
import { Environment } from '../../shared/types/environment';
import { ProjectSettings } from '../../shared/types/project';

export interface PromptGenerationInput {
  scene: StoryboardScene;
  projectSettings: ProjectSettings;
  characters: Character[];
  environment?: Environment;
  previousScene?: StoryboardScene;
}

export function generateScenePrompts(input: PromptGenerationInput): ScenePrompts {
  const { scene, projectSettings, characters, environment, previousScene } = input;

  // 1. Global Visual Style
  const globalStyle = projectSettings.visualStyle || 'Ultra-realistic cinematic film, 35mm anamorphic lens, 8k resolution, master color grading';

  // 2. Character Descriptions & Identity Anchors
  const activeCharacters = characters.filter(c => scene.characterIds.includes(c.id));
  const characterDescriptions = activeCharacters.map(char => {
    const costumeId = scene.characterCostumeMap?.[char.id] || char.activeCostumeId;
    const costume = char.costumes.find(c => c.id === costumeId) || char.costumes[0];
    const costumeDesc = costume ? `${costume.name} (${costume.description})` : 'Signature approved wardrobe';
    const lockNote = char.isLocked ? `[LOCKED IDENTITY: Exact facial structure, ${char.skinAppearance}, ${char.hair}, ${char.age}]` : '';

    return `${char.name} (${char.code}): ${char.description}. ${lockNote}. Wearing: ${costumeDesc}`;
  }).join('; ');

  // 3. Environment & Location
  const envDesc = environment
    ? `${environment.name} (${environment.code}): ${environment.description}. Architecture: ${environment.architecture}. Props: ${environment.keyProps.join(', ')}. Lighting: ${environment.lightingMood}. Weather: ${environment.defaultWeather}, Time: ${environment.defaultTime}.`
    : `${scene.lightingMood}, ${scene.timeOfDay}`;

  // 4. Camera & Shot
  const cameraShot = `${scene.cameraAngle.replace(/_/g, ' ')}, ${scene.cameraMovement.replace(/_/g, ' ')} movement, cinematic depth of field, photorealistic composition`;

  // 5. Lighting & Atmosphere
  const lighting = `${scene.lightingMood || 'Atmospheric natural cinematic lighting'}, ${scene.timeOfDay || 'daytime'}`;

  // 6. Action & Dialogue
  const action = scene.action || 'Characters engaged in purposeful cinematic scene';
  const dialogue = scene.dialogue ? `Dialogue (preserve spoken cadence): "${scene.dialogue}"` : '';

  // 7. Continuity
  const continuity = previousScene
    ? `CONTINUITY: Seamless transition from Scene ${previousScene.sceneNumber}. Maintain exact costume, background placement, character facial identity, and spatial layout from preceding scene.`
    : 'CONTINUITY: Establishing scene. Lock character facial anchors and environment architecture for subsequent scenes.';

  // 8. Negative Constraints
  const negativePrompt = 'No unintended face mutations, no morphing features, no extra limbs, no random costume alterations, no inconsistent background architecture, no cartoonish rendering, no text overlay watermark, no distorted anatomy, no sudden lighting shifts.';

  // Format 1: Detailed Master Cinematic Prompt
  const detailedPrompt = `[GLOBAL STYLE]: ${globalStyle}
[SCENE TITLE]: Scene ${scene.sceneNumber} - ${scene.title}
[CHARACTERS]: ${characterDescriptions || 'None'}
[ENVIRONMENT]: ${envDesc}
[ACTION]: ${action}
${dialogue ? `[DIALOGUE]: ${dialogue}\n` : ''}[CAMERA]: ${cameraShot}
[LIGHTING & ATMOSPHERE]: ${lighting}
[${continuity}]
[NEGATIVE CONSTRAINTS]: ${negativePrompt}`;

  // Format 2: Flow Prompt (Concise, highly weighted for Google Flow input field)
  const primaryChar = activeCharacters[0];
  const flowPrompt = `${globalStyle}. ${scene.cameraAngle.replace(/_/g, ' ')}. ${action}. ${primaryChar ? `${primaryChar.name}, ${primaryChar.description}, wearing ${primaryChar.costumes[0]?.name || 'approved costume'}.` : ''} Set in ${environment ? environment.name : 'cinematic setting'}, ${lighting}. Photorealistic 35mm film still, sharp focus, continuous cinematic movement.`;

  // Format 3: Short Prompt
  const shortPrompt = `${scene.cameraAngle.replace(/_/g, ' ')} of ${activeCharacters.map(c => c.name).join(' and ') || 'scene'}. ${action}. ${environment ? environment.name : ''}. 35mm cinematic film style.`;

  // Format 4: Official API Prompt (Structured JSON-friendly prompt)
  const apiPrompt = JSON.stringify({
    style: globalStyle,
    action,
    characters: activeCharacters.map(c => ({ code: c.code, name: c.name, locked: c.isLocked })),
    environment: environment ? environment.code : undefined,
    camera: { angle: scene.cameraAngle, movement: scene.cameraMovement },
    duration_seconds: scene.durationSeconds,
    negative_prompt: negativePrompt,
  }, null, 2);

  // Format 5: Manual Copy Prompt (Clean one-click copy block for human clipboard into Flow UI)
  const manualCopyPrompt = `Cinematic ${scene.cameraAngle.replace(/_/g, ' ')}: ${action}.
Characters: ${characterDescriptions || 'Actors in natural poses'}.
Setting: ${envDesc}.
Camera & Motion: ${cameraShot}. Natural lighting, seamless cinematic motion, 4k ultra-detailed realism.`;

  return {
    shortPrompt,
    detailedPrompt,
    flowPrompt,
    apiPrompt,
    manualCopyPrompt,
    negativePrompt,
  };
}
