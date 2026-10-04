import { DOM, state } from './state.js';
import { playSound } from './audio.js';

export function appendMessage(sender, text, type = "stranger", imageSrc = null) {
  const now = new Date();
  const timeStr = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${type}`;

  if (type === "system") {
    msgDiv.textContent = text;
  } else {
    let content = `<span class="time">${timeStr}</span><span class="sender">${sender}:</span> ${escapeHTML(text)}`;
    if (imageSrc) {
      content += `<br><img class="chat-img-thumb" src="${imageSrc}" onclick="window.open('${imageSrc}')" />`;
    }
    msgDiv.innerHTML = content;
  }
  DOM.chatContainer.appendChild(msgDiv);
  DOM.chatContainer.scrollTop = DOM.chatContainer.scrollHeight;
}

export function sendChatMessage() {
  const msg = DOM.chatInput.value.trim();
  if (!msg || !state.isConnected) return;
  appendMessage("You", msg, "you");
  DOM.chatInput.value = "";
  if (state.activeDataConnection && state.activeDataConnection.open) {
    state.activeDataConnection.send({ type: "chat", text: msg });
  }
}

function escapeHTML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
