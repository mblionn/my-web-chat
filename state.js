export const state = {
  BACKEND_URL: "https://my-web-chat-production.up.railway.app",
  peer: null,
  myPeerId: null,
  activeCall: null,
  activeDataConnection: null,
  localStream: null,
  isSearching: false,
  isConnected: false,
  isMirrored: true,
  micMuted: false,
  camDisabled: false,
  soundEnabled: true,
  strangersMet: 0,
  userTags: ["chatting", "music"],
  blockedPeers: new Set()
};

export const DOM = {};

export function initDOM() {
  const ids = [
    "userCount", "strangersMetCount", "p2pStatus", "serverDot",
    "localVideo", "remoteVideo", "localCanvas", "remoteCanvas", "localPipCard",
    "strangerDot", "strangerLabel", "btnMainAction", "btnNextStranger",
    "chatContainer", "chatInput", "btnSendMessage", "btnAttachImage", "chatImageInput",
    "btnToggleHardware", "btnToggleSound", "btnToggleStudioGlow", "filterSelect",
    "vibeSelect", "voiceFxSelect", "myGenderSelect", "genderSelect",
    "tagsList", "tagInput", "btnAddTag", "btnGamesMenu", "gamesMenu",
    "mGameTTT", "mGameWYR", "mGameTOD", "mGameTrivia", "btnCoinFlip", "btnDiceRoll", "btnSnapshot"
  ];
  ids.forEach(id => {
    DOM[id] = document.getElementById(id);
  });
}
