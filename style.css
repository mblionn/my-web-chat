// =========================================================================
// 0. COMPATIBILITY & CANVAS POLYFILLS
// =========================================================================
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
    if (!radii) {
      this.rect(x, y, w, h);
      return;
    }
    let r = typeof radii === "number" ? radii : (radii[0] || 0);
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
  };
}

// =========================================================================
// 1. BACKEND & WEBRTC INITIALIZATION
// =========================================================================
const BACKEND_URL = "https://my-web-chat-production.up.railway.app";

const socket = io(BACKEND_URL, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  timeout: 10000
});

let peer = null;
let myPeerId = null;
let activeCall = null;
let activeDataConnection = null;
let localStream = null;
let screenStream = null;
let isScreenSharing = false;

let isSearching = false;
let isConnected = false;
let isMirrored = true;
let micMuted = false;
let camDisabled = false;
let isAudioOnlyMode = false;
let soundEnabled = true;
let ttsEnabled = false;
let captionsEnabled = false;
let currentFacingMode = "user";

// Speed Chat
let isSpeedMode = false;
let speedSecondsRemaining = 60;
let speedTimerInterval = null;
let hasVotedExtend = false;
let partnerVotedExtend = false;

// Media Recording
let mediaRecorder = null;
let recordedChunks = [];
let isRecordingClip = false;
let recordTimeout = null;

let strangersMet = 0;
let chatHistoryLog = [];
let userTags = ["chatting", "music"];
const blockedPeers = new Set();
let blurTimeout = null;
let typingTimer = null;
let subtitleTimer = null;

let callTimerInterval = null;
let callSecondsElapsed = 0;
let statsPollInterval = null;

let audioCtx = null;
let micAnalyser = null;
let micDataArray = null;
let micAnimFrame = null;
let micSourceNode = null;
let micFilterNode = null;
let speechRecognizer = null;

let currentWyr = null;
let myWyrVote = null;
let tttBoard = Array(9).fill(null);
let mySymbol = "X";
let isMyTurn = false;
let gameActive = false;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

const ICEBREAKER_PROMPTS = [
  "If you could have dinner with any historical person, who would it be?",
  "What is the single best movie or series you watched recently?",
  "Would you rather travel 100 years into the past or 100 years into the future?",
  "What is the weirdest or coolest talent you possess?",
  "If you won 10 million dollars right now, what is the first thing you'd buy?",
  "What is your ultimate comfort food?",
  "Are you more of an early morning person or a late night owl?",
  "What is one place on Earth you dream of traveling to?"
];

const WYR_DILEMMAS = [
  { a: "Always speak your mind", b: "Never speak again" },
  { a: "Live in space for 1 year", b: "Live under the ocean for 1 year" },
  { a: "Have the ability to fly", b: "Have the ability to be invisible" },
  { a: "Never have to sleep", b: "Never gain weight regardless of what you eat" },
  { a: "Know how you will die", b: "Know when you will die" },
  { a: "Teleport anywhere instantly", b: "Pause time for 10 minutes every day" }
];

const TRUTH_PROMPTS = [
  "What is the biggest lie you ever told without getting caught?",
  "Have you ever stalked an ex or crush on social media for hours?",
  "What is the most embarrassing song you secretly love?",
  "If you had to delete every app on your phone except three, which stay?",
  "What is a silly fear that you still have today?"
];

const DARE_PROMPTS = [
  "Show the 5th photo currently in your phone's camera roll.",
  "Sing the chorus of your favorite song right now.",
  "Do your best impression of a famous celebrity or movie character.",
  "Speak in a dramatic British accent for the next 2 minutes.",
  "Do 10 rapid push-ups or jumping jacks on camera."
];

// =========================================================================
// 2. DOM REFERENCES
// =========================================================================
const vibeSelect = document.getElementById("vibeSelect");
const filterSelect = document.getElementById("filterSelect");
const myVibeTag = document.getElementById("myVibeTag");
const strangerVibeTag = document.getElementById("strangerVibeTag");
const voiceFxSelect = document.getElementById("voiceFxSelect");
const arPropSelect = document.getElementById("arPropSelect");
const arPropOverlay = document.getElementById("arPropOverlay");

const btnToggleSound = document.getElementById("btnToggleSound");
const btnToggleAudioOnly = document.getElementById("btnToggleAudioOnly");
const btnToggleHardware = document.getElementById("btnToggleHardware");
const btnToggleSpeedMode = document.getElementById("btnToggleSpeedMode");
const btnRecordClip = document.getElementById("btnRecordClip");
const btnToggleCaptions = document.getElementById("btnToggleCaptions");
const btnToggleTTS = document.getElementById("btnToggleTTS");

const speedTimerBadge = document.getElementById("speedTimerBadge");
const speedTimerValue = document.getElementById("speedTimerValue");
const btnExtendTime = document.getElementById("btnExtendTime");

const btnOpenTOD = document.getElementById("btnOpenTOD");
const todModal = document.getElementById("todModal");
const btnTodClose = document.getElementById("btnTodClose");
const btnPickTruth = document.getElementById("btnPickTruth");
const btnPickDare = document.getElementById("btnPickDare");
const todPromptText = document.getElementById("todPromptText");

const btnOpenWYR = document.getElementById("btnOpenWYR");
const wyrModal = document.getElementById("wyrModal");
const btnWyrClose = document.getElementById("btnWyrClose");
const btnWyrOptA = document.getElementById("btnWyrOptA");
const btnWyrOptB = document.getElementById("btnWyrOptB");
const wyrStatusLabel = document.getElementById("wyrStatusLabel");

const btnOpenGame = document.getElementById("btnOpenGame");
const gameModal = document.getElementById("gameModal");
const btnGameClose = document.getElementById("btnGameClose");
const gameStatusLabel = document.getElementById("gameStatusLabel");
const tttGrid = document.getElementById("tttGrid");

const btnOpenWhiteboard = document.getElementById("btnOpenWhiteboard");
const whiteboardModal = document.getElementById("whiteboardModal");
const whiteboardCanvas = document.getElementById("whiteboardCanvas");
const wbColorPicker = document.getElementById("wbColorPicker");
const btnWbClear = document.getElementById("btnWbClear");
const btnWbClose = document.getElementById("btnWbClose");

const btnSnapshot = document.getElementById("btnSnapshot");
const btnShareRoom = document.getElementById("btnShareRoom");
const btnExportChat = document.getElementById("btnExportChat");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const localCanvas = document.getElementById("localCanvas");
const remoteCanvas = document.getElementById("remoteCanvas");
const localPipCard = document.getElementById("localPipCard");
const micSpeakingBadge = document.getElementById("micSpeakingBadge");
const blurOverlay = document.getElementById("blurOverlay");
const btnUnblurVideo = document.getElementById("btnUnblurVideo");
const reactionFlyContainer = document.getElementById("reactionFlyContainer");
const btnTriggerSoundboard = document.getElementById("btnTriggerSoundboard");
const soundboardDrawer = document.getElementById("soundboardDrawer");
const typingIndicator = document.getElementById("typingIndicator");
const subtitleOverlay = document.getElementById("subtitleOverlay");
const strangersMetCount = document.getElementById("strangersMetCount");
const callTimer = document.getElementById("callTimer");
const pingIndicator = document.getElementById("pingIndicator");
const videoStageContainer = document.getElementById("videoStageContainer");
const strangerDot = document.getElementById("strangerDot");
const strangerLabel = document.getElementById("strangerLabel");
const strangerTag = document.getElementById("strangerTag");
const localLabel = document.getElementById("localLabel");
const userCount = document.getElementById("userCount");
const p2pStatus = document.getElementById("p2pStatus");

const btnMainAction = document.getElementById("btnMainAction");
const btnNextStranger = document.getElementById("btnNextStranger");
const btnReportUser = document.getElementById("btnReportUser");
const myGenderSelect = document.getElementById("myGenderSelect");
const genderSelect = document.getElementById("genderSelect");
const interestsContainer = document.getElementById("interestsContainer");
const tagsList = document.getElementById("tagsList");
const tagInput = document.getElementById("tagInput");
const btnAddTag = document.getElementById("btnAddTag");

const chatContainer = document.getElementById("chatContainer");
const chatInput = document.getElementById("chatInput");
const btnSendMessage = document.getElementById("btnSendMessage");
const btnRandomIcebreaker = document.getElementById("btnRandomIcebreaker");
const btnCoinFlip = document.getElementById("btnCoinFlip");
const btnDiceRoll = document.getElementById("btnDiceRoll");

const btnSwitchCamera = document.getElementById("btnSwitchCamera");
const btnToggleMirror = document.getElementById("btnToggleMirror");
const btnMuteAudio = document.getElementById("btnMuteAudio");
const btnMuteVideo = document.getElementById("btnMuteVideo");
const btnToggleScreenShare = document.getElementById("btnToggleScreenShare");
const btnTriggerPopoutPiP = document.getElementById("btnTriggerPopoutPiP");
const btnToggleFullscreen = document.getElementById("btnToggleFullscreen");

const mBtnSwitchCamera = document.getElementById("mBtnSwitchCamera");
const mBtnToggleMirror = document.getElementById("mBtnToggleMirror");
const mBtnMuteAudio = document.getElementById("mBtnMuteAudio");
const mBtnMuteVideo = document.getElementById("mBtnMuteVideo");
const mBtnToggleScreenShare = document.getElementById("mBtnToggleScreenShare");
const mBtnTriggerPopoutPiP = document.getElementById("mBtnTriggerPopoutPiP");
const mBtnToggleFullscreen = document.getElementById("mBtnToggleFullscreen");

// Visual Filter Effect Listener
if (filterSelect) {
  filterSelect.addEventListener("change", (e) => {
    localVideo.style.filter = e.target.value;
  });
}

// =========================================================================
// 3. UNBLOCKED GAME LAUNCHERS
// =========================================================================
if (btnOpenTOD) {
  btnOpenTOD.addEventListener("click", () => {
    if (todModal) todModal.style.display = "flex";
  });
}

if (btnTodClose) {
  btnTodClose.addEventListener("click", () => {
    if (todModal) todModal.style.display = "none";
  });
}

if (btnPickTruth) {
  btnPickTruth.addEventListener("click", () => {
    const p = TRUTH_PROMPTS[Math.floor(Math.random() * TRUTH_PROMPTS.length)];
    todPromptText.textContent = "📖 [Truth]: " + p;
    sendChatMessage(`📖 [Truth Challenge]: ${p}`);
    if (activeDataConnection && activeDataConnection.open) {
      activeDataConnection.send({ type: "tod_card", text: "📖 [Truth]: " + p });
    }
  });
}

if (btnPickDare) {
  btnPickDare.addEventListener("click", () => {
    const p = DARE_PROMPTS[Math.floor(Math.random() * DARE_PROMPTS.length)];
    todPromptText.textContent = "⚡ [Dare]: " + p;
    sendChatMessage(`⚡ [Dare Challenge]: ${p}`);
    if (activeDataConnection && activeDataConnection.open) {
      activeDataConnection.send({ type: "tod_card", text: "⚡ [Dare]: " + p });
    }
  });
}

if (btnOpenWYR) {
  btnOpenWYR.addEventListener("click", () => startWyrGame());
}

if (btnWyrClose) {
  btnWyrClose.addEventListener("click", () => {
    if (wyrModal) wyrModal.style.display = "none";
  });
}

function startWyrGame(promptObj = null) {
  currentWyr = promptObj || WYR_DILEMMAS[Math.floor(Math.random() * WYR_DILEMMAS.length)];
  myWyrVote = null;
  if (btnWyrOptA) {
    btnWyrOptA.textContent = "A: " + currentWyr.a;
    btnWyrOptA.style.opacity = "1";
  }
  if (btnWyrOptB) {
    btnWyrOptB.textContent = "B: " + currentWyr.b;
    btnWyrOptB.style.opacity = "1";
  }
  if (wyrStatusLabel) wyrStatusLabel.textContent = "Cast your vote to see what the stranger picked!";
  if (wyrModal) wyrModal.style.display = "flex";

  if (!promptObj && activeDataConnection && activeDataConnection.open) {
    activeDataConnection.send({ type: "wyr_prompt", data: currentWyr });
  }
}

if (btnWyrOptA) btnWyrOptA.addEventListener("click", () => handleWyrVote("A"));
if (btnWyrOptB) btnWyrOptB.addEventListener("click", () => handleWyrVote("B"));

function handleWyrVote(choice) {
  if (myWyrVote) return;
  myWyrVote = choice;
  wyrStatusLabel.textContent = `You picked: [${choice}]. Waiting for stranger's vote...`;
  if (choice === "A") btnWyrOptB.style.opacity = "0.5";
  if (choice === "B") btnWyrOptA.style.opacity = "0.5";

  if (activeDataConnection && activeDataConnection.open) {
    activeDataConnection.send({ type: "wyr_vote", choice: choice });
  }
}

if (btnOpenGame) {
  btnOpenGame.addEventListener("click", () => {
    openGameModal(true);
    if (activeDataConnection && activeDataConnection.open) {
      activeDataConnection.send({ type: "game_invite" });
    }
  });
}

if (btnGameClose) {
  btnGameClose.addEventListener("click", () => {
    if (gameModal) gameModal.style.display = "none";
    gameActive = false;
    if (activeDataConnection && activeDataConnection.open) {
      activeDataConnection.send({ type: "game_close" });
    }
  });
}

function openGameModal(isStarter = true) {
  resetTTTBoard();
  mySymbol = isStarter ? "X" : "O";
  isMyTurn = isStarter;
  gameActive = true;
  if (gameModal) gameModal.style.display = "flex";
  updateGameStatus();
}

function resetTTTBoard() {
  tttBoard = Array(9).fill(null);
  document.querySelectorAll(".ttt-cell").forEach((cell) => {
    cell.textContent = "";
    cell.className = "ttt-cell";
  });
}

function updateGameStatus() {
  if (!gameActive || !gameStatusLabel) return;
  gameStatusLabel.textContent = isMyTurn ? `Your turn (${mySymbol})` : `Stranger's turn (${mySymbol === "X" ? "O" : "X"})`;
}

if (tttGrid) {
  tttGrid.addEventListener("click", (e) => {
    if (!gameActive || !isMyTurn) return;
    const cell = e.target.closest(".ttt-cell");
    if (!cell) return;
    const idx = parseInt(cell.getAttribute("data-idx"));
    if (tttBoard[idx] !== null) return;

    applyMove(idx, mySymbol);
    if (activeDataConnection && activeDataConnection.open) {
      activeDataConnection.send({ type: "game_move", index: idx, symbol: mySymbol });
    }

    if (checkTTTWinner()) return;
    isMyTurn = false;
    updateGameStatus();
  });
}

function applyMove(index, symbol) {
  tttBoard[index] = symbol;
  const cell = document.querySelector(`.ttt-cell[data-idx="${index}"]`);
  if (cell) {
    cell.textContent = symbol;
    cell.classList.add(symbol === "X" ? "x-cell" : "o-cell");
  }
}

function checkTTTWinner() {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let [a, b, c] of wins) {
    if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
      const winner = tttBoard[a];
      gameStatusLabel.textContent = winner === mySymbol ? "🎉 You Won!" : "Stranger Won!";
      gameActive = false;
      return true;
    }
  }

  if (tttBoard.every((c) => c !== null)) {
    gameStatusLabel.textContent = "🤝 It's a Draw!";
    gameActive = false;
    return true;
  }
  return false;
}

if (btnOpenWhiteboard) {
  btnOpenWhiteboard.addEventListener("click", () => {
    if (whiteboardModal) {
      whiteboardModal.style.display = "flex";
      resizeWhiteboard();
    }
    if (activeDataConnection && activeDataConnection.open) {
      activeDataConnection.send({ type: "whiteboard_open" });
    }
  });
}

if (btnWbClose) {
  btnWbClose.addEventListener("click", () => {
    if (whiteboardModal) whiteboardModal.style.display = "none";
    if (activeDataConnection && activeDataConnection.open) {
      activeDataConnection.send({ type: "whiteboard_close" });
    }
  });
}

function resizeWhiteboard() {
  if (!whiteboardCanvas) return;
  const rect = whiteboardCanvas.getBoundingClientRect();
  whiteboardCanvas.width = rect.width;
  whiteboardCanvas.height = rect.height;
}

if (btnWbClear) {
  btnWbClear.addEventListener("click", () => {
    const ctx = whiteboardCanvas.getContext("2d");
    ctx.clearRect(0, 0, whiteboardCanvas.width, whiteboardCanvas.height);
    if (activeDataConnection && activeDataConnection.open) {
      activeDataConnection.send({ type: "whiteboard_clear" });
    }
  });
}

function drawSegment(x0, y0, x1, y1, color, emit = false) {
  if (!whiteboardCanvas) return;
  const ctx = whiteboardCanvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.closePath();

  if (emit && activeDataConnection && activeDataConnection.open) {
    activeDataConnection.send({
      type: "whiteboard_draw",
      x0: x0 / whiteboardCanvas.width,
      y0: y0 / whiteboardCanvas.height,
      x1: x1 / whiteboardCanvas.width,
      y1: y1 / whiteboardCanvas.height,
      color: color
    });
  }
}

function getWbPointerPos(e) {
  const rect = whiteboardCanvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

if (whiteboardCanvas) {
  whiteboardCanvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    const pos = getWbPointerPos(e);
    lastX = pos.x;
    lastY = pos.y;
  });

  whiteboardCanvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    const pos = getWbPointerPos(e);
    drawSegment(lastX, lastY, pos.x, pos.y, wbColorPicker.value, true);
    lastX = pos.x;
    lastY = pos.y;
  });

  window.addEventListener("mouseup", () => { isDrawing = false; });

  whiteboardCanvas.addEventListener("touchstart", (e) => {
    isDrawing = true;
    const pos = getWbPointerPos(e);
    lastX = pos.x;
    lastY = pos.y;
  }, { passive: true });

  whiteboardCanvas.addEventListener("touchmove", (e) => {
    if (!isDrawing) return;
    const pos = getWbPointerPos(e);
    drawSegment(lastX, lastY, pos.x, pos.y, wbColorPicker.value, true);
    lastX = pos.x;
    lastY = pos.y;
  }, { passive: true });

  whiteboardCanvas.addEventListener("touchend", () => { isDrawing = false; });
}

// =========================================================================
// 4. AUDIO DSP, SOUNDS & MIC VISUALIZER
// =========================================================================
function getAudioContext() {
  if (!audioCtx) {
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function setupMicVisualizer(stream) {
  try {
    const ctx = getAudioContext();
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) return;

    micSourceNode = ctx.createMediaStreamSource(stream);
    micAnalyser = ctx.createAnalyser();
    micAnalyser.fftSize = 64;

    micFilterNode = ctx.createBiquadFilter();
    applyVoiceFilter(voiceFxSelect ? voiceFxSelect.value : "normal");

    micSourceNode.connect(micFilterNode);
    micFilterNode.connect(micAnalyser);

    micDataArray = new Uint8Array(micAnalyser.frequencyBinCount);

    function checkMicLevel() {
      if (!localStream || micMuted) {
        localPipCard.classList.remove("speaking");
        if (micSpeakingBadge) micSpeakingBadge.style.display = "none";
        micAnimFrame = requestAnimationFrame(checkMicLevel);
        return;
      }

      micAnalyser.getByteFrequencyData(micDataArray);
      let sum = 0;
      for (let i = 0; i < micDataArray.length; i++) {
        sum += micDataArray[i];
      }
      const avg = sum / micDataArray.length;

      if (avg > 25) {
        localPipCard.classList.add("speaking");
        if (micSpeakingBadge) micSpeakingBadge.style.display = "inline";
      } else {
        localPipCard.classList.remove("speaking");
        if (micSpeakingBadge) micSpeakingBadge.style.display = "none";
      }

      micAnimFrame = requestAnimationFrame(checkMicLevel);
    }

    if (micAnimFrame) cancelAnimationFrame(micAnimFrame);
    checkMicLevel();
  } catch (e) {
    console.warn("Mic analyzer note:", e);
  }
}

function applyVoiceFilter(mode) {
  if (!micFilterNode) return;
  const ctx = getAudioContext();
  if (mode === "deep") {
    micFilterNode.type = "lowpass";
    micFilterNode.frequency.setValueAtTime(380, ctx.currentTime);
  } else if (mode === "telephone") {
    micFilterNode.type = "bandpass";
    micFilterNode.frequency.setValueAtTime(1400, ctx.currentTime);
    micFilterNode.Q.setValueAtTime(3.0, ctx.currentTime);
  } else if (mode === "cave") {
    micFilterNode.type = "peaking";
    micFilterNode.frequency.setValueAtTime(800, ctx.currentTime);
    micFilterNode.gain.setValueAtTime(15, ctx.currentTime);
  } else {
    micFilterNode.type = "allpass";
  }
}

if (voiceFxSelect) {
  voiceFxSelect.addEventListener("change", (e) => applyVoiceFilter(e.target.value));
}

if (vibeSelect) {
  vibeSelect.addEventListener("change", (e) => {
    const vibe = e.target.value;
    if (myVibeTag) myVibeTag.textContent = vibe;
    if (activeDataConnection && activeDataConnection.open) {
      activeDataConnection.send({ type: "vibe_sync", vibe: vibe });
    }
  });
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === "match") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now); osc.stop(now + 0.35);
    } else if (type === "message") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now); osc.stop(now + 0.15);
    } else if (type === "leave") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now); osc.stop(now + 0.25);
    } else if (type === "reaction") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now); osc.stop(now + 0.2);
    } else if (type === "airhorn") {
      [466.16, 470].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now); osc.stop(now + 0.45);
      });
    } else if (type === "laser") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now); osc.stop(now + 0.25);
    } else if (type === "applause") {
      for (let i = 0; i < 6; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(150 + Math.random() * 200, now + i * 0.05);
        gain.gain.setValueAtTime(0.15, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.08);
        osc.start(now + i * 0.05); osc.stop(now + i * 0.05 + 0.08);
      }
    } else if (type === "victory") {
      [523.25, 659.25, 783.99, 1046.5].forEach((note, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(note, now + idx * 0.1);
        gain.gain.setValueAtTime(0.2, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.3);
        osc.start(now + idx * 0.1); osc.stop(now + idx * 0.1 + 0.3);
      });
    }
  } catch (err) {
    console.warn("Audio FX note:", err);
  }
}

if (btnToggleSound) {
  btnToggleSound.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    btnToggleSound.textContent = soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF";
    btnToggleSound.style.color = soundEnabled ? "#cbd5e1" : "#ef4444";
  });
}

if (btnToggleAudioOnly) {
  btnToggleAudioOnly.addEventListener("click", () => {
    isAudioOnlyMode = !isAudioOnlyMode;
    btnToggleAudioOnly.textContent = isAudioOnlyMode ? "📻 Audio Mode" : "🎧 Video ON";

    if (localStream) {
      localStream.getVideoTracks().forEach((t) => (t.enabled = !isAudioOnlyMode));
      localVideo.style.display = isAudioOnlyMode ? "none" : "block";
      localCanvas.style.display = isAudioOnlyMode ? "block" : "none";
    }

    if (remoteVideo) {
      remoteVideo.style.display = isConnected && !isAudioOnlyMode ? "block" : "none";
      remoteCanvas.style.display = isConnected && !isAudioOnlyMode ? "none" : "block";
    }
  });
}

// =========================================================================
// 5. 15-SECOND VIDEO CLIP RECORDER
// =========================================================================
if (btnRecordClip) {
  btnRecordClip.addEventListener("click", () => {
    if (isRecordingClip) {
      stopClipRecording();
      return;
    }

    const streamToRecord = (remoteVideo && remoteVideo.srcObject && isConnected) ? remoteVideo.srcObject : localStream;
    if (!streamToRecord) {
      alert("Enable camera or connect with someone first to record a clip!");
      return;
    }

    try {
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(streamToRecord, { mimeType: "video/webm" });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `webtv555-highlight-${Date.now()}.webm`;
        a.click();
        appendMessage("", "Highlight video clip downloaded successfully!", "system");
      };

      mediaRecorder.start();
      isRecordingClip = true;
      btnRecordClip.textContent = "🔴 Recording (15s)";
      btnRecordClip.classList.add("record-btn-indicator");

      clearTimeout(recordTimeout);
      recordTimeout = setTimeout(() => {
        if (isRecordingClip) stopClipRecording();
      }, 15000);
    } catch (err) {
      console.warn("MediaRecorder error:", err);
      alert("Video recording is not supported on this browser/stream.");
    }
  });
}

function stopClipRecording() {
  if (!isRecordingClip) return;
  isRecordingClip = false;
  clearTimeout(recordTimeout);
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
  if (btnRecordClip) {
    btnRecordClip.textContent = "📹 Clip";
    btnRecordClip.classList.remove("record-btn-indicator");
  }
}

// =========================================================================
// 6. LIVE CLOSED CAPTIONS & TTS
// =========================================================================
function setupLiveCaptions() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (btnToggleCaptions) btnToggleCaptions.style.display = "none";
    return;
  }

  speechRecognizer = new SpeechRecognition();
  speechRecognizer.continuous = true;
  speechRecognizer.interimResults = true;
  speechRecognizer.lang = "en-US";

  speechRecognizer.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    if (transcript.trim()) {
      showFloatingSubtitle("You: " + transcript);
      if (activeDataConnection && activeDataConnection.open) {
        activeDataConnection.send({ type: "caption", text: transcript });
      }
    }
  };

  speechRecognizer.onerror = (e) => {
    console.warn("Speech recognition note:", e.error);
  };
}
setupLiveCaptions();

function showFloatingSubtitle(text) {
  if (!subtitleOverlay) return;
  subtitleOverlay.textContent = text;
  subtitleOverlay.style.display = "block";
  clearTimeout(subtitleTimer);
  subtitleTimer = setTimeout(() => {
    subtitleOverlay.style.display = "none";
  }, 4000);
}

if (btnToggleCaptions) {
  btnToggleCaptions.addEventListener("click", () => {
    if (!speechRecognizer) {
      alert("Live Captions are not supported on this browser.");
      return;
    }
    captionsEnabled = !captionsEnabled;
    btnToggleCaptions.textContent = captionsEnabled ? "💬 CC: Live" : "💬 CC: Off";
    btnToggleCaptions.classList.toggle("active", captionsEnabled);

    if (captionsEnabled) {
      try { speechRecognizer.start(); } catch (e) {}
    } else {
      try { speechRecognizer.stop(); } catch (e) {}
      if (subtitleOverlay) subtitleOverlay.style.display = "none";
    }
  });
}

if (btnToggleTTS) {
  btnToggleTTS.addEventListener("click", () => {
    ttsEnabled = !ttsEnabled;
    btnToggleTTS.textContent = ttsEnabled ? "🗣 TTS: On" : "🗣 TTS: Off";
    btnToggleTTS.classList.toggle("active", ttsEnabled);
  });
}

function speakText(text) {
  if (!ttsEnabled || !window.speechSynthesis) return;
  const clean = text.replace(/🎲|🪙|🎨|💬|🎡/g, "");
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = 1.05;
  window.speechSynthesis.speak(utterance);
}

// =========================================================================
// 7. PIP POPOUT & SCREEN SHARING
// =========================================================================
async function togglePopoutPiP() {
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture();
  } else if (remoteVideo && remoteVideo.readyState >= 2) {
    try {
      await remoteVideo.requestPictureInPicture();
    } catch (e) {
      console.warn("PiP failed:", e);
    }
  } else {
    alert("Connect to a live stranger video stream first before popping out.");
  }
}
if (btnTriggerPopoutPiP) btnTriggerPopoutPiP.addEventListener("click", togglePopoutPiP);
if (mBtnTriggerPopoutPiP) mBtnTriggerPopoutPiP.addEventListener("click", togglePopoutPiP);

async function toggleScreenShare() {
  if (!isScreenSharing) {
    try {
      screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];

      if (activeCall && activeCall.peerConnection) {
        const sender = activeCall.peerConnection.getSenders().find((s) => s.track && s.track.kind === "video");
        if (sender) sender.replaceTrack(screenTrack);
      }

      localVideo.srcObject = screenStream;
      localVideo.classList.remove("mirrored");
      isScreenSharing = true;
      if (btnToggleScreenShare) btnToggleScreenShare.textContent = "🖥 Active";
      if (mBtnToggleScreenShare) mBtnToggleScreenShare.textContent = "🖥 Stop";

      screenTrack.onended = () => stopScreenSharing();
    } catch (e) {
      console.warn("Screen share canceled or failed:", e);
    }
  } else {
    stopScreenSharing();
  }
}

function stopScreenSharing() {
  if (!isScreenSharing) return;
  if (screenStream) {
    screenStream.getTracks().forEach((t) => t.stop());
    screenStream = null;
  }
  if (localStream) {
    const camTrack = localStream.getVideoTracks()[0];
    if (activeCall && activeCall.peerConnection && camTrack) {
      const sender = activeCall.peerConnection.getSenders().find((s) => s.track && s.track.kind === "video");
      if (sender) sender.replaceTrack(camTrack);
    }
    localVideo.srcObject = localStream;
    if (isMirrored) localVideo.classList.add("mirrored");
  }
  isScreenSharing = false;
  if (btnToggleScreenShare) btnToggleScreenShare.textContent = "🖥";
  if (mBtnToggleScreenShare) mBtnToggleScreenShare.textContent = "🖥 Share";
}

if (btnToggleScreenShare) btnToggleScreenShare.addEventListener("click", toggleScreenShare);
if (mBtnToggleScreenShare) mBtnToggleScreenShare.addEventListener("click", toggleScreenShare);

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    videoStageContainer.requestFullscreen().catch((err) => {
      console.warn("Fullscreen error:", err);
    });
  } else {
    document.exitFullscreen();
  }
}
if (btnToggleFullscreen) btnToggleFullscreen.addEventListener("click", toggleFullscreen);
if (mBtnToggleFullscreen) mBtnToggleFullscreen.addEventListener("click", toggleFullscreen);

if (arPropSelect) {
  arPropSelect.addEventListener("change", (e) => {
    const val = e.target.value;
    if (!arPropOverlay) return;
    if (val === "none") {
      arPropOverlay.style.display = "none";
    } else {
      arPropOverlay.textContent = val;
      arPropOverlay.style.display = "block";
    }
  });
}

// =========================================================================
// 8. REACTIONS & SOUNDBOARD
// =========================================================================
function spawnFloatingEmoji(emoji) {
  if (!reactionFlyContainer) return;
  const el = document.createElement("div");
  el.className = "floating-emoji";
  el.textContent = emoji;
  el.style.left = `${Math.floor(Math.random() * 60) + 20}%`;
  reactionFlyContainer.appendChild(el);
  playSound("reaction");
  setTimeout(() => el.remove(), 2400);
}

document.querySelectorAll(".reaction-trigger-btn").forEach((btn) => {
  if (btn.id === "btnTriggerSoundboard") return;
  btn.addEventListener("click", () => {
    const emoji = btn.getAttribute("data-emoji");
    spawnFloatingEmoji(emoji);
    if (activeDataConnection && activeDataConnection.open) {
      activeDataConnection.send({ type: "reaction", emoji: emoji });
    }
  });
});

if (btnTriggerSoundboard) {
  btnTriggerSoundboard.addEventListener("click", (e) => {
    e.stopPropagation();
    soundboardDrawer.style.display = soundboardDrawer.style.display === "flex" ? "none" : "flex";
  });
}

document.querySelectorAll(".soundboard-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const sfx = btn.getAttribute("data-sfx");
    playSound(sfx);
    if (activeDataConnection && activeDataConnection.open) {
      activeDataConnection.send({ type: "sfx", sfx: sfx });
    }
    soundboardDrawer.style.display = "none";
  });
});

window.addEventListener("click", () => {
  if (soundboardDrawer) soundboardDrawer.style.display = "none";
});

// =========================================================================
// 9. SPEED CHAT MODE (60-SECOND ENCOUNTERS)
// =========================================================================
if (btnToggleSpeedMode) {
  btnToggleSpeedMode.addEventListener("click", () => {
    isSpeedMode = !isSpeedMode;
    btnToggleSpeedMode.textContent = isSpeedMode ? "⏱ Speed: 60s" : "⏱ Speed: Off";
    btnToggleSpeedMode.classList.toggle("active", isSpeedMode);

    if (isConnected) {
      if (isSpeedMode) startSpeedCountdown();
      else stopSpeedCountdown();
    }
  });
}

function startSpeedCountdown() {
  stopSpeedCountdown();
  if (!isSpeedMode || !isConnected || !speedTimerBadge) return;

  speedSecondsRemaining = 60;
  hasVotedExtend = false;
  partnerVotedExtend = false;
  if (btnExtendTime) {
    btnExtendTime.textContent = "+60s Extend";
    btnExtendTime.classList.remove("voted");
    btnExtendTime.style.display = "none";
  }
  speedTimerBadge.classList.remove("urgent");
  speedTimerValue.textContent = `${speedSecondsRemaining}s`;
  speedTimerBadge.style.display = "flex";

  speedTimerInterval = setInterval(() => {
    speedSecondsRemaining--;
    speedTimerValue.textContent = `${speedSecondsRemaining}s`;

    if (speedSecondsRemaining <= 20) {
      speedTimerBadge.classList.add("urgent");
      if (btnExtendTime) btnExtendTime.style.display = "inline-block";
    }

    if (speedSecondsRemaining <= 0) {
      stopSpeedCountdown();
      appendMessage("", "⏱ Speed time is up! Auto-skipping to next stranger...", "system");
      skipToNextStranger();
    }
  }, 1000);
}

function stopSpeedCountdown() {
  if (speedTimerInterval) {
    clearInterval(speedTimerInterval);
    speedTimerInterval = null;
  }
  if (speedTimerBadge) {
    speedTimerBadge.style.display = "none";
    speedTimerBadge.classList.remove("urgent");
  }
  if (btnExtendTime) btnExtendTime.style.display = "none";
  hasVotedExtend = false;
  partnerVotedExtend = false;
}

if (btnExtendTime) {
  btnExtendTime.addEventListener("click", () => {
    if (hasVotedExtend) return;
    hasVotedExtend = true;
    btnExtendTime.textContent = "✔ Voted";
    btnExtendTime.classList.add("voted");

    if (activeDataConnection && activeDataConnection.open) {
      activeDataConnection.send({ type: "speed_extend_vote" });
    }
    checkMutualExtend();
  });
}

function checkMutualExtend() {
  if (hasVotedExtend && partnerVotedExtend) {
    speedSecondsRemaining += 60;
    hasVotedExtend = false;
    partnerVotedExtend = false;
    if (btnExtendTime) {
      btnExtendTime.textContent = "+60s Extend";
      btnExtendTime.classList.remove("voted");
      btnExtendTime.style.display = "none";
    }
    if (speedTimerBadge) speedTimerBadge.classList.remove("urgent");
    playSound("victory");
    appendMessage("", "🎉 Both accepted! +60 seconds added to the call.", "system");
  }
}

// =========================================================================
// 10. SOCKET.IO PRESENCE & MATCHMAKING
// =========================================================================
socket.on("connect", () => {
  p2pStatus.textContent = "Server: Connected";
  p2pStatus.style.color = "#10b981";
  const serverDot = document.getElementById("serverDot");
  if (serverDot) {
    serverDot.style.background = "#10b981";
    serverDot.style.boxShadow = "0 0 6px #10b981";
  }
});

socket.on("connect_error", () => {
  p2pStatus.textContent = "Server: Reconnecting...";
  p2pStatus.style.color = "#f59e0b";
  const serverDot = document.getElementById("serverDot");
  if (serverDot) {
    serverDot.style.background = "#f59e0b";
    serverDot.style.boxShadow = "0 0 6px #f59e0b";
  }
});

socket.on("presence_count", (count) => {
  if (userCount) userCount.textContent = count;
});

socket.on("matched", (payload) => {
  if (blockedPeers.has(payload.partnerPeerId)) {
    skipToNextStranger();
    return;
  }

  isSearching = false;
  isConnected = true;

  strangersMet++;
  if (strangersMetCount) strangersMetCount.textContent = strangersMet;

  playSound("match");
  startCallTimer();

  if (isSpeedMode) {
    startSpeedCountdown();
  }

  strangerDot.className = "badge-dot connected";
  strangerLabel.textContent = `Stranger (${payload.partnerGender === "female" ? "Female" : "Male"})`;
  btnMainAction.textContent = "⏹ Stop";
  btnMainAction.classList.add("stop");
  btnNextStranger.style.display = "inline-flex";
  btnReportUser.style.display = "inline-flex";

  chatInput.disabled = false;
  btnSendMessage.disabled = false;
  chatInput.focus();

  if (payload.partnerTags && payload.partnerTags.length > 0) {
    strangerTag.textContent = `Matched on: #${payload.partnerTags[0]}`;
    strangerTag.style.display = "block";
  }

  appendMessage("", "Connected with a live stranger. Say hi!", "system");

  if (payload.isInitiator && myPeerId && payload.partnerPeerId) {
    const streamToSend = (localStream && !camDisabled) ? (isScreenSharing && screenStream ? screenStream : localStream) : createFallbackStream();
    const call = peer.call(payload.partnerPeerId, streamToSend);
    bindCallEvents(call);

    const conn = peer.connect(payload.partnerPeerId);
    bindDataEvents(conn);
  }
});

// =========================================================================
// 11. WEBRTC (PEERJS) ENGINE
// =========================================================================
function initializePeer() {
  peer = new Peer({
    config: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" }
      ]
    }
  });

  peer.on("open", (id) => {
    myPeerId = id;
    checkDirectInviteRoom();
  });

  peer.on("call", (call) => {
    if (blockedPeers.has(call.peer)) {
      call.close();
      skipToNextStranger();
      return;
    }
    const streamToSend = (localStream && !camDisabled) ? (isScreenSharing && screenStream ? screenStream : localStream) : createFallbackStream();
    call.answer(streamToSend);
    bindCallEvents(call);
  });

  peer.on("connection", (conn) => {
    bindDataEvents(conn);
  });

  peer.on("error", (err) => {
    console.warn("PeerJS note:", err);
  });
}
initializePeer();

function bindCallEvents(call) {
  activeCall = call;
  call.on("stream", (remoteMediaStream) => {
    remoteVideo.srcObject = remoteMediaStream;
    remoteVideo.style.display = isAudioOnlyMode ? "none" : "block";
    remoteCanvas.style.display = isAudioOnlyMode ? "block" : "none";
    triggerPrivacyShield();

    if (call.peerConnection) {
      startStatsPolling(call.peerConnection);
    }
  });
  call.on("close", handleStrangerLeft);
  call.on("error", handleStrangerLeft);
}

function bindDataEvents(conn) {
  activeDataConnection = conn;
  conn.on("open", () => {
    conn.send({ type: "vibe_sync", vibe: vibeSelect ? vibeSelect.value : "☕ Chill" });
  });

  conn.on("data", (data) => {
    if (data.type === "chat") {
      appendMessage("Stranger", data.text, "stranger");
      playSound("message");
      speakText(data.text);
      if (typingIndicator) typingIndicator.style.display = "none";
    } else if (data.type === "typing") {
      if (typingIndicator) typingIndicator.style.display = data.status ? "inline" : "none";
    } else if (data.type === "vibe_sync") {
      if (strangerVibeTag) {
        strangerVibeTag.textContent = data.vibe;
        strangerVibeTag.style.display = "inline-block";
      }
    } else if (data.type === "caption") {
      showFloatingSubtitle("Stranger: " + data.text);
    } else if (data.type === "reaction") {
      spawnFloatingEmoji(data.emoji);
    } else if (data.type === "sfx") {
      playSound(data.sfx);
    } else if (data.type === "speed_extend_vote") {
      partnerVotedExtend = true;
      appendMessage("", "⏳ Stranger wants to extend the call (+60s)!", "system");
      checkMutualExtend();
    } else if (data.type === "tod_card") {
      todPromptText.textContent = data.text;
      todModal.style.display = "flex";
    } else if (data.type === "wyr_prompt") {
      startWyrGame(data.data);
    } else if (data.type === "wyr_vote") {
      wyrStatusLabel.textContent = `Stranger voted [${data.choice}]! ${myWyrVote ? (myWyrVote === data.choice ? "🎉 You both agreed!" : "⚡ You picked differently!") : ""}`;
    } else if (data.type === "game_invite") {
      openGameModal(false);
      appendMessage("", "Stranger started a Tic-Tac-Toe match!", "system");
    } else if (data.type === "game_move") {
      applyMove(data.index, data.symbol);
      if (!checkTTTWinner()) {
        isMyTurn = true;
        updateGameStatus();
      }
    } else if (data.type === "game_close") {
      gameModal.style.display = "none";
      gameActive = false;
    } else if (data.type === "whiteboard_open") {
      whiteboardModal.style.display = "flex";
      resizeWhiteboard();
      appendMessage("", "Stranger opened the live doodle pad!", "system");
    } else if (data.type === "whiteboard_close") {
      whiteboardModal.style.display = "none";
    } else if (data.type === "whiteboard_clear") {
      const ctx = whiteboardCanvas.getContext("2d");
      ctx.clearRect(0, 0, whiteboardCanvas.width, whiteboardCanvas.height);
    } else if (data.type === "whiteboard_draw") {
      drawSegment(
        data.x0 * whiteboardCanvas.width,
        data.y0 * whiteboardCanvas.height,
        data.x1 * whiteboardCanvas.width,
        data.y1 * whiteboardCanvas.height,
        data.color,
        false
      );
    }
  });
  conn.on("close", handleStrangerLeft);
}

function handleStrangerLeft() {
  if (!isConnected) return;
  isConnected = false;
  playSound("leave");
  stopCallTimer();
  stopSpeedCountdown();
  stopStatsPolling();
  stopScreenSharing();
  stopClipRecording();
  if (strangerVibeTag) strangerVibeTag.style.display = "none";
  if (gameModal) gameModal.style.display = "none";
  gameActive = false;
  if (whiteboardModal) whiteboardModal.style.display = "none";
  if (wyrModal) wyrModal.style.display = "none";
  if (todModal) todModal.style.display = "none";
  if (subtitleOverlay) subtitleOverlay.style.display = "none";
  if (typingIndicator) typingIndicator.style.display = "none";
  appendMessage("", "Stranger has disconnected.", "system");
  disconnectStranger();
}

// =========================================================================
// 12. MATCHMAKING ACTIONS
// =========================================================================
function startMatchmaking() {
  if (!myPeerId) {
    appendMessage("", "Establishing network handshake, please wait...", "system");
    return;
  }
  isSearching = true;
  isConnected = false;
  stopCallTimer();
  stopSpeedCountdown();
  stopStatsPolling();
  stopScreenSharing();
  stopClipRecording();
  if (strangerVibeTag) strangerVibeTag.style.display = "none";
  if (gameModal) gameModal.style.display = "none";
  gameActive = false;
  if (whiteboardModal) whiteboardModal.style.display = "none";
  if (wyrModal) wyrModal.style.display = "none";
  if (todModal) todModal.style.display = "none";

  strangerDot.className = "badge-dot waiting";
  strangerLabel.textContent = "Looking for someone...";
  strangerTag.style.display = "none";
  btnMainAction.textContent = "⏹ Cancel";
  btnMainAction.classList.add("stop");
  btnNextStranger.style.display = "none";
  btnReportUser.style.display = "none";

  remoteVideo.style.display = "none";
  remoteCanvas.style.display = "block";
  if (blurOverlay) blurOverlay.style.display = "none";
  clearTimeout(blurTimeout);

  appendMessage("", "Looking for an active stranger...", "system");

  socket.emit("join_queue", {
    peerId: myPeerId,
    gender: myGenderSelect ? myGenderSelect.value : "male",
    matchPref: genderSelect ? genderSelect.value : "both",
    tags: userTags
  });
}

function disconnectStranger() {
  if (activeCall) {
    activeCall.close();
    activeCall = null;
  }
  if (activeDataConnection) {
    activeDataConnection.close();
    activeDataConnection = null;
  }

  socket.emit("leave_queue");

  isConnected = false;
  isSearching = false;
  stopCallTimer();
  stopSpeedCountdown();
  stopStatsPolling();
  stopScreenSharing();
  stopClipRecording();
  if (strangerVibeTag) strangerVibeTag.style.display = "none";
  if (gameModal) gameModal.style.display = "none";
  gameActive = false;
  if (whiteboardModal) whiteboardModal.style.display = "none";
  if (wyrModal) wyrModal.style.display = "none";
  if (todModal) todModal.style.display = "none";

  strangerDot.className = "badge-dot";
  strangerLabel.textContent = "Disconnected";
  strangerTag.style.display = "none";

  btnMainAction.textContent = "▶ Start Chat";
  btnMainAction.classList.remove("stop");
  btnNextStranger.style.display = "none";
  btnReportUser.style.display = "none";

  chatInput.disabled = true;
  btnSendMessage.disabled = true;

  remoteVideo.style.display = "none";
  remoteCanvas.style.display = "block";
  if (blurOverlay) blurOverlay.style.display = "none";
  clearTimeout(blurTimeout);
  if (typingIndicator) typingIndicator.style.display = "none";
}

function skipToNextStranger() {
  disconnectStranger();
  setTimeout(() => {
    startMatchmaking();
  }, 200);
}

if (btnNextStranger) btnNextStranger.addEventListener("click", skipToNextStranger);

if (btnReportUser) {
  btnReportUser.addEventListener("click", () => {
    if (activeCall && activeCall.peer) {
      blockedPeers.add(activeCall.peer);
      appendMessage("", "User reported & blocked for this session.", "system");
    }
    skipToNextStranger();
  });
}

if (btnMainAction) {
  btnMainAction.addEventListener("click", () => {
    if (!localStream) {
      activateCamera();
    }
    if (isConnected || isSearching) {
      disconnectStranger();
    } else {
      startMatchmaking();
    }
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (isConnected) {
      skipToNextStranger();
    } else if (isSearching) {
      disconnectStranger();
    }
  }
});

// =========================================================================
// 13. CAMERA & HARDWARE ACCESS
// =========================================================================
async function activateCamera() {
  const constraints = {
    video: {
      facingMode: currentFacingMode,
      width: { ideal: 640 },
      height: { ideal: 480 }
    },
    audio: true
  };

  try {
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStreamSuccess(stream);
  } catch (err) {
    console.warn("Combined Camera + Mic failed, attempting video-only fallback:", err);

    try {
      const videoOnlyStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: currentFacingMode }
      });
      handleStreamSuccess(videoOnlyStream);
      appendMessage("", "Microphone not detected or blocked; running camera-only mode.", "system");
    } catch (videoErr) {
      console.error("Camera access completely denied:", videoErr);
      alert("Please enable Camera & Microphone access in your browser or phone app settings.");
    }
  }
}

function handleStreamSuccess(stream) {
  localStream = stream;
  localVideo.srcObject = stream;
  localVideo.style.display = isAudioOnlyMode ? "none" : "block";
  localCanvas.style.display = isAudioOnlyMode ? "block" : "none";

  btnToggleHardware.classList.add("active");
  btnToggleHardware.textContent = "✔ Camera Active";
  localLabel.querySelector("span").textContent = "You (Live)";

  setupMicVisualizer(stream);

  if (activeCall && activeCall.peerConnection) {
    const videoTrack = stream.getVideoTracks()[0];
    const sender = activeCall.peerConnection.getSenders().find((s) => s.track && s.track.kind === "video");
    if (sender && videoTrack) {
      sender.replaceTrack(videoTrack);
    }
  }
}
if (btnToggleHardware) btnToggleHardware.addEventListener("click", activateCamera);

function bindMediaAction(desktopBtn, mobileBtn, actionFn) {
  [desktopBtn, mobileBtn].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      actionFn();
    });
  });
}

bindMediaAction(btnSwitchCamera, mBtnSwitchCamera, () => {
  currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
  activateCamera();
});

bindMediaAction(btnToggleMirror, mBtnToggleMirror, () => {
  isMirrored = !isMirrored;
  if (!isScreenSharing) {
    localVideo.classList.toggle("mirrored", isMirrored);
  }
});

bindMediaAction(btnMuteAudio, mBtnMuteAudio, () => {
  if (!localStream) return;
  micMuted = !micMuted;
  localStream.getAudioTracks().forEach((t) => (t.enabled = !micMuted));
  if (btnMuteAudio) btnMuteAudio.textContent = micMuted ? "🔇" : "🎤";
  if (mBtnMuteAudio) mBtnMuteAudio.textContent = micMuted ? "🔇 Unmute" : "🎤 Mic";
});

bindMediaAction(btnMuteVideo, mBtnMuteVideo, () => {
  if (!localStream) return;
  camDisabled = !camDisabled;
  localStream.getVideoTracks().forEach((t) => (t.enabled = !camDisabled));
  localVideo.style.display = camDisabled ? "none" : "block";
  localCanvas.style.display = camDisabled ? "block" : "none";
  localLabel.querySelector("span").textContent = camDisabled ? "You (Paused)" : "You (Live)";
  if (btnMuteVideo) btnMuteVideo.textContent = camDisabled ? "🚫" : "📷";
  if (mBtnMuteVideo) mBtnMuteVideo.textContent = camDisabled ? "📷 Show" : "📷 Cam";
});

function createFallbackStream() {
  const fallbackCanvas = document.createElement("canvas");
  fallbackCanvas.width = 320;
  fallbackCanvas.height = 240;
  const ctx = fallbackCanvas.getContext("2d");
  ctx.fillStyle = "#0c1322";
  ctx.fillRect(0, 0, 320, 240);
  if (fallbackCanvas.captureStream) {
    return fallbackCanvas.captureStream(10);
  }
  return null;
}

// =========================================================================
// 14. PROCEDURAL AVATAR RENDERER
// =========================================================================
let animStep = 0;
function renderAvatarsLoop() {
  animStep += 0.04;
  const breath = Math.sin(animStep) * 2;
  const isBlinking = Math.sin(animStep * 0.45) > 0.95;

  if (localCanvas && localVideo.style.display !== "block") {
    const myGender = myGenderSelect ? myGenderSelect.value : "male";
    drawCharacter(localCanvas, myGender, breath, isBlinking, "#2563eb", "#f1c27d");
  }

  if (remoteCanvas && remoteVideo.style.display !== "block") {
    const targetGender = genderSelect && genderSelect.value === "female" ? "female" : "male";
    const accentColor = isSearching ? "#f59e0b" : "#3b82f6";
    drawCharacter(remoteCanvas, targetGender, breath, isBlinking, accentColor, "#f1c27d");
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

  if (canvas === remoteCanvas && isSearching) {
    for (let i = 0; i < 3; i++) {
      const waveRadius = headRadius * 1.3 + ((animStep * 28 + i * 55) % (Math.min(w, h) * 0.48));
      const waveAlpha = Math.max(0, 0.45 - (waveRadius / (Math.min(w, h) * 0.48)) * 0.45);
      ctx.beginPath();
      ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(59, 130, 246, ${waveAlpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  const torsoW = headRadius * 2.6;
  const torsoTop = cy + headRadius * 0.75;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - torsoW, h + 10);
  ctx.quadraticCurveTo(cx - torsoW * 0.85, torsoTop + breath, cx - headRadius * 0.45, torsoTop + breath);
  ctx.lineTo(cx + headRadius * 0.45, torsoTop + breath);
  ctx.quadraticCurveTo(cx + torsoW * 0.85, torsoTop + breath, cx + torsoW, h + 10);
  ctx.closePath();

  const shirtGrad = ctx.createLinearGradient(0, torsoTop, 0, h);
  shirtGrad.addColorStop(0, gender === "female" ? "#ec4899" : shirtColor);
  shirtGrad.addColorStop(1, gender === "female" ? "#9d174d" : "#1e3a8a");
  ctx.fillStyle = shirtGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx - headRadius * 0.35, torsoTop + breath);
  ctx.lineTo(cx, torsoTop + headRadius * 0.45 + breath);
  ctx.lineTo(cx + headRadius * 0.35, torsoTop + breath);
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(cx - headRadius * 0.22, cy + headRadius * 0.5, headRadius * 0.44, headRadius * 0.4);

  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.roundRect(cx - headRadius * 0.2, cy + headRadius * 0.55, headRadius * 0.4, headRadius * 0.45, [0, 0, 8, 8]);
  ctx.fill();

  const headGrad = ctx.createRadialGradient(cx - headRadius * 0.2, cy - headRadius * 0.2, 5, cx, cy, headRadius);
  headGrad.addColorStop(0, "#fde68a");
  headGrad.addColorStop(0.7, skinColor);
  headGrad.addColorStop(1, "#d97706");

  ctx.beginPath();
  ctx.arc(cx, cy, headRadius, 0, Math.PI * 2);
  ctx.fillStyle = headGrad;
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = gender === "female" ? "#451a03" : "#1e293b";
  ctx.beginPath();
  if (gender === "female") {
    ctx.arc(cx, cy - headRadius * 0.1, headRadius * 1.06, Math.PI, Math.PI * 2);
    ctx.quadraticCurveTo(cx - headRadius * 1.1, cy + headRadius * 0.8, cx - headRadius * 0.6, cy + headRadius * 1.1);
    ctx.lineTo(cx - headRadius * 0.45, cy + headRadius * 0.2);
    ctx.lineTo(cx + headRadius * 0.45, cy + headRadius * 0.2);
    ctx.lineTo(cx + headRadius * 0.6, cy + headRadius * 1.1);
    ctx.quadraticCurveTo(cx + headRadius * 1.1, cy + headRadius * 0.8, cx + headRadius * 1.06, cy - headRadius * 0.1);
  } else {
    ctx.arc(cx, cy - headRadius * 0.12, headRadius * 1.03, Math.PI * 0.88, Math.PI * 2.12);
    ctx.quadraticCurveTo(cx, cy - headRadius * 0.55, cx - headRadius * 0.95, cy - headRadius * 0.05);
  }
  ctx.fill();

  const eyeOffset = headRadius * 0.35;
  const eyeY = cy + headRadius * 0.05;

  if (isBlinking) {
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - eyeOffset - 5, eyeY);
    ctx.quadraticCurveTo(cx - eyeOffset, eyeY + 3, cx - eyeOffset + 5, eyeY);
    ctx.moveTo(cx + eyeOffset - 5, eyeY);
    ctx.quadraticCurveTo(cx + eyeOffset, eyeY + 3, cx + eyeOffset + 5, eyeY);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(cx - eyeOffset, eyeY, headRadius * 0.1, 0, Math.PI * 2);
    ctx.arc(cx + eyeOffset, eyeY, headRadius * 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx - eyeOffset + 2, eyeY - 2, headRadius * 0.035, 0, Math.PI * 2);
    ctx.arc(cx + eyeOffset + 2, eyeY - 2, headRadius * 0.035, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = gender === "female" ? "#be123c" : "#78350f";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy + headRadius * 0.22, headRadius * 0.24, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  if (canvas === remoteCanvas && isSearching) {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "600 13px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    const dotCount = Math.floor((animStep * 1.5) % 4);
    const dots = ".".repeat(dotCount);
    ctx.fillText(`Scanning for strangers${dots}`, cx, h - 30);
  }
}

function syncCanvasDimensions() {
  [localCanvas, remoteCanvas].forEach((c) => {
    if (!c) return;
    const rect = c.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      if (c.width !== rect.width || c.height !== rect.height) {
        c.width = rect.width;
        c.height = rect.height;
      }
    }
  });
}
window.addEventListener("resize", syncCanvasDimensions);
window.addEventListener("load", syncCanvasDimensions);

// =========================================================================
// 15. TAGS SYSTEM
// =========================================================================
function renderTags() {
  if (!tagsList) return;
  tagsList.innerHTML = "";
  userTags.forEach((tag) => {
    const badge = document.createElement("span");
    badge.className = "tag-badge";
    const cleanTag = escapeHTML(tag).replace(/^https?:\/\//, "");
    badge.innerHTML = `<span>#${cleanTag}</span> <span class="remove-tag" data-tag="${escapeHTML(tag)}">&times;</span>`;
    tagsList.appendChild(badge);
  });
}

function addTag() {
  if (!tagInput) return;
  let val = tagInput.value.trim().toLowerCase().replace(/^[#,\s]+/, "").slice(0, 18);
  if (val && !userTags.includes(val)) {
    userTags.push(val);
    renderTags();
    if (interestsContainer) interestsContainer.scrollLeft = interestsContainer.scrollWidth;
  }
  tagInput.value = "";
}

if (btnAddTag) btnAddTag.addEventListener("click", addTag);
if (tagInput) {
  tagInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  });
}

if (tagsList) {
  tagsList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-tag")) {
      const toRemove = e.target.getAttribute("data-tag");
      userTags = userTags.filter((t) => t !== toRemove);
      renderTags();
    }
  });
}

let isMouseDown = false;
let startXPos, initialScrollLeft;
if (interestsContainer) {
  interestsContainer.addEventListener("mousedown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
    isMouseDown = true;
    startXPos = e.pageX - interestsContainer.offsetLeft;
    initialScrollLeft = interestsContainer.scrollLeft;
  });

  window.addEventListener("mouseup", () => { isMouseDown = false; });
  interestsContainer.addEventListener("mousemove", (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    interestsContainer.scrollLeft = initialScrollLeft - (e.pageX - interestsContainer.offsetLeft);
  });
}

// =========================================================================
// 16. CHAT ENGINE & TOOLS
// =========================================================================
function appendMessage(sender, text, type = "stranger") {
  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${type}`;
  if (type === "system") {
    msgDiv.textContent = text;
    chatHistoryLog.push(`[${timeStr}] (System): ${text}`);
  } else {
    msgDiv.innerHTML = `<span class="time">${timeStr}</span><span class="sender">${sender}:</span> ${escapeHTML(text)}`;
    chatHistoryLog.push(`[${timeStr}] ${sender}: ${text}`);
  }
  if (chatContainer) {
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

function escapeHTML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

if (chatInput) {
  chatInput.addEventListener("input", () => {
    if (activeDataConnection && activeDataConnection.open) {
      activeDataConnection.send({ type: "typing", status: true });
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        if (activeDataConnection && activeDataConnection.open) {
          activeDataConnection.send({ type: "typing", status: false });
        }
      }, 1200);
    }
  });

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendChatMessage();
  });
}

function sendChatMessage(text = null) {
  const msg = text || (chatInput ? chatInput.value.trim() : "");
  if (!msg || !isConnected) return;
  appendMessage("You", msg, "you");
  if (chatInput) chatInput.value = "";
  if (activeDataConnection && activeDataConnection.open) {
    activeDataConnection.send({ type: "typing", status: false });
    activeDataConnection.send({ type: "chat", text: msg });
  }
}

if (btnSendMessage) btnSendMessage.addEventListener("click", () => sendChatMessage());

document.querySelectorAll(".quick-chip").forEach((chip) => {
  if (chip.id === "btnRandomIcebreaker" || chip.id === "btnCoinFlip" || chip.id === "btnDiceRoll") return;
  chip.addEventListener("click", () => {
    sendChatMessage(chip.getAttribute("data-msg"));
  });
});

if (btnCoinFlip) {
  btnCoinFlip.addEventListener("click", () => {
    if (!isConnected) return;
    const result = Math.random() > 0.5 ? "🪙 Heads!" : "🪙 Tails!";
    sendChatMessage(`[Coin Flip]: ${result}`);
  });
}

if (btnDiceRoll) {
  btnDiceRoll.addEventListener("click", () => {
    if (!isConnected) return;
    const dice = Math.floor(Math.random() * 6) + 1;
    sendChatMessage(`[Dice Roll]: Rolled a 🎲 ${dice}!`);
  });
}

if (btnRandomIcebreaker) {
  btnRandomIcebreaker.addEventListener("click", () => {
    if (!isConnected) {
      appendMessage("", "Start a chat first before sending an icebreaker question!", "system");
      return;
    }
    const randomQ = ICEBREAKER_PROMPTS[Math.floor(Math.random() * ICEBREAKER_PROMPTS.length)];
    sendChatMessage(`🎲 [Icebreaker]: ${randomQ}`);
  });
}

if (btnExportChat) {
  btnExportChat.addEventListener("click", () => {
    if (chatHistoryLog.length === 0) {
      appendMessage("", "No chat messages to export yet.", "system");
      return;
    }
    const logText = chatHistoryLog.join("\n");
    navigator.clipboard.writeText(logText).then(() => {
      appendMessage("", "Chat transcript copied to clipboard!", "system");
    }).catch(() => {
      const blob = new Blob([logText], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `webtv555-chat-${Date.now()}.txt`;
      a.click();
    });
  });
}

if (btnShareRoom) {
  btnShareRoom.addEventListener("click", () => {
    if (!myPeerId) {
      alert("Peer ID not initialized yet. Wait a moment.");
      return;
    }
    const inviteUrl = `${window.location.origin}${window.location.pathname}#room=${myPeerId}`;
    navigator.clipboard.writeText(inviteUrl).then(() => {
      appendMessage("", `Room link copied! Share to reconnect directly: ${inviteUrl}`, "system");
    }).catch(() => {
      prompt("Copy this link to invite a friend directly:", inviteUrl);
    });
  });
}

function checkDirectInviteRoom() {
  const hash = window.location.hash;
  if (hash.startsWith("#room=")) {
    const targetPeerId = hash.replace("#room=", "").trim();
    if (targetPeerId && targetPeerId !== myPeerId) {
      appendMessage("", `Direct room link detected! Dialing peer: ${targetPeerId}`, "system");
      setTimeout(() => {
        const streamToSend = (localStream && !camDisabled) ? (isScreenSharing && screenStream ? screenStream : localStream) : createFallbackStream();
        const call = peer.call(targetPeerId, streamToSend);
        bindCallEvents(call);
        const conn = peer.connect(targetPeerId);
        bindDataEvents(conn);
      }, 1500);
    }
  }
}

function triggerPrivacyShield() {
  if (!blurOverlay) return;
  blurOverlay.style.display = "flex";
  clearTimeout(blurTimeout);
  blurTimeout = setTimeout(() => {
    blurOverlay.style.display = "none";
  }, 5000);
}

if (btnUnblurVideo) {
  btnUnblurVideo.addEventListener("click", () => {
    blurOverlay.style.display = "none";
    clearTimeout(blurTimeout);
  });
}

if (btnSnapshot) {
  btnSnapshot.addEventListener("click", () => {
    if (!isConnected) {
      appendMessage("", "Connect with someone first before snapping a memory!", "system");
      return;
    }

    const snapCanvas = document.createElement("canvas");
    snapCanvas.width = 1280;
    snapCanvas.height = 720;
    const sCtx = snapCanvas.getContext("2d");

    sCtx.fillStyle = "#000";
    sCtx.fillRect(0, 0, 1280, 720);

    if (remoteVideo.style.display === "block" && remoteVideo.videoWidth) {
      sCtx.drawImage(remoteVideo, 0, 0, 1280, 720);
    } else {
      sCtx.drawImage(remoteCanvas, 0, 0, 1280, 720);
    }

    const pipW = 260;
    const pipH = 195;
    const pipX = 1280 - pipW - 24;
    const pipY = 24;

    sCtx.fillStyle = "#1e293b";
    sCtx.lineWidth = 4;
    sCtx.strokeStyle = "#3b82f6";
    sCtx.strokeRect(pipX, pipY, pipW, pipH);

    if (localVideo.style.display === "block" && localVideo.videoWidth) {
      sCtx.save();
      if (isMirrored && !isScreenSharing) {
        sCtx.translate(pipX + pipW, pipY);
        sCtx.scale(-1, 1);
        sCtx.drawImage(localVideo, 0, 0, pipW, pipH);
      } else {
        sCtx.drawImage(localVideo, pipX, pipY, pipW, pipH);
      }
      sCtx.restore();
    }

    sCtx.fillStyle = "rgba(15, 23, 42, 0.85)";
    sCtx.roundRect(24, 650, 210, 44, 8);
    sCtx.fill();
    sCtx.fillStyle = "#38bdf8";
    sCtx.font = "bold 20px sans-serif";
    sCtx.fillText("Web TV 555", 42, 679);

    const link = document.createElement("a");
    link.download = `webtv555-memory-${Date.now()}.png`;
    link.href = snapCanvas.toDataURL("image/png");
    link.click();
  });
}

function startCallTimer() {
  stopCallTimer();
  callSecondsElapsed = 0;
  if (!callTimer) return;
  callTimer.textContent = "00:00";
  callTimer.style.display = "inline-block";

  callTimerInterval = setInterval(() => {
    callSecondsElapsed++;
    const mins = Math.floor(callSecondsElapsed / 60).toString().padStart(2, "0");
    const secs = (callSecondsElapsed % 60).toString().padStart(2, "0");
    callTimer.textContent = `${mins}:${secs}`;
  }, 1000);
}

function stopCallTimer() {
  if (callTimerInterval) {
    clearInterval(callTimerInterval);
    callTimerInterval = null;
  }
  if (callTimer) callTimer.style.display = "none";
  callSecondsElapsed = 0;
}

function startStatsPolling(peerConnection) {
  stopStatsPolling();
  if (!pingIndicator) return;
  pingIndicator.style.display = "inline-block";
  pingIndicator.textContent = "📶 ...";

  statsPollInterval = setInterval(async () => {
    if (!peerConnection || peerConnection.connectionState !== "connected") return;
    try {
      const stats = await peerConnection.getStats();
      stats.forEach((report) => {
        if (report.type === "candidate-pair" && report.state === "succeeded") {
          if (report.currentRoundTripTime !== undefined) {
            const ms = Math.round(report.currentRoundTripTime * 1000);
            pingIndicator.textContent = `📶 ${ms}ms`;
            pingIndicator.style.color = ms < 80 ? "#10b981" : (ms < 180 ? "#f59e0b" : "#ef4444");
          }
        }
      });
    } catch (e) {}
  }, 2000);
}

function stopStatsPolling() {
  if (statsPollInterval) {
    clearInterval(statsPollInterval);
    statsPollInterval = null;
  }
  if (pingIndicator) pingIndicator.style.display = "none";
}

// =========================================================================
// 17. INSTANT INITIALIZATION
// =========================================================================
syncCanvasDimensions();
renderAvatarsLoop();
renderTags();
