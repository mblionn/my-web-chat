/* =========================================================================
   DESIGN TOKENS & SYSTEM VARIABLES
   ========================================================================= */
:root {
  --bg-base: #080b11;
  --bg-surface: #0f1523;
  --bg-elevated: #151d30;
  --bg-card: rgba(18, 25, 41, 0.75);
  
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-accent: rgba(59, 130, 246, 0.3);
  --border-glow: rgba(59, 130, 246, 0.6);

  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --primary-glow: rgba(59, 130, 246, 0.35);

  --danger: #ef4444;
  --danger-hover: #dc2626;
  --danger-glow: rgba(239, 68, 68, 0.35);

  --success: #10b981;
  --warning: #f59e0b;
  --pink: #ec4899;

  --text-main: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 9999px;
  
  --shadow-lg: 0 10px 30px -10px rgba(0, 0, 0, 0.65);
  --glass-blur: blur(14px);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  width: 100%;
  height: 100%;
  height: 100vh;
  height: 100dvh;
  background-color: var(--bg-base);
  color: var(--text-main);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* =========================================================================
   HEADER ARCHITECTURE
   ========================================================================= */
.app-header {
  height: 56px;
  background: rgba(15, 21, 35, 0.85);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  flex-shrink: 0;
  z-index: 40;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.15rem;
  font-weight: 900;
  letter-spacing: -0.4px;
  user-select: none;
}

.logo-icon {
  font-size: 1.1rem;
}

.logo-text {
  background: linear-gradient(135deg, #ffffff 40%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-pill {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: #fff;
  font-size: 0.7rem;
  padding: 2px 7px;
  border-radius: var(--radius-sm);
  font-weight: 800;
}

.status-pills {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pill {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-subtle);
  user-select: none;
  font-weight: 600;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.status-dot.online {
  background: var(--success);
  box-shadow: 0 0 8px var(--success);
}

.status-dot.warning {
  background: var(--warning);
  box-shadow: 0 0 8px var(--warning);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-main);
  border-color: rgba(255, 255, 255, 0.15);
}

.nav-btn.active {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border-color: var(--border-accent);
}

.primary-cam-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  border: none;
  padding: 7px 16px;
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
  transition: all 0.2s ease;
}

.primary-cam-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.5);
}

.primary-cam-btn.active {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
}

/* =========================================================================
   STUDIO FX FLOATING DRAWER
   ========================================================================= */
.fx-panel-drawer {
  position: absolute;
  top: 64px;
  right: 18px;
  width: 310px;
  background: rgba(15, 21, 35, 0.95);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 50;
  display: none;
  flex-direction: column;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.fx-panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.86rem;
  font-weight: 800;
  color: #fff;
}

.panel-close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
}

.fx-panel-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fx-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fx-field label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.studio-select {
  background: #111827;
  color: #f8fafc;
  border: 1px solid #1f293d;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  font-weight: 600;
  outline: none;
  cursor: pointer;
}

.studio-select option {
  background-color: #0f172a;
  color: #fff;
}

.fx-action-grid {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.drawer-tool-btn {
  flex: 1;
  background: #1e293b;
  border: 1px solid #334155;
  color: #cbd5e1;
  padding: 7px;
  border-radius: var(--radius-sm);
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
}

.drawer-tool-btn:hover {
  background: #334155;
  color: #fff;
}

/* =========================================================================
   MAIN WORKSPACE & VIDEO STAGE
   ========================================================================= */
.app-workspace {
  flex: 1;
  display: flex;
  padding: 12px;
  gap: 12px;
  overflow: hidden;
  min-height: 0;
}

.stage-column {
  flex: 7;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  position: relative;
}

.video-stage-container {
  flex: 1;
  position: relative;
  background: #020617;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.8);
}

.remote-video-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

video#remoteVideo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: none;
}

canvas#remoteCanvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* Floating Stage HUD */
.stage-hud-bar {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
  z-index: 25;
}

.hud-chip {
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.match-chip {
  display: none;
  color: #34d399;
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.4);
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--danger);
}

.badge-dot.connected {
  background: var(--success);
  box-shadow: 0 0 10px var(--success);
}

.badge-dot.waiting {
  background: var(--warning);
  box-shadow: 0 0 10px var(--warning);
}

.call-timer, .ping-indicator {
  font-family: monospace;
  font-size: 0.76rem;
  color: #38bdf8;
  display: none;
  padding-left: 6px;
  border-left: 1px solid rgba(255, 255, 255, 0.15);
}

/* Speed Chat HUD */
.speed-timer-badge {
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(245, 158, 11, 0.45);
  padding: 5px 14px;
  border-radius: var(--radius-pill);
  display: none;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  font-weight: 800;
  color: #f59e0b;
  pointer-events: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
}

.speed-timer-badge.urgent {
  background: rgba(220, 38, 38, 0.92);
  border-color: #ef4444;
  color: #ffffff;
  animation: pulseUrgent 0.8s infinite alternate;
}

@keyframes pulseUrgent {
  0% { transform: scale(1); }
  100% { transform: scale(1.08); filter: brightness(1.2); }
}

.btn-extend-time {
  background: var(--primary);
  color: #ffffff;
  border: none;
  padding: 4px 9px;
  border-radius: var(--radius-pill);
  font-size: 0.74rem;
  font-weight: 800;
  cursor: pointer;
  display: none;
}

.btn-extend-time.voted {
  background: var(--success);
  cursor: default;
}

/* =========================================================================
   LOCAL PICTURE-IN-PICTURE (PIP) CARD
   ========================================================================= */
.local-pip-card {
  position: absolute;
  bottom: 14px;
  right: 14px;
  width: 196px;
  height: 146px;
  background: #0f172a;
  border-radius: var(--radius-md);
  border: 2px solid rgba(59, 130, 246, 0.4);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  z-index: 20;
  transition: all 0.2s ease;
}

.local-pip-card.speaking {
  border-color: var(--success) !important;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.7), 0 12px 32px rgba(0, 0, 0, 0.7) !important;
}

video#localVideo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: none;
}

.mirrored {
  transform: scaleX(-1);
}

canvas#localCanvas {
  width: 100%;
  height: 100%;
  display: block;
}

.local-pip-badge {
  position: absolute;
  top: 6px;
  left: 6px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 5px;
  user-select: none;
}

.talking-dot {
  font-size: 0.62rem;
  display: none;
  color: var(--success);
}

.vibe-tag {
  font-size: 0.68rem;
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  padding: 1px 5px;
  border-radius: 4px;
  border: 1px solid rgba(59, 130, 246, 0.35);
}

.ar-prop-overlay {
  position: absolute;
  top: 18%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2.8rem;
  pointer-events: none;
  user-select: none;
  z-index: 6;
  display: none;
}

/* Floating Stage Controls Pill */
.stage-controls-pill {
  position: absolute;
  bottom: 14px;
  right: 224px;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: var(--glass-blur);
  border-radius: var(--radius-pill);
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 25;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.stage-controls-pill button {
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.stage-controls-pill button:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.1);
}

/* Reactions Bar & Soundboard */
.reactions-floating-bar {
  position: absolute;
  left: 14px;
  bottom: 14px;
  display: flex;
  gap: 6px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: var(--glass-blur);
  padding: 5px 10px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(255, 255, 255, 0.12);
  z-index: 20;
}

.reaction-trigger-btn {
  background: none;
  border: none;
  font-size: 1.15rem;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.reaction-trigger-btn:active {
  transform: scale(1.35);
}

.reaction-fly-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 18;
}

.floating-emoji {
  position: absolute;
  bottom: 20px;
  font-size: 2.4rem;
  animation: floatUp 2.4s ease-out forwards;
}

@keyframes floatUp {
  0% { transform: translateY(0) scale(0.7); opacity: 1; }
  50% { transform: translateY(-160px) scale(1.2); opacity: 0.9; }
  100% { transform: translateY(-340px) scale(1); opacity: 0; }
}

.soundboard-drawer {
  position: absolute;
  left: 14px;
  bottom: 60px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  display: none;
  gap: 8px;
  z-index: 24;
}

.soundboard-btn {
  background: #1e293b;
  border: 1px solid #334155;
  color: #f8fafc;
  padding: 5px 9px;
  border-radius: var(--radius-sm);
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
}

.soundboard-btn:hover {
  background: var(--primary);
}

/* Privacy Blur Shield */
.blur-overlay {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  background: rgba(0, 0, 0, 0.5);
  z-index: 15;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.unblur-btn {
  background: rgba(15, 23, 42, 0.9);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.5);
  padding: 8px 20px;
  border-radius: var(--radius-pill);
  font-weight: 800;
  font-size: 0.86rem;
  cursor: pointer;
}

.blur-tip {
  font-size: 0.74rem;
  color: #94a3b8;
}

.subtitle-overlay {
  position: absolute;
  bottom: 54px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: var(--glass-blur);
  color: #fef08a;
  font-weight: 700;
  font-size: 0.94rem;
  padding: 6px 18px;
  border-radius: var(--radius-pill);
  max-width: 80%;
  text-align: center;
  display: none;
  z-index: 17;
  pointer-events: none;
}

/* Mobile Toolbar */
.mobile-media-toolbar {
  display: none;
}

/* =========================================================================
   CHAT & SOCIAL RAIL
   ========================================================================= */
.chat-section {
  flex: 3;
  min-width: 320px;
  max-width: 420px;
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.chat-header {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header-title .title {
  font-size: 0.9rem;
  font-weight: 800;
  color: #fff;
}

.typing-label {
  font-size: 0.74rem;
  color: #38bdf8;
  font-weight: 600;
  display: none;
}

.chat-action-chips {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.mini-tool-btn {
  background: #1e293b;
  border: 1px solid #334155;
  color: #cbd5e1;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.mini-tool-btn.amber { color: #f59e0b; border-color: rgba(245, 158, 11, 0.4); }
.mini-tool-btn.pink { color: #f472b6; border-color: rgba(244, 114, 182, 0.4); }
.mini-tool-btn.cyan { color: #38bdf8; border-color: rgba(56, 189, 248, 0.4); }
.mini-tool-btn.emerald { color: #34d399; border-color: rgba(52, 211, 153, 0.4); }

.messages-container {
  flex: 1;
  padding: 14px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  font-size: 0.86rem;
  line-height: 1.45;
  word-break: break-word;
}

.message .time {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-right: 6px;
}

.message.stranger .sender {
  color: var(--danger);
  font-weight: 800;
}

.message.you .sender {
  color: var(--primary);
  font-weight: 800;
}

.message.system {
  color: var(--text-muted);
  font-style: italic;
  font-size: 0.78rem;
  text-align: center;
  margin: 4px 0;
}

.quick-replies-deck {
  padding: 8px 12px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  gap: 6px;
  background: #090e1a;
  overflow-x: auto;
}

.quick-chip {
  background: #182235;
  color: #94a3b8;
  border: 1px solid #28354d;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-size: 0.74rem;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 600;
}

.quick-chip.highlight {
  background: rgba(37, 99, 235, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
  color: #60a5fa;
}

.chat-input-deck {
  padding: 10px 14px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  gap: 8px;
  background: var(--bg-surface);
}

.chat-input-deck input {
  flex: 1;
  background: #07090e;
  border: 1px solid #202b3f;
  border-radius: var(--radius-md);
  padding: 8px 12px;
  color: #ffffff;
  font-size: 0.86rem;
  outline: none;
}

.chat-input-deck input:focus {
  border-color: var(--primary);
}

.send-btn {
  background: var(--primary);
  color: #ffffff;
  border: none;
  padding: 8px 18px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 800;
  font-size: 0.84rem;
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* =========================================================================
   BOTTOM CONTROL DECK (FOOTER)
   ========================================================================= */
.app-deck {
  height: 64px;
  background: rgba(15, 21, 35, 0.95);
  backdrop-filter: var(--glass-blur);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  padding: 0 18px;
  gap: 14px;
  flex-shrink: 0;
  z-index: 35;
}

.deck-main-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary-action {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: var(--radius-md);
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  box-shadow: 0 4px 14px var(--primary-glow);
  transition: all 0.2s ease;
}

.btn-primary-action.stop {
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
  box-shadow: 0 4px 14px var(--danger-glow);
}

.btn-secondary-action {
  background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: var(--radius-md);
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  display: none;
  align-items: center;
  gap: 8px;
}

.kbd-hint {
  font-size: 0.68rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-danger-action {
  background: #7f1d1d;
  color: #fca5a5;
  border: 1px solid #991b1b;
  padding: 9px 14px;
  border-radius: var(--radius-md);
  font-weight: 800;
  font-size: 0.8rem;
  cursor: pointer;
  display: none;
}

.deck-filters {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-pod {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #090e1a;
  border: 1px solid #1f293d;
  padding: 6px 12px;
  border-radius: var(--radius-md);
}

.pod-label {
  font-size: 0.76rem;
  color: var(--text-muted);
  font-weight: 700;
  white-space: nowrap;
}

.pod-select {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 0.82rem;
  outline: none;
  cursor: pointer;
  font-weight: 700;
}

.pod-select option {
  background-color: #0f172a;
}

.interests-pod {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #090e1a;
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  max-width: 380px;
  overflow-x: auto;
}

.tags-list {
  display: flex;
  gap: 6px;
}

.tag-badge {
  background: rgba(37, 99, 235, 0.25);
  border: 1px solid rgba(96, 165, 250, 0.4);
  color: #bfdbfe;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}

.tag-badge .remove-tag {
  cursor: pointer;
  color: #93c5fd;
  font-weight: 800;
}

.tag-input-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag-input {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 0.78rem;
  outline: none;
  width: 90px;
}

.btn-add-tag {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  cursor: pointer;
}

.deck-trailing-hint {
  margin-left: auto;
  font-size: 0.78rem;
  color: var(--text-muted);
  user-select: none;
}

.deck-trailing-hint kbd {
  background: #1e293b;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #334155;
  color: #e2e8f0;
}

/* =========================================================================
   MODAL CARDS (TTT, WYR, TOD, WHITEBOARD)
   ========================================================================= */
.modal-card {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 20px;
  border-radius: var(--radius-lg);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85);
  max-width: 320px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.94rem;
  font-weight: 800;
}

.modal-close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.25rem;
  cursor: pointer;
}

.tod-modal-overlay, .wyr-modal-overlay, .game-modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(7, 9, 14, 0.88);
  backdrop-filter: var(--glass-blur);
  z-index: 30;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.tod-action-row {
  display: flex;
  gap: 10px;
}

.tod-btn {
  flex: 1;
  padding: 12px;
  border-radius: var(--radius-md);
  font-weight: 800;
  cursor: pointer;
  border: none;
}

.tod-btn.truth-btn { background: #0284c7; color: #fff; }
.tod-btn.dare-btn { background: #ea580c; color: #fff; }

.wyr-btn {
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px solid #334155;
  font-weight: 700;
  font-size: 0.84rem;
  cursor: pointer;
  text-align: left;
}

.wyr-btn.opt-a { background: #1e1b4b; color: #c7d2fe; border-color: #4338ca; }
.wyr-btn.opt-b { background: #3b0764; color: #fbcfe8; border-color: #9333ea; }

.ttt-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 210px;
  height: 210px;
  margin: 0 auto;
}

.ttt-cell {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 900;
  cursor: pointer;
}

.ttt-cell.x-cell { color: var(--primary); }
.ttt-cell.o-cell { color: var(--pink); }

.whiteboard-modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(7, 9, 14, 0.94);
  backdrop-filter: var(--glass-blur);
  z-index: 30;
  display: none;
  flex-direction: column;
  padding: 12px;
}

.whiteboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
}

.whiteboard-tools {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tool-title {
  font-size: 0.88rem;
  font-weight: 800;
}

.whiteboard-tools input[type="color"] {
  border: none;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
}

.pill-action-btn {
  background: #1e293b;
  border: 1px solid #334155;
  color: #fff;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
}

canvas#whiteboardCanvas {
  flex: 1;
  background: #020617;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  cursor: crosshair;
  touch-action: none;
}

/* =========================================================================
   RESPONSIVE DESIGN (MOBILE & TABLET BREAKPOINTS)
   ========================================================================= */
@media (max-width: 900px) {
  .app-workspace {
    flex-direction: column;
    padding: 8px;
    gap: 8px;
  }

  .status-pills, .deck-trailing-hint, .desktop-only {
    display: none !important;
  }

  .stage-column {
    flex: 1;
    min-height: 50%;
  }

  .local-pip-card {
    width: 110px !important;
    height: 84px !important;
    bottom: 8px !important;
    right: 8px !important;
    border-radius: 8px !important;
  }

  .mobile-media-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: 6px;
    gap: 6px;
    flex-shrink: 0;
  }

  .m-tool-btn {
    flex: 1;
    background: #1e293b;
    color: #f8fafc;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 8px 4px;
    font-size: 0.74rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat-section {
    flex: 1;
    max-width: 100%;
    min-width: 0;
    min-height: 40%;
  }

  .app-deck {
    height: auto;
    padding: 8px 10px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .deck-main-actions {
    width: 100%;
    justify-content: space-between;
  }

  .btn-primary-action {
    flex: 1;
    justify-content: center;
  }

  .deck-filters {
    width: 100%;
    overflow-x: auto;
  }

  .fx-panel-drawer {
    right: 8px;
    left: 8px;
    width: auto;
  }
}
