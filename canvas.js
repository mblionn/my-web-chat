import { DOM, state } from './state.js';

let animStep = 0;

export function renderAvatarsLoop() {
  animStep += 0.04;
  const breath = Math.sin(animStep) * 2;
  const isBlinking = Math.sin(animStep * 0.45) > 0.95;

  if (DOM.localCanvas && DOM.localVideo.style.display !== "block") {
    drawCharacter(DOM.localCanvas, DOM.myGenderSelect.value, breath, isBlinking, "#2563eb", "#f1c27d");
  }
  if (DOM.remoteCanvas && DOM.remoteVideo.style.display !== "block") {
    const targetGender = DOM.genderSelect.value === "female" ? "female" : "male";
    drawCharacter(DOM.remoteCanvas, targetGender, breath, isBlinking, state.isSearching ? "#f59e0b" : "#3b82f6", "#f1c27d");
  }
  requestAnimationFrame(renderAvatarsLoop);
}

function drawCharacter(canvas, gender, breath, isBlinking, shirtColor, skinColor) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  if (!w || !h) return;

  ctx.clearRect(0, 0, w, h);

  const bgGrad = ctx.createRadialGradient(w / 2, h * 0.44, 20, w / 2, h * 0.44, Math.max(w, h) * 0.7);
  bgGrad.addColorStop(0, "#131b2e");
  bgGrad.addColorStop(1, "#07090e");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h * 0.44 + breath;
  const headRadius = Math.min(w, h) * 0.15;

  // Torso
  ctx.beginPath();
  ctx.fillStyle = shirtColor;
  ctx.arc(cx, cy + headRadius * 2.2, headRadius * 1.8, Math.PI, 0, false);
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(cx, cy, headRadius, 0, Math.PI * 2);
  ctx.fillStyle = skinColor;
  ctx.fill();

  // Hair
  ctx.beginPath();
  ctx.arc(cx, cy - headRadius * 0.2, headRadius * 1.05, Math.PI * 0.8, Math.PI * 2.2);
  ctx.fillStyle = gender === "female" ? "#78350f" : "#1e293b";
  ctx.fill();

  // Eyes
  const eyeOffset = headRadius * 0.35;
  const eyeY = cy + headRadius * 0.05;
  if (!isBlinking) {
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(cx - eyeOffset, eyeY, headRadius * 0.09, 0, Math.PI * 2);
    ctx.arc(cx + eyeOffset, eyeY, headRadius * 0.09, 0, Math.PI * 2);
    ctx.fill();
  }

  // Smile
  ctx.beginPath();
  ctx.arc(cx, cy + headRadius * 0.22, headRadius * 0.22, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.strokeStyle = "#be123c";
  ctx.lineWidth = 2.5;
  ctx.stroke();
}

export function syncCanvasDimensions() {
  [DOM.localCanvas, DOM.remoteCanvas].forEach(c => {
    if (!c) return;
    const rect = c.getBoundingClientRect();
    if (c.width !== rect.width || c.height !== rect.height) {
      c.width = rect.width;
      c.height = rect.height;
    }
  });
}
