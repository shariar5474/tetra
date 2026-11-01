import { StoryboardScene } from '../../shared/types/storyboard';
import { Character } from '../../shared/types/character';
import { Environment } from '../../shared/types/environment';

export interface ContinuityReport {
  score: number;
  status: 'passed' | 'warning' | 'failed' | 'needs_review';
  checks: {
    characterConsistency: { passed: boolean; details: string };
    environmentConsistency: { passed: boolean; details: string };
    costumePreservation: { passed: boolean; details: string };
    lightingContinuity: { passed: boolean; details: string };
    narrativePacing: { passed: boolean; details: string };
  };
  warnings: string[];
  recommendations: string[];
}

export function checkSceneContinuity(
  currentScene: StoryboardScene,
  previousScene: StoryboardScene | undefined,
  characters: Character[],
  environments: Environment[]
): ContinuityReport {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // 1. Character Check
  const activeChars = characters.filter(c => currentScene.characterIds.includes(c.id));
  let charCheckPassed = true;
  let charDetails = 'All active characters have verified identity profiles.';

  if (activeChars.length === 0 && currentScene.characterIds.length > 0) {
    charCheckPassed = false;
    score -= 25;
    warnings.push('Unresolved character IDs assigned to scene.');
    recommendations.push('Re-link character profiles in Character Studio.');
  }

  // Check character lock status
  const unlockedChars = activeChars.filter(c => !c.isLocked);
  if (unlockedChars.length > 0) {
    score -= 10;
    warnings.push(`${unlockedChars.map(c => c.name).join(', ')} character profile is NOT locked. Identity drift may occur during generation.`);
    recommendations.push('Click LOCK on character card to enforce identity preservation across scenes.');
  }

  // Check if characters have face reference images
  for (const char of activeChars) {
    if (!char.references || char.references.length === 0) {
      score -= 15;
      warnings.push(`Character "${char.name}" has no face reference image uploaded.`);
      recommendations.push(`Upload at least 1 clear front face reference for ${char.name}.`);
    }
  }

  // 2. Costume Preservation Check
  let costumePassed = true;
  let costumeDetails = 'Costumes are consistently assigned.';

  if (previousScene) {
    const sharedCharIds = currentScene.characterIds.filter(id => previousScene.characterIds.includes(id));
    for (const charId of sharedCharIds) {
      const prevCostume = previousScene.characterCostumeMap?.[charId];
      const curCostume = currentScene.characterCostumeMap?.[charId];
      if (prevCostume && curCostume && prevCostume !== curCostume) {
        costumePassed = false;
        score -= 15;
        const char = characters.find(c => c.id === charId);
        warnings.push(`Character "${char?.name || charId}" abruptly changes costume between Scene ${previousScene.sceneNumber} and Scene ${currentScene.sceneNumber}.`);
        recommendations.push(`Confirm if costume change was intentional, or version the costume in Character Studio.`);
      }
    }
  }

  // 3. Environment Check
  let envPassed = true;
  let envDetails = 'Environment anchored properly.';
  const env = environments.find(e => e.id === currentScene.environmentId);

  if (!env) {
    score -= 15;
    envPassed = false;
    warnings.push('No formal environment profile linked to scene.');
    recommendations.push('Select or create an environment in Environment Studio.');
  } else if (!env.isLocked) {
    score -= 5;
    warnings.push(`Environment "${env.name}" is not locked. Background architecture may vary.`);
    recommendations.push('Lock environment to preserve props and architectural layout.');
  }

  // 4. Lighting Continuity Check
  let lightPassed = true;
  let lightDetails = 'Lighting aligns with scene time.';

  if (previousScene && currentScene.environmentId === previousScene.environmentId) {
    if (previousScene.timeOfDay !== currentScene.timeOfDay && Math.abs(currentScene.sceneNumber - previousScene.sceneNumber) === 1) {
      score -= 10;
      lightPassed = false;
      warnings.push(`Sudden shift from ${previousScene.timeOfDay} to ${currentScene.timeOfDay} in the same location.`);
      recommendations.push('Add an explicit time-lapse transition or align time of day.');
    }
  }

  // 5. Narrative Pacing Check
  let pacingPassed = true;
  let pacingDetails = 'Scene duration and pacing are within standard cinematic parameters.';

  if (currentScene.durationSeconds < 2) {
    score -= 10;
    pacingPassed = false;
    warnings.push('Scene duration is under 2 seconds; may cause jarring cuts.');
    recommendations.push('Increase scene duration to at least 4 seconds for AI video stability.');
  } else if (currentScene.durationSeconds > 15) {
    score -= 10;
    pacingPassed = false;
    warnings.push('Scene duration exceeds 15 seconds; single AI shots may lose consistency.');
    recommendations.push('Split long scene into multiple shot cards.');
  }

  // Bound score
  score = Math.max(0, Math.min(100, score));

  let status: 'passed' | 'warning' | 'failed' | 'needs_review' = 'passed';
  if (score < 50) status = 'failed';
  else if (score < 75) status = 'warning';
  else if (score < 90) status = 'needs_review';

  return {
    score,
    status,
    checks: {
      characterConsistency: { passed: charCheckPassed, details: charDetails },
      environmentConsistency: { passed: envPassed, details: envDetails },
      costumePreservation: { passed: costumePassed, details: costumeDetails },
      lightingContinuity: { passed: lightPassed, details: lightDetails },
      narrativePacing: { passed: pacingPassed, details: pacingDetails },
    },
    warnings,
    recommendations,
  };
}
