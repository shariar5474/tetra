import { describe, it, expect } from 'vitest';
import { checkSceneContinuity } from '../../src/engines/continuity-engine/continuity-checker';
import { StoryboardScene } from '../../src/shared/types/storyboard';
import { Character } from '../../src/shared/types/character';
import { Environment } from '../../src/shared/types/environment';

describe('Continuity Checker Engine', () => {
  it('detects unlocked character profiles and assigns realistic score deductions', () => {
    const unlockedChar: Character = {
      id: 'char-1',
      projectId: 'proj-1',
      name: 'Rahim',
      code: 'CHAR-002',
      description: 'Friend',
      age: '28',
      gender: 'Male',
      faceShape: 'Round',
      skinAppearance: 'Medium',
      eyes: 'Black',
      hair: 'Short',
      bodyType: 'Slim',
      height: '5 ft 7 in',
      personality: 'Humorous',
      speakingStyle: 'Chatgaiya',
      isLocked: false, // NOT locked
      references: [],
      costumes: [],
      createdAt: 0,
      updatedAt: 0,
    };

    const mockScene: StoryboardScene = {
      id: 'scene-1',
      projectId: 'proj-1',
      sceneNumber: 1,
      title: 'Scene 1',
      description: 'Test',
      dialogue: '',
      action: 'Test action',
      emotionalTone: '',
      characterIds: ['char-1'],
      environmentId: 'env-1',
      cameraAngle: 'wide_shot',
      cameraMovement: 'static',
      lightingMood: 'Day',
      timeOfDay: 'Day',
      weather: 'Clear',
      durationSeconds: 5,
      storyboardImageApproved: false,
      prompts: {} as any,
      videoApproved: false,
      continuityNotes: '',
      status: 'draft',
      order: 1,
      createdAt: 0,
      updatedAt: 0,
    };

    const env: Environment = {
      id: 'env-1',
      projectId: 'proj-1',
      name: 'Village Shop',
      code: 'ENV-001',
      description: '',
      locationType: 'interior',
      architecture: '',
      furnitureAndDecor: '',
      keyProps: [],
      lightingMood: '',
      colorPalette: [],
      defaultTime: 'day',
      defaultWeather: 'sunny',
      isLocked: true,
      references: [],
      createdAt: 0,
      updatedAt: 0,
    };

    const report = checkSceneContinuity(mockScene, undefined, [unlockedChar], [env]);
    expect(report.score).toBeLessThan(100);
    expect(report.warnings.some((w) => w.includes('NOT locked'))).toBe(true);
  });
});
