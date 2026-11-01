import { describe, it, expect } from 'vitest';
import { detectLanguageAndDialect, chunkScript, analyzeScriptHeuristic } from '../../src/engines/script-engine/script-analyzer';

describe('Script Analyzer Engine', () => {
  it('detects Bengali and specifically Chittagong / Chatgaiya dialect markers', () => {
    const chatgaiyaText = 'ও ভাই রহিম! অনরে তো বহুত দিন বাদে দেখ্যি! হনডে যার? আঁর দোয়ানো এক্কানা বয়! গম আছননি বেয়াইগ্গুন?';
    const result = detectLanguageAndDialect(chatgaiyaText);
    expect(result.language).toBe('bn');
    expect(result.dialect).toContain('ctg');
  });

  it('detects English script correctly', () => {
    const englishText = 'INT. WORKSHOP - DAY\nAlex picks up the cinematic lens.';
    const result = detectLanguageAndDialect(englishText);
    expect(result.language).toBe('en');
  });

  it('chunks long script without losing paragraphs', () => {
    const paragraphs = Array.from({ length: 10 }, (_, i) => `Paragraph ${i + 1} with dramatic narrative development.`).join('\n\n');
    const chunks = chunkScript(paragraphs, 100);
    expect(chunks.length).toBeGreaterThan(1);
    const combined = chunks.join(' ');
    expect(combined).toContain('Paragraph 1');
    expect(combined).toContain('Paragraph 10');
  });

  it('extracts story arc, characters, locations and scenes', () => {
    const script = `TITLE: Test Movie
INT. VILLAGE GROCERY - DAY
Nantu wipes the counter.
NANTU: Hello world!
EXT. DIRT ROAD - CONTINUOUS
Rahim arrives on his bicycle.
RAHIM: Nice to see you!`;

    const analysis = analyzeScriptHeuristic(script);
    expect(analysis.storyArc.title).toBeDefined();
    expect(analysis.characters.length).toBeGreaterThan(0);
    expect(analysis.locations.length).toBeGreaterThan(0);
    expect(analysis.scenes.length).toBeGreaterThan(0);
  });

  it('filters out metadata headers like Total Duration and parses vs characters correctly', () => {
    const rawScript = `# AI EXPERT বনাম বউ 😂
**Total Duration: EXACTLY 30 Seconds | 9:16 | Realistic Comedy**

AI EXPERT: বউ শোনো, আমি এখন AI দিয়ে সব কাজ করে ফেলবো!
বউ: আগে বাজার করে নিয়ে আসো, তারপর AI দেখাও!`;

    const analysis = analyzeScriptHeuristic(rawScript);
    expect(analysis.storyArc.title).toBe('AI EXPERT বনাম বউ 😂');
    const names = analysis.characters.map((c) => c.name);
    expect(names).toContain('AI EXPERT');
    expect(names).toContain('বউ');
    // Ensure Total Duration was NOT added as a character
    expect(names.some((n) => n.includes('Total Duration'))).toBe(false);

    // Ensure scenes do NOT have Total Duration as dialogue
    for (const sc of analysis.scenes) {
      expect(sc.dialogueSnippet).not.toContain('Total Duration');
    }
  });
});
