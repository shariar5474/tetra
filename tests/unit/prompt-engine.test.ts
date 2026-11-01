import { describe, it, expect } from 'vitest';
import { generateScenePrompts } from '../../src/engines/prompt-engine/prompt-generator';
import { StoryboardScene } from '../../src/shared/types/storyboard';
import { Character } from '../../src/shared/types/character';
import { Environment } from '../../src/shared/types/environment';

describe('Cinematic Prompt Engine', () => {
  it('generates all 5 prompt formats and respects character lock', () => {
    const mockCharacter: Character = {
      id: 'char-1',
      projectId: 'proj-1',
      name: 'Nantu',
      code: 'CHAR-001',
      description: 'Village shopkeeper',
      age: '32',
      gender: 'Male',
      faceShape: 'Oval',
      skinAppearance: 'Sun-warmed',
      eyes: 'Brown',
      hair: 'Short black',
      bodyType: 'Athletic',
      height: '5 ft 9 in',
      personality: 'Warm',
      speakingStyle: 'Chatgaiya',
      isLocked: true,
      references: [],
      costumes: [
        {
          id: 'cost-1',
          characterId: 'char-1',
          name: 'Blue Cotton Shirt',
          description: 'Unbuttoned collar',
          colorScheme: ['#3B82F6'],
          isDefault: true,
          sceneIdsApplied: [],
          approved: true,
        },
      ],
      createdAt: 0,
      updatedAt: 0,
    };

    const mockEnv: Environment = {
      id: 'env-1',
      projectId: 'proj-1',
      name: "Nantu's Village Shop",
      code: 'ENV-001',
      description: 'Rustic grocery shop',
      locationType: 'interior',
      architecture: 'Tin roof wooden shelves',
      furnitureAndDecor: 'Counter and wooden bench',
      keyProps: ['Tea glasses'],
      lightingMood: 'Golden afternoon',
      colorPalette: ['#F59E0B'],
      defaultTime: 'day',
      defaultWeather: 'sunny',
      isLocked: true,
      references: [],
      createdAt: 0,
      updatedAt: 0,
    };

    const mockScene: StoryboardScene = {
      id: 'scene-1',
      projectId: 'proj-1',
      sceneNumber: 1,
      title: 'Arrival at Shop',
      description: 'Nantu wipes the counter',
      dialogue: 'ও ভাই রহিম! হনডে যার?',
      action: 'Nantu wipes the glass counter and smiles.',
      emotionalTone: 'Warm & welcoming',
      characterIds: ['char-1'],
      environmentId: 'env-1',
      cameraAngle: 'medium_shot',
      cameraMovement: 'slow_pan',
      lightingMood: 'Golden afternoon',
      timeOfDay: 'Day',
      weather: 'Sunny',
      durationSeconds: 5,
      storyboardImageApproved: false,
      prompts: {
        shortPrompt: '',
        detailedPrompt: '',
        flowPrompt: '',
        apiPrompt: '',
        manualCopyPrompt: '',
        negativePrompt: '',
      },
      videoApproved: false,
      continuityNotes: 'First scene',
      status: 'draft',
      order: 1,
      createdAt: 0,
      updatedAt: 0,
    };

    const prompts = generateScenePrompts({
      scene: mockScene,
      projectSettings: {
        aspectRatio: '16:9',
        resolution: '1080p',
        fps: 30,
        targetDurationMinutes: 5,
        visualStyle: 'Ultra-realistic 35mm film',
        genre: 'Cinematic Drama',
        language: 'bn',
      },
      characters: [mockCharacter],
      environment: mockEnv,
    });

    expect(prompts.shortPrompt).toBeDefined();
    expect(prompts.detailedPrompt).toContain('LOCKED IDENTITY');
    expect(prompts.detailedPrompt).toContain('Nantu');
    expect(prompts.flowPrompt).toBeDefined();
    expect(prompts.apiPrompt).toContain('CHAR-001');
    expect(prompts.negativePrompt).toContain('No unintended face mutations');
    expect(prompts.manualCopyPrompt).toBeDefined();
  });
});
