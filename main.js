import { state, DOM, initDOM } from './state.js';
import { syncCanvasDimensions, renderAvatarsLoop } from './canvas.js';
import { sendChatMessage } from './chat.js';
import { handleGameAction } from './games.js';
import { initSocket, initPeer, startMatchmaking, disconnectStranger, skipToNext, activateCamera } from './webrtc.js';
import { applyVoiceFilter } from './audio.js';

window.addEventListener("DOMContentLoaded", () => {
  initDOM();
  syncCanvasDimensions();
  renderAvatarsLoop();
  initSocket();
  initPeer();
  bindEvents();
});

function bindEvents() {
  window.addEventListener("resize", syncCanvasDimensions);

  DOM.btnMainAction.addEventListener("click", () => {
    if (!state.localStream) activateCamera();
    if (state.isConnected || state.isSearching) disconnectStranger();
    else startMatchmaking();
  });

  DOM.btnNextStranger.addEventListener("click", skipToNext);
  DOM.btnToggleHardware.addEventListener("click", activateCamera);

  DOM.btnSendMessage.addEventListener("click", sendChatMessage);
  DOM.chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendChatMessage();
  });

  DOM.btnToggleSound.addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    DOM.btnToggleSound.textContent = state.soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF";
  });

  DOM.voiceFxSelect.addEventListener("change", (e) => {
    applyVoiceFilter(e.target.value);
  });

  // Games Dropdown toggle
  DOM.btnGamesMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    DOM.gamesMenu.classList.toggle("open");
  });
  window.addEventListener("click", () => DOM.gamesMenu.classList.remove("open"));

  // Quick Action Games
  DOM.btnCoinFlip.addEventListener("click", () => handleGameAction("coin"));
  DOM.btnDiceRoll.addEventListener("click", () => handleGameAction("dice"));

  // Tags System
  DOM.btnAddTag.addEventListener("click", () => {
    const val = DOM.tagInput.value.trim().toLowerCase();
    if (val && !state.userTags.includes(val)) {
      state.userTags.push(val);
      renderTags();
    }
    DOM.tagInput.value = "";
  });

  renderTags();
}

function renderTags() {
  DOM.tagsList.innerHTML = "";
  state.userTags.forEach(tag => {
    const span = document.createElement("span");
    span.className = "tag-badge";
    span.textContent = `#${tag}`;
    DOM.tagsList.appendChild(span);
  });
}
