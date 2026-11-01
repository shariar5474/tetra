import { StoryboardScene } from '../../shared/types/storyboard';
import { Character } from '../../shared/types/character';
import { Environment } from '../../shared/types/environment';
import { generateSyntheticCharacterPortrait } from '../character-engine/portrait-generator';

function cleanSubtitleText(text?: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  const upper = trimmed.toUpperCase();
  if (
    upper.includes('DURATION') ||
    upper.includes('ASPECT RATIO') ||
    upper.includes('GENRE') ||
    upper.includes('RESOLUTION') ||
    upper.includes('FPS') ||
    upper.startsWith('SCENE 1_') ||
    upper.startsWith('#')
  ) {
    return '';
  }
  return trimmed.replace(/^[#*_~"'\s]+|[#*_~"'\s]+$/g, '');
}

export async function generateSceneSyntheticVideo(
  scene: StoryboardScene,
  character?: Character,
  environment?: Environment
): Promise<Blob> {
  // Detect aspect ratio: vertical 9:16 (720x1280) vs horizontal 16:9 (1280x720)
  const isVertical =
    (scene.prompts.flowPrompt && scene.prompts.flowPrompt.includes('9:16')) ||
    (scene.action && scene.action.includes('9:16')) ||
    (scene.title && scene.title.includes('9:16'));

  const width = isVertical ? 720 : 1280;
  const height = isVertical ? 1280 : 720;
  const fps = 30;
  const durationSeconds = Math.max(3, Math.min(10, scene.durationSeconds || 5));
  const totalFrames = Math.round(durationSeconds * fps);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas 2D context creation failed');

  // 1. Ensure Character Face Reference is available (Fallback to AI Generator if missing)
  let charImage: HTMLImageElement | null = null;
  let primaryRefUrl = character?.references?.find((r) => r.isPrimaryFace)?.imageUrl || character?.references?.[0]?.imageUrl;

  if (!primaryRefUrl && character) {
    try {
      primaryRefUrl = await generateSyntheticCharacterPortrait(character);
    } catch (_) {}
  } else if (!primaryRefUrl) {
    try {
      // Default fallback actor
      primaryRefUrl = await generateSyntheticCharacterPortrait({
        id: 'default-actor',
        projectId: 'default',
        name: scene.characterIds?.[0] || 'Lead Actor',
        code: 'CHAR-01',
        description: 'Lead protagonist',
        age: '28-35',
        gender: 'Male',
        faceShape: 'Expressive features',
        skinAppearance: 'Natural sun-warmed tone',
        eyes: 'Dark expressive',
        hair: 'Natural dark hair',
        facialHair: 'Light stubble',
        bodyType: 'Average',
        height: '5 ft 9 in',
        personality: 'Charismatic',
        speakingStyle: 'Conversational',
        isLocked: true,
        references: [],
        costumes: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } catch (_) {}
  }

  if (primaryRefUrl) {
    charImage = new Image();
    if (!primaryRefUrl.startsWith('data:')) {
      charImage.crossOrigin = 'anonymous';
    }
    charImage.src = primaryRefUrl;
    await new Promise((res) => {
      if (charImage) {
        if (charImage.complete && charImage.naturalWidth > 0) return res(true);
        charImage.onload = () => res(true);
        charImage.onerror = () => res(false);
        setTimeout(() => res(false), 1500);
      }
    });
  }

  // 2. Load environment image if available
  let envImage: HTMLImageElement | null = null;
  const envRef = environment?.references?.[0];
  if (envRef?.imageUrl) {
    envImage = new Image();
    if (!envRef.imageUrl.startsWith('data:')) {
      envImage.crossOrigin = 'anonymous';
    }
    envImage.src = envRef.imageUrl;
    await new Promise((res) => {
      if (envImage) {
        envImage.onload = () => res(true);
        envImage.onerror = () => res(false);
        setTimeout(() => res(false), 800);
      }
    });
  }

  // 3. Audio Context: Rich Cinematic Harmonic Soundtrack (Clearly Audible on all speakers)
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  const audioCtx = new AudioContextClass();
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (_) {}
  const dest = audioCtx.createMediaStreamDestination();

  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.26, audioCtx.currentTime);
  masterGain.connect(dest);

  // Cinematic Harmonic Pad Chords (A minor & warm strings)
  const osc1 = audioCtx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(220, audioCtx.currentTime); // A3 string root

  const osc2 = audioCtx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(261.63, audioCtx.currentTime); // C4 harmonic third

  const osc3 = audioCtx.createOscillator();
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(329.63, audioCtx.currentTime); // E4 harmonic fifth

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(900, audioCtx.currentTime);
  filter.frequency.linearRampToValueAtTime(1600, audioCtx.currentTime + durationSeconds * 0.5);
  filter.frequency.linearRampToValueAtTime(850, audioCtx.currentTime + durationSeconds);

  osc1.connect(filter);
  osc2.connect(filter);
  osc3.connect(filter);
  filter.connect(masterGain);

  osc1.start();
  osc2.start();
  osc3.start();

  // 4. Capture Stream & MediaRecorder
  const canvasStream = canvas.captureStream(fps);
  if (dest.stream.getAudioTracks().length > 0) {
    canvasStream.addTrack(dest.stream.getAudioTracks()[0]);
  }

  let mimeType = 'video/webm;codecs=vp9,opus';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm';
  }

  const chunks: Blob[] = [];
  const recorder = new MediaRecorder(canvasStream, { mimeType, videoBitsPerSecond: 6000000 });
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const recordingPromise = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      try {
        osc1.stop();
        osc2.stop();
        osc3.stop();
        audioCtx.close();
      } catch (_) {}
      resolve(new Blob(chunks, { type: 'video/mp4' }));
    };
  });

  recorder.start();

  // Clean dialogue or action for subtitle display
  const cleanedDialogue = cleanSubtitleText(scene.dialogue);
  const cleanedAction = cleanSubtitleText(scene.action);
  const activeSubtitle = cleanedDialogue || cleanedAction.slice(0, 80);

  // Floating dust/bokeh particles
  const particleCount = 25;
  const particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 3 + 1,
    speedX: (Math.random() - 0.5) * 0.8,
    speedY: -Math.random() * 0.6 - 0.2,
    alpha: Math.random() * 0.4 + 0.1,
  }));

  // 5. Render animated frames with real cinematic motion
  const frameIntervalMs = 1000 / fps;
  const renderStartTime = performance.now();

  for (let f = 0; f < totalFrames; f++) {
    const progress = f / totalFrames;
    const timeSec = f / fps;

    // --- Background Layer ---
    if (envImage && envImage.complete && envImage.naturalWidth > 0) {
      // Ken burns pan & zoom
      const scale = 1.05 + progress * 0.1;
      const panX = (width - width * scale) * 0.5 + progress * 15;
      const panY = (height - height * scale) * 0.5;
      ctx.drawImage(envImage, panX, panY, width * scale, height * scale);

      // Cinematic Vignette
      const vignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.25, width / 2, height / 2, width * 0.75);
      vignette.addColorStop(0, 'rgba(5, 7, 13, 0.2)');
      vignette.addColorStop(1, 'rgba(5, 7, 13, 0.85)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Procedural 3D Cinematic Set (Never Blank)
      // 1. Deep Wall Gradient
      const wallGrad = ctx.createLinearGradient(0, 0, 0, height * 0.75);
      wallGrad.addColorStop(0, '#0F172A');
      wallGrad.addColorStop(0.5, '#1E293B');
      wallGrad.addColorStop(1, '#0B0F19');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, width, height * 0.75);

      // 2. Cinematic Floor Plane with Perspective
      const floorGrad = ctx.createLinearGradient(0, height * 0.75, 0, height);
      floorGrad.addColorStop(0, '#05070D');
      floorGrad.addColorStop(0.3, '#111827');
      floorGrad.addColorStop(1, '#030712');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, height * 0.75, width, height * 0.25);

      // Floor horizon seam highlight
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.75);
      ctx.lineTo(width, height * 0.75);
      ctx.stroke();

      // 3. Volumetric Warm Key Light Shaft (Streaming from high angle)
      const lightBeamX = width * 0.65 + Math.sin(progress * Math.PI) * 20;
      const lightBeam = ctx.createRadialGradient(
        lightBeamX,
        height * 0.15,
        20,
        lightBeamX,
        height * 0.45,
        isVertical ? width * 0.9 : width * 0.55
      );
      lightBeam.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
      lightBeam.addColorStop(0.6, 'rgba(245, 158, 11, 0.08)');
      lightBeam.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lightBeam;
      ctx.fillRect(0, 0, width, height);

      // 4. Subtle Wall Architectural Framing (Window Shadow Silhouette)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.moveTo(width * 0.1, 0);
      ctx.lineTo(width * 0.35, 0);
      ctx.lineTo(width * 0.25, height * 0.75);
      ctx.lineTo(0, height * 0.75);
      ctx.closePath();
      ctx.fill();
    }

    // --- Floating Cinematic Bokeh Particles ---
    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.y < 0) p.y = height;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // --- Character & Scene Hero Layer (Cinematic Dolly Zoom & Atmospheric Motion) ---
    if (charImage && charImage.complete && charImage.naturalWidth > 0) {
      // Step 1: Atmospheric Background Fill (Zero black/blank borders)
      ctx.save();
      const bgScale = Math.max(width / charImage.naturalWidth, height / charImage.naturalHeight) * 1.12;
      const bgW = charImage.naturalWidth * bgScale;
      const bgH = charImage.naturalHeight * bgScale;
      ctx.drawImage(charImage, (width - bgW) / 2, (height - bgH) / 2, bgW, bgH);
      ctx.fillStyle = 'rgba(5, 7, 13, 0.55)';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Step 2: Hero Dolly Push-In / Zoom towards the actor (True 35mm movie camera movement!)
      const zoom = 1.0 + progress * 0.10; // smooth 10% push-in across the scene
      const panX = (0.5 - progress) * 14;
      const panY = (progress - 0.5) * 6;

      const fgScale = Math.min(width / charImage.naturalWidth, height / charImage.naturalHeight) * (isVertical ? 0.94 : 0.96) * zoom;
      const fgW = charImage.naturalWidth * fgScale;
      const fgH = charImage.naturalHeight * fgScale;
      const fgX = (width - fgW) / 2 + panX;
      const fgY = (height - fgH) / 2 + panY + (isVertical ? -20 : 0);

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 45;
      ctx.drawImage(charImage, fgX, fgY, fgW, fgH);
      ctx.restore();

      // Step 3: Subtle Anamorphic Lens Flare Streak
      ctx.save();
      const flareY = height * 0.45;
      const flareGrad = ctx.createLinearGradient(0, flareY, width, flareY);
      flareGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      flareGrad.addColorStop(0.3 + progress * 0.1, 'rgba(6, 182, 212, 0.12)');
      flareGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.18)');
      flareGrad.addColorStop(0.7 - progress * 0.1, 'rgba(6, 182, 212, 0.12)');
      flareGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, flareY - 15, width, 30);
      ctx.restore();

      // Step 4: Animated Speech Audio Waveform (Visualizing dialogue voice rhythm!)
      const waveY = height - (isVertical ? 150 : 125);
      const barCount = 28;
      const barW = 3;
      const gap = 3;
      const totalWaveW = barCount * (barW + gap);
      const startWaveX = (width - totalWaveW) / 2;

      ctx.save();
      for (let b = 0; b < barCount; b++) {
        const barH = 4 + Math.abs(Math.sin(timeSec * 7 + b * 0.45)) * 16;
        ctx.fillStyle = b % 2 === 0 ? '#06B6D4' : '#A855F7';
        ctx.shadowColor = '#06B6D4';
        ctx.shadowBlur = 6;
        ctx.fillRect(startWaveX + b * (barW + gap), waveY - barH / 2, barW, barH);
      }
      ctx.restore();

      // Step 5: Character Name Badge
      ctx.save();
      const badgeName = character?.name || 'Lead Actor';
      ctx.font = 'bold 12px "Inter", sans-serif';
      const nameMetrics = ctx.measureText(`🎬 ${badgeName}`);
      const nameBadgeW = nameMetrics.width + 24;
      ctx.fillStyle = 'rgba(5, 7, 13, 0.85)';
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect((width - nameBadgeW) / 2, waveY - 26, nameBadgeW, 20, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#E0F2FE';
      ctx.textAlign = 'center';
      ctx.fillText(`🎬 ${badgeName}`, width / 2, waveY - 12);
      ctx.restore();
    } else {
      // Fallback Stylish Cinematic Silhouette (If no image)
      ctx.save();
      const silX = width * 0.5;
      const silY = height * 0.45;
      const silR = isVertical ? 90 : 80;

      ctx.fillStyle = '#0F172A';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(silX, silY, silR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.moveTo(silX - silR * 1.6, height);
      ctx.lineTo(silX + silR * 1.6, height);
      ctx.lineTo(silX + silR * 0.9, silY + silR * 1.2);
      ctx.lineTo(silX - silR * 0.9, silY + silR * 1.2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // --- Cinematic Letterboxing (16:9 only) ---
    if (!isVertical) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, 40);
      ctx.fillRect(0, height - 40, width, 40);
    }

    // --- Scene Badge & Camera Info (Top) ---
    const badgeY = isVertical ? 50 : 26;
    ctx.fillStyle = 'rgba(5, 7, 13, 0.75)';
    ctx.fillRect(20, badgeY - 18, isVertical ? 220 : 260, 32);
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, badgeY - 18, isVertical ? 220 : 260, 32);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 12px "Inter", monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`SCENE ${scene.sceneNumber} • ${(scene.cameraAngle || 'WIDE').replace(/_/g, ' ').toUpperCase()}`, 32, badgeY + 3);

    // Timecode Top Right
    const mins = Math.floor(timeSec / 60).toString().padStart(2, '0');
    const secs = Math.floor(timeSec % 60).toString().padStart(2, '0');
    const framesStr = Math.floor((timeSec % 1) * fps).toString().padStart(2, '0');
    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${mins}:${secs}:${framesStr}`, width - 28, badgeY + 3);

    // --- Subtitle / Dialogue Bar (Bottom) ---
    if (activeSubtitle) {
      ctx.save();
      const fontSize = isVertical ? 20 : 22;
      ctx.font = `bold ${fontSize}px "Inter", "Hind Siliguri", "Noto Sans Bengali", sans-serif`;
      ctx.textAlign = 'center';

      const metrics = ctx.measureText(activeSubtitle);
      const boxW = Math.min(width - 60, metrics.width + 48);
      const boxH = fontSize * 2.0;
      const subY = height - (isVertical ? 90 : 75);

      // Dark Glass Backdrop
      ctx.fillStyle = 'rgba(5, 7, 13, 0.88)';
      ctx.beginPath();
      ctx.roundRect((width - boxW) / 2, subY - fontSize * 1.2, boxW, boxH, 8);
      ctx.fill();

      // Golden Accent Bottom Border
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect((width - boxW) / 2, subY - fontSize * 1.2 + boxH - 3, boxW, 3);

      // Subtitle Text
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 8;
      ctx.fillText(activeSubtitle, width / 2, subY);
      ctx.restore();
    }

    // Precise real-time pacing so MediaRecorder captures the exact full requested duration
    const targetTime = renderStartTime + (f + 1) * frameIntervalMs;
    const waitTime = Math.max(1, targetTime - performance.now());
    await new Promise((r) => setTimeout(r, waitTime));
  }

  // Ensure MediaRecorder audio/video stream reaches the exact full duration before stopping
  const totalTargetMs = durationSeconds * 1000;
  const elapsedMs = performance.now() - renderStartTime;
  if (elapsedMs < totalTargetMs) {
    await new Promise((r) => setTimeout(r, totalTargetMs - elapsedMs));
  }

  recorder.stop();
  return recordingPromise;
}
