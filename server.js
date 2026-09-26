const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send({ status: "ok", name: "Web TV 555 Matchmaker", online: queue.length });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

let queue = []; // Waiting users: [{ socketId, peerId, gender, matchPref, tags }]
const activeRooms = new Map(); // socketId -> roomId

io.on("connection", (socket) => {
  // Broadcast live online count to all visitors
  io.emit("presence_count", io.engine.clientsCount);

  socket.on("join_queue", (userData) => {
    // Remove if already in queue
    queue = queue.filter((u) => u.socketId !== socket.id);

    const matchIndex = findMatch(userData, queue);

    if (matchIndex !== -1) {
      // Pair with the matched stranger
      const partner = queue.splice(matchIndex, 1)[0];
      const roomId = `room_${socket.id}_${partner.socketId}`;

      activeRooms.set(socket.id, roomId);
      activeRooms.set(partner.socketId, roomId);

      // Caller: userData. Initiator: partner
      io.to(socket.id).emit("matched", {
        roomId,
        partnerPeerId: partner.peerId,
        partnerGender: partner.gender,
        partnerTags: partner.tags,
        isInitiator: true
      });

      io.to(partner.socketId).emit("matched", {
        roomId,
        partnerPeerId: userData.peerId,
        partnerGender: userData.gender,
        partnerTags: userData.tags,
        isInitiator: false
      });
    } else {
      // Add to waiting pool
      queue.push({
        socketId: socket.id,
        peerId: userData.peerId,
        gender: userData.gender,
        matchPref: userData.matchPref,
        tags: userData.tags || []
      });
      socket.emit("queue_status", { status: "waiting", queueLength: queue.length });
    }
  });

  socket.on("leave_queue", () => {
    queue = queue.filter((u) => u.socketId !== socket.id);
  });

  socket.on("disconnect", () => {
    queue = queue.filter((u) => u.socketId !== socket.id);
    activeRooms.delete(socket.id);
    io.emit("presence_count", io.engine.clientsCount);
  });
});

function findMatch(user, pool) {
  for (let i = 0; i < pool.length; i++) {
    const candidate = pool[i];
    // Check gender filter compatibility
    const genderMatch =
      (user.matchPref === "both" || user.matchPref === candidate.gender) &&
      (candidate.matchPref === "both" || candidate.matchPref === user.gender);

    if (genderMatch) return i;
  }
  return pool.length > 0 ? 0 : -1;
}

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Web TV 555 Server listening on port ${PORT}`);
});
