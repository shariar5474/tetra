// CineForge AI - Script Studio Story Analyzer Engine
// Intelligent screenplay parsing, character extraction, location detection, and story arc modeling.

import {
  ScriptDocument,
  ScriptAnalysisResult,
  ScriptStoryArc,
  ExtractedCharacter,
  ExtractedLocation,
  ExtractedScene,
} from '../../shared/types/script';

export function detectLanguageAndDialect(text: string): { language: 'bn' | 'en'; dialect?: string } {
  const bengaliRegex = /[\u0980-\u09FF]/;
  const isBengali = bengaliRegex.test(text);

  if (!isBengali) {
    return { language: 'en', dialect: 'standard' };
  }

  // Detect Chittagong / Chatgaiya dialect markers
  const chatgaiyaKeywords = [
    'হনডে', 'আঁর', 'অনরে', 'খাইস্যননি', 'গম', 'আছননি', 'বেয়াইগ্গুন',
    'যাইর', 'আইস্যে', 'এক্কানা', 'বয়', 'হতা', 'খাইবা', 'ফুয়া', 'মাইয়া',
    'গরি', 'লাইগ্যি', 'আঁই', 'অনর', 'তুঁই', 'কেনেক্কা', 'বাচি',
  ];

  const lower = text.toLowerCase();
  const matchCount = chatgaiyaKeywords.filter(k => lower.includes(k)).length;

  if (matchCount >= 2) {
    return { language: 'bn', dialect: 'bn-ctg (Chittagong / Chatgaiya)' };
  }

  return { language: 'bn', dialect: 'bn-standard (Standard Bengali)' };
}

export function chunkScript(text: string, maxChunkLength = 3000): string[] {
  if (text.length <= maxChunkLength) return [text];

  const paragraphs = text.split('\n\n');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const p of paragraphs) {
    if ((currentChunk + '\n\n' + p).length > maxChunkLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = p;
    } else {
      currentChunk = currentChunk ? `${currentChunk}\n\n${p}` : p;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [text];
}

const INVALID_NAME_KEYWORDS = [
  'INT', 'EXT', 'SCENE', 'FADE', 'CUT', 'TIME', 'DAY', 'NIGHT', 'LOCATION',
  'TOTAL DURATION', 'DURATION', 'ASPECT RATIO', 'ASPECT_RATIO', 'RATIO',
  'GENRE', 'LANGUAGE', 'FPS', 'RESOLUTION', 'FORMAT', 'CAMERA', 'AUDIO',
  'SFX', 'MUSIC', 'PROMPT', 'SETTING', 'SHOT', 'LIGHTING', 'TITLE', 'NOTE',
  'TAGLINE', 'STYLE', 'YEAR', 'CONTINUOUS', 'MOMENTS LATER', 'AFTERNOON',
  'MORNING', 'EVENING', 'PROTAGONIST', 'SUPPORTING', 'SETUP', 'CLIMAX',
  'চরিত্র', 'চরিত্রসমূহ', 'চরিত্রাবলি', 'পাত্র-পাত্রী', 'পাত্রপাত্রী',
  'দৃশ্য', 'দৃশ্যপট', 'স্থান', 'সময়', 'শিরোনাম', 'লোকেশন', 'ক্যামেরা',
  'সংলাপ', 'ভূমিকা', 'বর্ণনা'
];

function isMetadataLine(line: string): boolean {
  const upper = line.toUpperCase().trim();
  if (/^(#|\*\*|---|===)/.test(line.trim())) return true;
  return INVALID_NAME_KEYWORDS.some(kw => upper.startsWith(kw + ':') || upper.startsWith(kw + ' '));
}

export function analyzeScriptHeuristic(text: string): ScriptAnalysisResult {
  const { language, dialect } = detectLanguageAndDialect(text);
  const chunks = chunkScript(text);

  const rawLines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Extract Title cleanly
  let title = 'Cinematic Story';
  const titleLine = rawLines.find(l => /^title\s*:/i.test(l)) || rawLines[0];
  if (titleLine) {
    title = titleLine
      .replace(/^title\s*:\s*/i, '')
      .replace(/^[#*_~\s]+|[#*_~\s]+$/g, '')
      .trim()
      .slice(0, 60);
  }

  // 2. Character Extraction
  const characterMap = new Map<string, { count: number; sampleLines: string[]; age?: string }>();

  const addCharacter = (name: string, sampleLine = '', age?: string) => {
    let clean = name.replace(/^[#*_~"'\s]+|[#*_~"'\s]+$/g, '').trim();
    // Remove (Age) if in name
    clean = clean.replace(/\s*\([০-৯0-9\s]+\)/g, '').trim();
    if (clean.length < 2 || clean.length > 25) return;
    const upper = clean.toUpperCase();
    if (INVALID_NAME_KEYWORDS.some(kw => upper.includes(kw))) return;

    const existing = characterMap.get(clean) || { count: 0, sampleLines: [], age };
    existing.count += 1;
    if (age && !existing.age) existing.age = age;
    const cleanDialogue = sampleLine.replace(/^[#*_~"'\s]+|[#*_~"'\s]+$/g, '').trim();
    if (cleanDialogue && existing.sampleLines.length < 3 && !isMetadataLine(cleanDialogue)) {
      existing.sampleLines.push(cleanDialogue);
    }
    characterMap.set(clean, existing);
  };

  // Iterate line by line to detect:
  // A) Prose introductions with age: তানভীর (৩২) or রুমানা (২৮)
  // B) Standard Screenplay Speaker cues (short standalone line followed by dialogue)
  // C) Colon dialogues: NAME: Dialogue
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (isMetadataLine(line)) continue;

    // A) Prose introduction: তানভীর (৩২) or Alex (32)
    const introMatches = line.matchAll(/([A-Za-z\u0980-\u09FF]{2,20})\s*\(([০-৯0-9]{1,3})\)/g);
    for (const m of introMatches) {
      if (!INVALID_NAME_KEYWORDS.some(kw => m[1].toUpperCase().includes(kw))) {
        addCharacter(m[1], '', m[2]);
      }
    }

    // B) Colon dialogue: NAME: Dialogue
    if (line.includes(':')) {
      const parts = line.split(':');
      const speaker = parts[0].trim();
      const dialogue = parts.slice(1).join(':').trim();
      if (speaker.length >= 2 && speaker.length <= 25 && !INVALID_NAME_KEYWORDS.some(kw => speaker.toUpperCase().includes(kw))) {
        addCharacter(speaker, dialogue);
        continue;
      }
    }

    // C) Standalone Speaker Cue (Screenplay format: Name on line, next lines are dialogue or parenthetical)
    const isHeading = /^(?:INT\.|EXT\.|SCENE|দৃশ্য)/i.test(line);
    const isShortCue = line.length >= 2 && line.length <= 25 && !line.includes('.') && !line.includes(':') && !line.startsWith('(') && !line.includes('(');

    if (isShortCue && !isHeading && !INVALID_NAME_KEYWORDS.some(kw => line.toUpperCase().includes(kw))) {
      let nextIdx = i + 1;
      while (nextIdx < rawLines.length && !rawLines[nextIdx]) nextIdx++;
      if (nextIdx < rawLines.length) {
        const nextLine = rawLines[nextIdx];
        if (!/^(?:INT\.|EXT\.|SCENE|দৃশ্য)/i.test(nextLine) && !isMetadataLine(nextLine)) {
          let dialogueLine = nextLine;
          if (nextLine.startsWith('(')) {
            // Parenthetical, look for line after
            let dIdx = nextIdx + 1;
            while (dIdx < rawLines.length && !rawLines[dIdx]) dIdx++;
            if (dIdx < rawLines.length && !/^(?:INT\.|EXT\.|SCENE|দৃশ্য)/i.test(rawLines[dIdx])) {
              dialogueLine = rawLines[dIdx];
            }
          }
          addCharacter(line, dialogueLine);
        }
      }
    }
  }

  // Fallback characters if none detected
  if (characterMap.size === 0) {
    const defaultCharacters = language === 'bn' 
      ? ['তানভীর (Tanvir)', 'রুমানা (Rumana)']
      : ['Alex', 'Marcus'];
    for (const dName of defaultCharacters) {
      characterMap.set(dName, { count: 1, sampleLines: [] });
    }
  }

  const characters: ExtractedCharacter[] = Array.from(characterMap.entries())
    .slice(0, 8)
    .map(([name, data]) => {
      const isLead = data.count > 1;
      return {
        name,
        identity: isLead ? 'Protagonist / Lead Character' : 'Supporting Character',
        apparentAge: data.age ? `${data.age}s` : '30s',
        personality: 'Determined, expressive, authentic to the cinematic context',
        keyAppearance: 'Authentic cinematic styling, distinctive facial features, expressive eyes',
        costume: 'Traditional or contemporary regional attire, well-worn texture',
        speakingStyle: dialect?.includes('ctg') ? 'Authentic Chittagonian cadence' : 'Naturalistic conversational dialogue',
        relationships: 'Interacts with household and community',
      };
    });

  // 3. Location Extraction
  const locationRegex = /(?:INT\.|EXT\.|LOCATION:|দৃশ্য\s*[০-৯0-9]*\s*[:\s-])\s*([^\n\r-]+)(?:-\s*([^\n\r]+))?/gi;
  const locationList: ExtractedLocation[] = [];
  let locMatch: RegExpExecArray | null;

  while ((locMatch = locationRegex.exec(text)) !== null) {
    let locName = locMatch[1].trim();
    locName = locName.replace(/^দৃশ্য\s*[০-৯0-9]*\s*[:\s-]*/i, '').trim();
    if (locName.length >= 2 && !INVALID_NAME_KEYWORDS.some(kw => locName.toUpperCase().includes(kw))) {
      const timeOfDay = locMatch[2]?.trim() || 'Day';
      if (!locationList.some(l => l.name.toLowerCase() === locName.toLowerCase())) {
        locationList.push({
          name: locName,
          description: `Cinematic setting at ${locName}`,
          interiorExterior: text.includes(`INT. ${locName}`) ? 'INT' : 'EXT',
          lighting: timeOfDay.toLowerCase().includes('night') ? 'Cinematic low-key moonlight' : 'Natural golden daylight',
          weather: 'Clear atmosphere with soft natural light',
          timeOfDay: timeOfDay.toLowerCase().includes('night') ? 'Night' : 'Day',
          keyProps: ['Wooden furniture', 'Everyday regional items', 'Ambient room lighting'],
        });
      }
    }
  }

  if (locationList.length === 0) {
    locationList.push({
      name: language === 'bn' ? 'লিভিং রুম (Living Room)' : 'Modern Living Room',
      description: 'A cozy, authentic home interior with warm natural lighting and lived-in atmosphere.',
      interiorExterior: 'INT',
      lighting: 'Atmospheric warm afternoon light',
      weather: 'Warm sunny day',
      timeOfDay: 'Day',
      keyProps: ['Comfortable sofa', 'Laptop', 'Tea glasses', 'Curtains'],
    });
  }

  // 4. Scene Extraction: Support INT., EXT., SCENE, and Bengali দৃশ্য ১:, দৃশ্য ২: etc.
  const sceneHeadingRegex = /(?:^|\n)\s*(INT\.|EXT\.|SCENE\s*\d*[:_.\s-]*|দৃশ্য\s*[০-৯0-9]*[:_.\s-]*)/gi;
  const headingIndices: { index: number; heading: string }[] = [];
  let hMatch: RegExpExecArray | null;

  while ((hMatch = sceneHeadingRegex.exec(text)) !== null) {
    headingIndices.push({ index: hMatch.index, heading: hMatch[0].trim() });
  }

  const scenes: ExtractedScene[] = [];
  const primaryCharNames = characters.map(c => c.name);

  if (headingIndices.length > 0) {
    for (let i = 0; i < headingIndices.length; i++) {
      const start = headingIndices[i].index;
      const end = i < headingIndices.length - 1 ? headingIndices[i + 1].index : text.length;
      const sectionText = text.slice(start, end).trim();
      const secLines = sectionText.split('\n').map(l => l.trim()).filter(Boolean);

      const headingLine = secLines[0] || `Scene ${i + 1}`;
      const contentLines = secLines.slice(1).filter(l => !isMetadataLine(l));

      // Determine location and time from heading
      let locName = locationList[i % Math.max(1, locationList.length)]?.name || 'লিভিং রুম (Living Room)';
      let timeOfDay = 'Day';

      const cleanHeading = headingLine
        .replace(/^(?:INT\.|EXT\.|SCENE\s*\d*|দৃশ্য\s*[০-৯0-9]*)\s*[:_.\s-]*/i, '')
        .trim();

      if (cleanHeading) {
        const parts = cleanHeading.split(/[-–—]/);
        if (parts[0]?.trim()) locName = parts[0].trim();
        if (parts[1]?.trim()) timeOfDay = parts[1].trim();
      }

      // Find action prose and dialogue
      let actionText = '';
      let dialogueSnippet = '';
      const sectionChars = new Set<string>();

      for (let j = 0; j < contentLines.length; j++) {
        const line = contentLines[j];
        if (line.startsWith('(')) continue; // skip parentheticals

        // Check for character name match
        const matchedChar = primaryCharNames.find(cn => line === cn || line.startsWith(cn + ':') || line.startsWith(cn + ' '));
        if (matchedChar) {
          sectionChars.add(matchedChar);
          if (line.includes(':')) {
            const cueSnippet = line.split(':').slice(1).join(':').replace(/^[#*_~"'\s]+|[#*_~"'\s]+$/g, '').trim();
            if (!dialogueSnippet) dialogueSnippet = cueSnippet;
          } else if (j + 1 < contentLines.length) {
            let nextLine = contentLines[j + 1];
            if (nextLine.startsWith('(') && j + 2 < contentLines.length) {
              nextLine = contentLines[j + 2];
            }
            const cueSnippet = nextLine.replace(/^[#*_~"'\s]+|[#*_~"'\s]+$/g, '').trim();
            if (!dialogueSnippet) dialogueSnippet = cueSnippet;
          }
        } else if (!actionText && line.length > 5 && !isMetadataLine(line)) {
          actionText = line;
        }
      }

      if (!actionText && contentLines.length > 0) {
        actionText = contentLines.slice(0, 2).join(' ');
      }
      if (!actionText) {
        actionText = `Characters interact in the ${locName}.`;
      }

      const assignedChars = Array.from(sectionChars);

      scenes.push({
        sceneNumber: i + 1,
        title: `Scene ${i + 1}: ${locName}`,
        locationName: locName,
        timeOfDay: timeOfDay || 'Day',
        characterNames: assignedChars.length > 0 ? assignedChars : primaryCharNames.slice(0, 2),
        actionDescription: actionText.replace(/^[#*_~\s]+|[#*_~\s]+$/g, '').slice(0, 220),
        dialogueSnippet: dialogueSnippet.slice(0, 160),
        emotionalTone: i === 0 ? 'Intriguing Setup' : i === headingIndices.length - 1 ? 'Hilarious Climax' : 'Escalating Banter',
        suggestedShot: i % 3 === 0 ? 'Medium tracking shot' : i % 3 === 1 ? 'Close-up on character reactions' : 'Wide establishing shot',
        estimatedDurationSeconds: 6,
      });
    }
  } else {
    // Fallback: Paragraph splitting if no scene headings
    const paragraphs = text.split('\n\n').map(p => p.trim()).filter(p => p.length > 15 && !isMetadataLine(p));
    const count = Math.max(2, Math.min(6, paragraphs.length || 3));

    for (let i = 0; i < count; i++) {
      const para = paragraphs[i] || `Scene action and dialogue development part ${i + 1}`;
      scenes.push({
        sceneNumber: i + 1,
        title: `Scene ${i + 1}: ${i === 0 ? 'The Setup' : i === count - 1 ? 'The Climax' : 'The Confrontation'}`,
        locationName: locationList[0].name,
        timeOfDay: i === count - 1 ? 'Night' : 'Day',
        characterNames: primaryCharNames.slice(0, 2),
        actionDescription: para.slice(0, 160),
        dialogueSnippet: para.includes(':') ? para.split(':')[1]?.slice(0, 100) : '',
        emotionalTone: i === 0 ? 'Atmospheric Setup' : i === count - 1 ? 'High Stakes Climax' : 'Growing Tension',
        suggestedShot: i === 0 ? 'Medium establishing shot' : 'Close-up reaction',
        estimatedDurationSeconds: 6,
      });
    }
  }

  const storyArc: ScriptStoryArc = {
    title,
    genre: 'Cinematic Comedy / Drama',
    logline: `A cinematic story unfolding across ${locationList.length} distinct locations, starring ${characters.map(c => c.name).join(', ')}.`,
    theme: 'Relationships, humor, and authentic human connection',
    beginning: scenes[0]?.actionDescription || 'Initial world-building introduction',
    incitingIncident: 'An unexpected request or conflict disrupts the character routine',
    risingAction: 'Tension escalates through witty dialogues and relatable struggles',
    climax: scenes[scenes.length - 1]?.actionDescription || 'The peak moment of comedic confrontation',
    resolution: 'The characters find unexpected harmony or a humorous compromise',
  };

  return {
    storyArc,
    characters,
    locations: locationList,
    scenes,
    detectedLanguage: language,
    dialectDetected: dialect,
    chunkCount: chunks.length,
    analyzedAt: Date.now(),
  };
}
