import { appendMessage } from './chat.js';
import { state } from './state.js';

export function handleGameAction(action) {
  if (!state.isConnected) {
    appendMessage("", "Connect with someone before starting a game!", "system");
    return;
  }
  if (action === "coin") {
    const outcome = Math.random() > 0.5 ? "🪙 Heads!" : "🪙 Tails!";
    sendGameResult(`[Coin Flip]: ${outcome}`);
  } else if (action === "dice") {
    const rolled = Math.floor(Math.random() * 6) + 1;
    sendGameResult(`[Dice Roll]: Rolled a 🎲 ${rolled}!`);
  }
}

function sendGameResult(text) {
  appendMessage("You", text, "you");
  if (state.activeDataConnection && state.activeDataConnection.open) {
    state.activeDataConnection.send({ type: "chat", text });
  }
}
