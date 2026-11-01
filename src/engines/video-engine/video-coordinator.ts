import { StoryboardScene } from '../../shared/types/storyboard';
import { GenerationJob, VideoProviderType } from '../../shared/types/job';
import { AIProviderConfig } from '../../shared/types/provider';
import { generateId } from '../../shared/utils/helpers';

export interface DispatchParams {
  scene: StoryboardScene;
  preferredProvider: VideoProviderType;
  availableProviders: AIProviderConfig[];
  prompt: string;
  referenceImages: string[];
}

export class VideoCoordinator {
  static createJobFromScene(params: DispatchParams): GenerationJob {
    const { scene, preferredProvider, prompt, referenceImages } = params;

    return {
      id: generateId('job'),
      projectId: scene.projectId,
      sceneId: scene.id,
      sceneTitle: `Scene ${scene.sceneNumber}: ${scene.title}`,
      provider: preferredProvider,
      model: preferredProvider === 'google_flow' ? 'Veo / Flow Studio' : 'Veo API',
      prompt,
      referenceImages,
      status: 'waiting',
      progressPercent: 0,
      statusMessage: 'Queued for generation dispatch...',
      retryCount: 0,
      maxRetries: 3,
      createdAt: Date.now(),
    };
  }

  static determineFallbackProvider(
    currentProvider: VideoProviderType,
    providers: AIProviderConfig[]
  ): AIProviderConfig | null {
    const enabled = providers.filter((p) => p.isEnabled && p.category === 'video');
    const alternatives = enabled.filter((p) => {
      if (currentProvider === 'google_flow') return p.id !== 'google-flow-primary';
      return true;
    });

    return alternatives.sort((a, b) => a.priority - b.priority)[0] || null;
  }
}
