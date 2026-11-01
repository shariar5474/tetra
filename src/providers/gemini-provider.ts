import { ScriptAnalysisResult } from '../shared/types/script';
import { analyzeScriptHeuristic } from '../engines/script-engine/script-analyzer';

export async function analyzeScriptWithGemini(
  rawScript: string,
  apiKey?: string
): Promise<ScriptAnalysisResult> {
  if (!apiKey || apiKey.trim().length === 0) {
    // Graceful, instant, local-first heuristic analysis
    return analyzeScriptHeuristic(rawScript);
  }

  try {
    const prompt = `Analyze this screenplay or story for a cinematic film production.
Return ONLY valid JSON matching this schema:
{
  "storyArc": {
    "title": "string",
    "genre": "string",
    "logline": "string",
    "theme": "string",
    "beginning": "string",
    "incitingIncident": "string",
    "risingAction": "string",
    "climax": "string",
    "resolution": "string"
  },
  "characters": [
    {
      "name": "string",
      "identity": "string",
      "apparentAge": "string",
      "personality": "string",
      "keyAppearance": "string",
      "costume": "string",
      "speakingStyle": "string",
      "relationships": "string"
    }
  ],
  "locations": [
    {
      "name": "string",
      "description": "string",
      "interiorExterior": "INT" | "EXT" | "INT/EXT",
      "lighting": "string",
      "weather": "string",
      "timeOfDay": "Day" | "Night" | "Morning" | "Evening" | "Golden Hour",
      "keyProps": ["string"]
    }
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "string",
      "locationName": "string",
      "timeOfDay": "string",
      "characterNames": ["string"],
      "actionDescription": "string",
      "dialogueSnippet": "string",
      "emotionalTone": "string",
      "suggestedShot": "string",
      "estimatedDurationSeconds": 5
    }
  ],
  "detectedLanguage": "string",
  "dialectDetected": "string"
}

IMPORTANT: Preserve original character dialogue verbatim. If Chittagong/Chatgaiya dialect is used, DO NOT translate or standardize regional vocabulary.

SCRIPT:
${rawScript.slice(0, 15000)}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!response.ok) {
      console.warn('Gemini API call failed, falling back to local heuristic analyzer');
      return analyzeScriptHeuristic(rawScript);
    }

    const data = await response.json();
    const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOutput) return analyzeScriptHeuristic(rawScript);

    const parsed = JSON.parse(textOutput);
    return {
      ...parsed,
      chunkCount: 1,
      analyzedAt: Date.now(),
    };
  } catch (err) {
    console.error('Error in analyzeScriptWithGemini:', err);
    return analyzeScriptHeuristic(rawScript);
  }
}
