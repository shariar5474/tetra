import { Character } from '../../shared/types/character';

/**
 * Generates an authentic cinematic digital actor portrait on an offscreen canvas.
 * Adapts to character gender, age, hairstyle, facial hair, glasses, and skin tone.
 * Returns a high-res base64 Data URL.
 */
export async function generateSyntheticCharacterPortrait(character: Character): Promise<string> {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  const nameLower = (character.name || '').toLowerCase();
  const descLower = `${character.description || ''} ${character.keyAppearance || ''}`.toLowerCase();
  const isFemale =
    character.gender?.toLowerCase() === 'female' ||
    nameLower.includes('বউ') ||
    nameLower.includes('রুমানা') ||
    nameLower.includes('woman') ||
    nameLower.includes('girl') ||
    nameLower.includes('wife');

  const hasGlasses = descLower.includes('চশমা') || descLower.includes('glasses') || descLower.includes('spectacles');
  const hasBeard =
    !isFemale &&
    (descLower.includes('দাড়ি') ||
      descLower.includes('stubble') ||
      descLower.includes('beard') ||
      (character.facialHair && character.facialHair.toLowerCase() !== 'none'));

  // 1. Studio Backdrop (Dual-tone Cinema Blue / Deep Amber rim)
  const bgGrad = ctx.createRadialGradient(size * 0.5, size * 0.45, 50, size * 0.5, size * 0.5, size * 0.75);
  bgGrad.addColorStop(0, '#1E293B');
  bgGrad.addColorStop(0.5, '#0F172A');
  bgGrad.addColorStop(1, '#05070D');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Warm key light from top-right
  const keyLight = ctx.createRadialGradient(size * 0.78, size * 0.22, 10, size * 0.78, size * 0.22, size * 0.5);
  keyLight.addColorStop(0, 'rgba(251, 191, 36, 0.25)');
  keyLight.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = keyLight;
  ctx.fillRect(0, 0, size, size);

  // Cool rim light from left
  const rimLight = ctx.createRadialGradient(size * 0.15, size * 0.5, 10, size * 0.15, size * 0.5, size * 0.45);
  rimLight.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
  rimLight.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = rimLight;
  ctx.fillRect(0, 0, size, size);

  // 2. Realistic Skin Palette
  let skinBase = isFemale ? '#E8B996' : '#C98A5B';
  let skinShadow = isFemale ? '#BF8663' : '#8A532E';
  let skinHighlight = isFemale ? '#FBE5D6' : '#E8B996';
  let skinBlush = isFemale ? 'rgba(239, 68, 68, 0.15)' : 'rgba(217, 119, 6, 0.08)';

  const skinDesc = (character.skinAppearance || '').toLowerCase();
  if (skinDesc.includes('fair') || skinDesc.includes('pale')) {
    skinBase = isFemale ? '#FDE2D2' : '#F2C8B0';
    skinShadow = '#D8A085';
    skinHighlight = '#FFF3EB';
  } else if (skinDesc.includes('dark') || skinDesc.includes('deep')) {
    skinBase = '#7A472E';
    skinShadow = '#4D2918';
    skinHighlight = '#9E6446';
  }

  // 3. Neck & Torso
  ctx.save();
  const neckW = isFemale ? size * 0.15 : size * 0.2;
  const neckGrad = ctx.createLinearGradient(size * 0.5, size * 0.55, size * 0.5, size * 0.85);
  neckGrad.addColorStop(0, skinShadow);
  neckGrad.addColorStop(0.6, skinBase);
  neckGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = neckGrad;
  ctx.beginPath();
  ctx.moveTo(size * 0.5 - neckW, size * 0.55);
  ctx.lineTo(size * 0.5 + neckW, size * 0.55);
  ctx.lineTo(size * 0.5 + neckW * 1.5, size * 0.82);
  ctx.lineTo(size * 0.5 - neckW * 1.5, size * 0.82);
  ctx.closePath();
  ctx.fill();

  // Collarbone shadows
  ctx.strokeStyle = skinShadow;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(size * 0.38, size * 0.8);
  ctx.quadraticCurveTo(size * 0.5, size * 0.83, size * 0.62, size * 0.8);
  ctx.stroke();

  // Shoulders & Clothing
  const clothingColor = isFemale ? '#9333EA' : '#1E40AF'; // Purple saree / Blue shirt
  ctx.fillStyle = clothingColor;
  ctx.beginPath();
  ctx.moveTo(size * 0.15, size);
  ctx.lineTo(size * 0.85, size);
  ctx.lineTo(size * 0.75, size * 0.8);
  ctx.lineTo(size * 0.5 + neckW * 1.3, size * 0.8);
  ctx.quadraticCurveTo(size * 0.5, size * 0.86, size * 0.5 - neckW * 1.3, size * 0.8);
  ctx.lineTo(size * 0.25, size * 0.8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 4. Head & Jaw Construction (Organic curved silhouette)
  const headCenterX = size * 0.5;
  const headCenterY = size * 0.44;
  const headW = isFemale ? size * 0.18 : size * 0.21;
  const headH = size * 0.26;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 25;

  const faceGrad = ctx.createRadialGradient(
    headCenterX + 25,
    headCenterY - 35,
    20,
    headCenterX,
    headCenterY,
    headH * 1.1
  );
  faceGrad.addColorStop(0, skinHighlight);
  faceGrad.addColorStop(0.5, skinBase);
  faceGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = faceGrad;

  ctx.beginPath();
  // Forehead to cheek to chin curve
  ctx.moveTo(headCenterX - headW, headCenterY - headH * 0.4);
  ctx.bezierCurveTo(
    headCenterX - headW * 1.05,
    headCenterY - headH * 0.9,
    headCenterX + headW * 1.05,
    headCenterY - headH * 0.9,
    headCenterX + headW,
    headCenterY - headH * 0.4
  );
  ctx.bezierCurveTo(
    headCenterX + headW * 1.02,
    headCenterY + headH * 0.3,
    headCenterX + headW * 0.7,
    headCenterY + headH * 0.85,
    headCenterX,
    headCenterY + headH
  );
  ctx.bezierCurveTo(
    headCenterX - headW * 0.7,
    headCenterY + headH * 0.85,
    headCenterX - headW * 1.02,
    headCenterY + headH * 0.3,
    headCenterX - headW,
    headCenterY - headH * 0.4
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Cheek blush
  ctx.fillStyle = skinBlush;
  ctx.beginPath();
  ctx.ellipse(headCenterX - headW * 0.55, headCenterY + 18, 22, 14, -0.1, 0, Math.PI * 2);
  ctx.ellipse(headCenterX + headW * 0.55, headCenterY + 18, 22, 14, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // 5. Hair Base & Styling
  const hairColor = '#171717';
  ctx.fillStyle = hairColor;

  if (isFemale) {
    // Elegant flowing dark hair framing face
    ctx.beginPath();
    ctx.arc(headCenterX, headCenterY - headH * 0.45, headW * 1.15, Math.PI, 0);
    // Left flow
    ctx.bezierCurveTo(
      headCenterX + headW * 1.35,
      headCenterY,
      headCenterX + headW * 1.45,
      headCenterY + headH * 1.2,
      headCenterX + headW * 0.9,
      headCenterY + headH * 1.4
    );
    ctx.bezierCurveTo(
      headCenterX + headW * 1.1,
      headCenterY + headH * 0.9,
      headCenterX + headW * 0.8,
      headCenterY + headH * 0.2,
      headCenterX + headW * 0.6,
      headCenterY - 10
    );
    // Across forehead
    ctx.quadraticCurveTo(headCenterX, headCenterY - headH * 0.3, headCenterX - headW * 0.6, headCenterY - 10);
    // Right flow
    ctx.bezierCurveTo(
      headCenterX - headW * 0.8,
      headCenterY + headH * 0.2,
      headCenterX - headW * 1.1,
      headCenterY + headH * 0.9,
      headCenterX - headW * 0.9,
      headCenterY + headH * 1.4
    );
    ctx.bezierCurveTo(
      headCenterX - headW * 1.45,
      headCenterY + headH * 1.2,
      headCenterX - headW * 1.35,
      headCenterY,
      headCenterX - headW * 1.15,
      headCenterY - headH * 0.45
    );
    ctx.closePath();
    ctx.fill();
  } else {
    // Modern textured crop with layered volume
    ctx.beginPath();
    ctx.ellipse(headCenterX, headCenterY - headH * 0.72, headW * 1.08, headH * 0.48, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    // Sideburns
    ctx.fillRect(headCenterX - headW * 1.02, headCenterY - headH * 0.4, 8, 38);
    ctx.fillRect(headCenterX + headW * 0.96, headCenterY - headH * 0.4, 8, 38);
  }

  // 6. Realistic Almond Human Eyes & Eyebrows
  const eyeY = headCenterY - 8;
  const eyeSpan = size * 0.082;
  const eyeWidth = 18;
  const eyeHeight = 9;

  // Eyebrows
  ctx.strokeStyle = '#262626';
  ctx.lineWidth = isFemale ? 2.8 : 4.5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  // Left eyebrow
  ctx.moveTo(headCenterX - eyeSpan - eyeWidth - 3, eyeY - 18);
  ctx.quadraticCurveTo(headCenterX - eyeSpan, eyeY - 24, headCenterX - eyeSpan + eyeWidth + 2, eyeY - 18);
  // Right eyebrow
  ctx.moveTo(headCenterX + eyeSpan - eyeWidth - 2, eyeY - 18);
  ctx.quadraticCurveTo(headCenterX + eyeSpan, eyeY - 24, headCenterX + eyeSpan + eyeWidth + 3, eyeY - 18);
  ctx.stroke();

  // Eye sockets & sclera
  [headCenterX - eyeSpan, headCenterX + eyeSpan].forEach((ex, idx) => {
    // Upper eyelid shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.ellipse(ex, eyeY - 2, eyeWidth + 2, eyeHeight + 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sclera (Eye White with slight corner shadow)
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, eyeWidth, eyeHeight, 0, 0, Math.PI * 2);
    ctx.fill();

    // Iris (Deep Warm Amber / Dark Brown with radial gradient)
    const irisR = 7.5;
    const irisGrad = ctx.createRadialGradient(ex, eyeY, 1, ex, eyeY, irisR);
    irisGrad.addColorStop(0, '#5C3818');
    irisGrad.addColorStop(0.7, '#2E1909');
    irisGrad.addColorStop(1, '#1A0E05');
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.arc(ex, eyeY, irisR, 0, Math.PI * 2);
    ctx.fill();

    // Dark Pupil
    ctx.fillStyle = '#09090B';
    ctx.beginPath();
    ctx.arc(ex, eyeY, 3.8, 0, Math.PI * 2);
    ctx.fill();

    // Specular Catchlight (Cinematic reflection)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.arc(ex + 2.2, eyeY - 2.2, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex - 2, eyeY + 2.5, 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Eyelash contour
    ctx.strokeStyle = '#18181B';
    ctx.lineWidth = isFemale ? 2.5 : 1.8;
    ctx.beginPath();
    ctx.arc(ex, eyeY, eyeWidth * 0.9, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  });

  // 7. Shaded Nose Bridge & Tip
  ctx.save();
  ctx.strokeStyle = skinShadow;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  // Nose ridge
  ctx.moveTo(headCenterX - 2, eyeY + 4);
  ctx.lineTo(headCenterX + 2, eyeY + 34);
  // Nose tip
  ctx.quadraticCurveTo(headCenterX + 7, eyeY + 42, headCenterX, eyeY + 42);
  ctx.quadraticCurveTo(headCenterX - 7, eyeY + 42, headCenterX - 4, eyeY + 35);
  ctx.stroke();

  // Nostril shadows
  ctx.fillStyle = skinShadow;
  ctx.beginPath();
  ctx.ellipse(headCenterX - 6, eyeY + 39, 2.5, 1.5, -0.2, 0, Math.PI * 2);
  ctx.ellipse(headCenterX + 6, eyeY + 39, 2.5, 1.5, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Nose tip highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.arc(headCenterX + 1, eyeY + 37, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 8. Realistic Lips
  const mouthY = headCenterY + 70;
  const lipW = isFemale ? 22 : 24;
  const lipH = isFemale ? 7 : 5;

  ctx.save();
  // Lip color
  const lipColor = isFemale ? '#DC2626' : '#A3534B';
  const lipGrad = ctx.createLinearGradient(headCenterX, mouthY - lipH, headCenterX, mouthY + lipH);
  lipGrad.addColorStop(0, lipColor);
  lipGrad.addColorStop(0.5, '#7F1D1D');
  lipGrad.addColorStop(1, '#991B1B');

  // Upper Lip
  ctx.fillStyle = lipGrad;
  ctx.beginPath();
  ctx.moveTo(headCenterX - lipW, mouthY);
  ctx.quadraticCurveTo(headCenterX - lipW * 0.4, mouthY - lipH, headCenterX - 3, mouthY - lipH * 0.6);
  ctx.lineTo(headCenterX + 3, mouthY - lipH * 0.6);
  ctx.quadraticCurveTo(headCenterX + lipW * 0.4, mouthY - lipH, headCenterX + lipW, mouthY);
  ctx.quadraticCurveTo(headCenterX, mouthY + 1, headCenterX - lipW, mouthY);
  ctx.fill();

  // Lower Lip
  ctx.beginPath();
  ctx.moveTo(headCenterX - lipW * 0.85, mouthY);
  ctx.quadraticCurveTo(headCenterX, mouthY + lipH * 1.5, headCenterX + lipW * 0.85, mouthY);
  ctx.quadraticCurveTo(headCenterX, mouthY + 2, headCenterX - lipW * 0.85, mouthY);
  ctx.fill();

  // Lower lip specular shine
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.ellipse(headCenterX, mouthY + lipH * 0.6, 6, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 9. Facial Hair / Stubble for Male (if applicable)
  if (hasBeard) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.42)';
    ctx.beginPath();
    ctx.moveTo(headCenterX - headW * 0.75, headCenterY + 30);
    ctx.bezierCurveTo(
      headCenterX - headW * 0.9,
      headCenterY + headH * 0.85,
      headCenterX - headW * 0.5,
      headCenterY + headH + 4,
      headCenterX,
      headCenterY + headH + 6
    );
    ctx.bezierCurveTo(
      headCenterX + headW * 0.5,
      headCenterY + headH + 4,
      headCenterX + headW * 0.9,
      headCenterY + headH * 0.85,
      headCenterX + headW * 0.75,
      headCenterY + 30
    );
    ctx.quadraticCurveTo(headCenterX + headW * 0.6, mouthY + 22, headCenterX, mouthY + 18);
    ctx.quadraticCurveTo(headCenterX - headW * 0.6, mouthY + 22, headCenterX - headW * 0.75, headCenterY + 30);
    ctx.fill();
    ctx.restore();
  }

  // 10. Round Wireframe Glasses (if applicable, e.g. Tanvir the AI Expert)
  if (hasGlasses) {
    ctx.save();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;

    // Left lens
    ctx.beginPath();
    ctx.arc(headCenterX - eyeSpan, eyeY, eyeWidth + 5, 0, Math.PI * 2);
    ctx.stroke();

    // Right lens
    ctx.beginPath();
    ctx.arc(headCenterX + eyeSpan, eyeY, eyeWidth + 5, 0, Math.PI * 2);
    ctx.stroke();

    // Bridge
    ctx.beginPath();
    ctx.moveTo(headCenterX - eyeSpan + eyeWidth + 5, eyeY - 2);
    ctx.quadraticCurveTo(headCenterX, eyeY - 5, headCenterX + eyeSpan - eyeWidth - 5, eyeY - 2);
    ctx.stroke();

    // Lens glare reflection
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(headCenterX - eyeSpan, eyeY, eyeWidth + 2, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(headCenterX + eyeSpan, eyeY, eyeWidth + 2, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();
    ctx.restore();
  }

  // 11. Cinematic Badge Overlay
  ctx.fillStyle = 'rgba(5, 7, 13, 0.85)';
  ctx.fillRect(16, size - 44, size - 32, 32);
  ctx.strokeStyle = '#06B6D4';
  ctx.lineWidth = 1;
  ctx.strokeRect(16, size - 44, size - 32, 32);

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 11px "Inter", monospace, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`★ ${character.name.toUpperCase()} (${isFemale ? 'FEMALE' : 'MALE'})`, 28, size - 23);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '10px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('LOCKED BIOMETRIC BIBLE', size - 28, size - 23);

  return canvas.toDataURL('image/png');
}
