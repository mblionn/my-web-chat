import { state, DOM } from './state.js';
import { playSound, setupMicVisualizer } from './audio.js';
import { appendMessage } from './chat.js';

export let socket;

export function initSocket() {
  socket = io(state.BACKEND_URL, {
    transports: ["websocket", "polling"],
    reconnection: true
  });

  socket.on("connect", () => {
    DOM.p2pStatus.textContent = "Server: Connected";
    DOM.p2pStatus.style.color = "#10b981";
    DOM.serverDot.style.background = "#10b981";
    DOM.serverDot.style.boxShadow = "0 0 6px #10b981";
  });

  socket.on("connect_error", () => {
    DOM.p2pStatus.textContent = "Server: Reconnecting...";
    DOM.p2pStatus.style.color = "#f59e0b";
    DOM.serverDot.style.background = "#f59e0b";
    DOM.serverDot.style.boxShadow = "0 0 6px #f59e0b";
  });

  socket.on("presence_count", (count) => {
    DOM.userCount.textContent = count;
  });

  socket.on("matched", handleMatched);
}

export function initPeer() {
  state.peer = new Peer({
    config: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" }
      ]
    }
  });

  state.peer.on("open", (id) => { state.myPeerId = id; });

  state.peer.on("call", (call) => {
    if (state.blockedPeers.has(call.peer)) {
      call.close();
      skipToNext();
      return;
    }
    const stream = state.localStream || createFallbackStream();
    call.answer(stream);
    bindCallEvents(call);
  });

  state.peer.on("connection", (conn) => {
    bindDataEvents(conn);
  });
}

function handleMatched(payload) {
  if (state.blockedPeers.has(payload.partnerPeerId)) {
    skipToNext();
    return;
  }
  state.isSearching = false;
  state.isConnected = true;
  state.strangersMet++;
  DOM.strangersMetCount.textContent = state.strangersMet;

  playSound("match");

  DOM.strangerDot.className = "badge-dot connected";
  DOM.strangerLabel.textContent = `Stranger (${payload.partnerGender === "female" ? "Female" : "Male"})`;
  DOM.btnMainAction.textContent = "⏹ Stop";
  DOM.btnMainAction.classList.add("stop");
  DOM.btnNextStranger.style.display = "inline-flex";

  DOM.chatInput.disabled = false;
  DOM.btnSendMessage.disabled = false;
  DOM.btnAttachImage.disabled = false;

  appendMessage("", "Connected with a live stranger. Say hi!", "system");

  if (payload.isInitiator && state.myPeerId && payload.partnerPeerId) {
    const stream = state.localStream || createFallbackStream();
    const call = state.peer.call(payload.partnerPeerId, stream);
    bindCallEvents(call);

    const conn = state.peer.connect(payload.partnerPeerId);
    bindDataEvents(conn);
  }
}

function bindCallEvents(call) {
  state.activeCall = call;
  call.on("stream", (remoteStream) => {
    DOM.remoteVideo.srcObject = remoteStream;
    DOM.remoteVideo.style.display = "block";
    DOM.remoteCanvas.style.display = "none";
  });
  call.on("close", handleStrangerLeft);
  call.on("error", handleStrangerLeft);
}

function bindDataEvents(conn) {
  state.activeDataConnection = conn;
  conn.on("data", (data) => {
    if (data.type === "chat") {
      appendMessage("Stranger", data.text, "stranger");
      playSound("message");
    }
  });
  conn.on("close", handleStrangerLeft);
}

function handleStrangerLeft() {
  if (!state.isConnected) return;
  state.isConnected = false;
  playSound("leave");
  appendMessage("", "Stranger has disconnected.", "system");
  disconnectStranger();
}

export function startMatchmaking() {
  if (!state.myPeerId) return;
  state.isSearching = true;
  state.isConnected = false;

  DOM.strangerDot.className = "badge-dot waiting";
  DOM.strangerLabel.textContent = "Looking for someone...";
  DOM.btnMainAction.textContent = "⏹ Cancel";
  DOM.btnMainAction.classList.add("stop");

  DOM.remoteVideo.style.display = "none";
  DOM.remoteCanvas.style.display = "block";

  socket.emit("join_queue", {
    peerId: state.myPeerId,
    gender: DOM.myGenderSelect.value,
    matchPref: DOM.genderSelect.value,
    tags: state.userTags
  });
}

export function disconnectStranger() {
  if (state.activeCall) { state.activeCall.close(); state.activeCall = null; }
  if (state.activeDataConnection) { state.activeDataConnection.close(); state.activeDataConnection = null; }

  socket.emit("leave_queue");
  state.isConnected = false;
  state.isSearching = false;

  DOM.strangerDot.className = "badge-dot";
  DOM.strangerLabel.textContent = "Disconnected";
  DOM.btnMainAction.textContent = "▶ Start Chat";
  DOM.btnMainAction.classList.remove("stop");
  DOM.btnNextStranger.style.display = "none";

  DOM.chatInput.disabled = true;
  DOM.btnSendMessage.disabled = true;
  DOM.btnAttachImage.disabled = true;

  DOM.remoteVideo.style.display = "none";
  DOM.remoteCanvas.style.display = "block";
}

export function skipToNext() {
  disconnectStranger();
  setTimeout(startMatchmaking, 200);
}

export async function activateCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: true
    });
    state.localStream = stream;
    DOM.localVideo.srcObject = stream;
    DOM.localVideo.style.display = "block";
    DOM.localCanvas.style.display = "none";
    DOM.btnToggleHardware.classList.add("active");
    DOM.btnToggleHardware.textContent = "✔ Camera Active";
    setupMicVisualizer(stream);
  } catch (err) {
    console.warn("Camera access denied or unavailable:", err);
  }
}

function createFallbackStream() {
  const fallbackCanvas = document.createElement("canvas");
  fallbackCanvas.width = 320;
  fallbackCanvas.height = 240;
  const ctx = fallbackCanvas.getContext("2d");
  ctx.fillStyle = "#0c1322";
  ctx.fillRect(0, 0, 320, 240);
  return fallbackCanvas.captureStream(10);
}
