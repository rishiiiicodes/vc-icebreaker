const {
  rooms,
  createRoom,
  getRoom,
  deleteRoom,
  updateActivity,
  startCleanup
} = require("./rooms/roomManager");
const {
  normalizeRoomPlayers,
  isHost,
  assignHost,
  reassignHost,
  getPlayerNames
} = require("./rooms/playerManager");
const {
  VALID_CATEGORIES,
  VALID_LANGUAGES,
  getTotal,
  changeCategory,
  changeLanguage,
  nextQuestion,
  skipQuestion,
  resetRoom
} = require("./rooms/questionEngine");

// Removed custom logging functions (timestamp, log) as we use Pino now

function truncate(text, max = 40) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

const MAX_PLAYERS_PER_ROOM = parseInt(process.env.MAX_PLAYERS_PER_ROOM || "50", 10);

module.exports = function socketHandler(io, logger) {
  startCleanup(io, logger);

  // Rate limits object keyed by specific socket ID + action or IP + action
  const rateLimits = {};

  function isRateLimited(keyStr, action, ms = 500) {
    if (process.env.NODE_ENV === "test") return false;
    const key = `${keyStr}:${action}`;
    const now = Date.now();
    if (rateLimits[key] && now - rateLimits[key] < ms) return true;
    rateLimits[key] = now;
    return false;
  }

  // Cleanup rateLimits periodically to prevent memory leaks over months of uptime
  setInterval(() => {
    const now = Date.now();
    Object.keys(rateLimits).forEach(key => {
      // most limits are under 2000ms, clear anything older than 1 minute
      if (now - rateLimits[key] > 60000) {
        delete rateLimits[key];
      }
    });
  }, 5 * 60 * 1000);

  function getParticipantCount(roomId) {
    const room = io.sockets.adapter.rooms.get(roomId);
    return room ? room.size : 0;
  }

  function toLegacyPlayersMap(room) {
    const legacy = {};
    Object.entries(room.players || {}).forEach(([id, p]) => {
      legacy[id] = p?.name || "";
    });
    return legacy;
  }

  function broadcastState(roomId) {
    const room = getRoom(roomId);
    if (!room) return;
    normalizeRoomPlayers(room);
    const total = getTotal(room);
    room.participants = getParticipantCount(roomId);
    if (room.participants > 0 && room.currentTurn >= getPlayerNames(room).length) {
      room.currentTurn = 0;
    }
    io.to(roomId).emit("roomState", {
      ...room,
      playersV2: room.players,
      players: toLegacyPlayersMap(room),
      total
    });
  }

  io.on("connection", (socket) => {

    socket.on("joinRoom", (data) => {
      const { roomId: rawRoomId, name } = typeof data === "string"
        ? { roomId: data, name: "" }
        : (data || {});
      if (!rawRoomId || typeof rawRoomId !== "string") return;
      let roomId = rawRoomId.trim().toUpperCase().slice(0, 12);
      if (!roomId) return;

      // IP-based rate limit for room creation/joining to prevent spammer creating 1000s of rooms
      const clientIp = socket.handshake.address || socket.id;
      if (isRateLimited(clientIp, "joinRoom", 200)) return; // Max 5 joins per second per IP

      // Leave previous rooms
      socket.rooms.forEach(r => { if (r !== socket.id) socket.leave(r); });

      const existingRoom = getRoom(roomId);

      if (existingRoom && getParticipantCount(roomId) >= MAX_PLAYERS_PER_ROOM) {
        if (!existingRoom.players[socket.id]) { // Allow reconnects but not new players
          socket.emit("roomLocked", { reason: `Room is full (max ${MAX_PLAYERS_PER_ROOM})` });
          return;
        }
      }

      if (existingRoom && existingRoom.isLocked === true) {
        socket.emit("roomLocked", { reason: "Room is locked by host" });
        return;
      }

      socket.join(roomId);
      socket.data.roomId = roomId;

      if (!existingRoom) {
        const newRoom = createRoom();
        updateActivity(newRoom);
        rooms[roomId] = newRoom;
        if (logger) logger.info({ room: roomId }, "ROOM_CREATED");
      }

      const room = getRoom(roomId);
      normalizeRoomPlayers(room);
      const safeName = typeof name === "string" ? name.trim().slice(0, 20) : "";
      let finalName = safeName;
      if (!finalName) {
        const nextIndex = Object.keys(room.players).length + 1;
        finalName = `Player ${nextIndex}`;
      }

      Object.keys(room.players).forEach(id => {
        if (!io.sockets.sockets.has(id)) delete room.players[id];
      });

      const names = getPlayerNames(room);
      if (names.includes(finalName)) {
        let suffix = 2;
        while (names.includes(`${finalName} ${suffix}`)) suffix += 1;
        finalName = `${finalName} ${suffix}`;
      }

      room.players[socket.id] = {
        id: socket.id,
        name: finalName,
        isHost: false,
        joinedAt: Date.now()
      };

      if (Object.keys(room.players).length === 1) {
        assignHost(room, socket.id);
      }

      if (!room.language) room.language = "en";
      if (room.scores[finalName] == null) room.scores[finalName] = 0;
      updateActivity(room);

      if (logger) logger.info({ room: roomId, participants: getParticipantCount(roomId) }, "PLAYER_JOINED");
      broadcastState(roomId);
    });

    socket.on("changeCategory", ({ roomId, category }) => {
      if (isRateLimited(socket.id, "changeCategory", 300)) return;
      const room = getRoom(roomId);
      if (!room) return;
      normalizeRoomPlayers(room);
      if (!isHost(socket, room)) return;
      const safeCategory = typeof category === "string"
        ? category.toLowerCase().replace(/[^a-z]/g, "")
        : "";
      if (!VALID_CATEGORIES.includes(safeCategory)) return;

      const prevCategory = changeCategory(room, safeCategory);
      if (!prevCategory) return;
      updateActivity(room);
      if (logger) logger.info({ room: roomId, from: prevCategory, to: safeCategory }, "CATEGORY_CHANGED");

      broadcastState(roomId);
    });

    socket.on("changeLanguage", ({ roomId, language }) => {
      if (isRateLimited(socket.id, "changeLanguage", 1000)) return;
      const room = getRoom(roomId);
      if (!room) return;
      normalizeRoomPlayers(room);
      if (!isHost(socket, room)) return;
      const safeLang = typeof language === "string" ? language.toLowerCase().replace(/[^a-z]/g, "") : "";
      if (!VALID_LANGUAGES.includes(safeLang)) return;

      const prevLang = changeLanguage(room, safeLang);
      if (!prevLang) return;
      updateActivity(room);
      if (logger) logger.info({ room: roomId, from: prevLang, to: safeLang }, "LANGUAGE_CHANGED");

      broadcastState(roomId);
    });

    socket.on("setTimer", ({ roomId, enabled, duration }) => {
      // Remove noisy console.log
      if (isRateLimited(socket.id, "setTimer", 1000)) return;
      const room = getRoom(roomId);
      if (!room) return;
      normalizeRoomPlayers(room);
      if (!isHost(socket, room)) return;
      const dur = Number(duration);
      if (![30, 60, 90].includes(dur)) return;
      room.timerEnabled = !!enabled;
      room.timerDuration = dur;
      updateActivity(room);
      broadcastState(roomId);
    });

    socket.on("toggleRoomLock", ({ roomId }) => {
      if (isRateLimited(socket.id, "toggleRoomLock", 500)) return;
      const room = getRoom(roomId);
      if (!room) return;
      normalizeRoomPlayers(room);
      if (!isHost(socket, room)) return;
      room.isLocked = !room.isLocked;
      updateActivity(room);
      broadcastState(roomId);
    });

    socket.on("nextQuestion", ({ roomId }) => {
      if (isRateLimited(socket.id, "nextQuestion", 500)) return;
      const room = getRoom(roomId);
      if (!room) return;
      normalizeRoomPlayers(room);
      if (!isHost(socket, room)) return;

      const nameCount = getPlayerNames(room).length;
      const question = nextQuestion(room, nameCount);
      updateActivity(room);
      if (logger) logger.info({ room: roomId, q: truncate(question) }, "QUESTION_SERVED");

      broadcastState(roomId);
    });

    socket.on("skipQuestion", ({ roomId }) => {
      if (isRateLimited(socket.id, "skipQuestion", 200)) return;
      const room = getRoom(roomId);
      if (!room) return;

      normalizeRoomPlayers(room);
      if (!isHost(socket, room)) return;

      const question = skipQuestion(room);
      if (!question) return;
      updateActivity(room);
      if (logger) logger.info({ room: roomId, q: truncate(room.currentQuestion) }, "QUESTION_SKIPPED_SERVED");

      broadcastState(roomId);
    });

    socket.on("sendReaction", ({ roomId, emoji }) => {
      if (isRateLimited(socket.id, "sendReaction", 800)) return;
      const room = getRoom(roomId);
      if (!room) return;
      normalizeRoomPlayers(room);
      // Remove noisy console.log
      const emojiStr = String(emoji).trim();
      const base = emojiStr.replace(/\uFE0F/g, "");
      const VALID = ["\u{1F525}", "\u{1F602}", "\u{1F62E}"].map(e => e.replace(/\uFE0F/g, ""));
      VALID.push("\u2764");
      if (!VALID.includes(base)) return;
      const player = room.players[socket.id];
      const name = player?.name;
      updateActivity(room);
      io.to(roomId).emit("reaction", { emoji: emojiStr, name });
    });

    socket.on("resetRoom", (roomId) => {
      if (isRateLimited(socket.id, "resetRoom", 1000)) return;
      const room = getRoom(roomId);
      if (!room) return;
      normalizeRoomPlayers(room);
      if (!isHost(socket, room)) return;

      resetRoom(room);
      updateActivity(room);
      if (logger) logger.info({ room: roomId }, "ROOM_RESET");

      broadcastState(roomId);
    });

    socket.on("castVote", ({ roomId, votedFor }) => {
      const room = getRoom(roomId);
      if (!room) return;
      normalizeRoomPlayers(room);
      const voter = room.players[socket.id];
      const voterName = voter?.name;
      if (!voterName) return;
      const names = getPlayerNames(room);
      if (!names.includes(votedFor)) return;
      if (voterName === votedFor) return;
      if (room.votedThisRound[socket.id]) return;

      room.scores[votedFor] = (room.scores[votedFor] || 0) + 1;
      room.votedThisRound[socket.id] = true;
      updateActivity(room);
      broadcastState(roomId);
    });

    socket.on("disconnecting", () => {
      socket.rooms.forEach(roomId => {
        if (roomId !== socket.id) {
          const remaining = Math.max(0, getParticipantCount(roomId) - 1);
          const room = getRoom(roomId);
          if (room) {
            normalizeRoomPlayers(room);
            const wasHost = room.players[socket.id]?.isHost === true;
            delete room.players[socket.id];
            if (wasHost) {
              const newHostId = reassignHost(room);
              if (newHostId) {
                updateActivity(room);
                io.to(roomId).emit("hostUpdated", { id: newHostId });
              }
            }
          }
          if (logger) logger.info({ room: roomId, participants: remaining }, "PLAYER_DISCONNECTED");
          const liveRoom = io.sockets.adapter.rooms.get(roomId);
          if (!liveRoom || liveRoom.size <= 1) {
            // Last person leaving — clean up after short delay to allow rejoin
            setTimeout(() => {
              const r = io.sockets.adapter.rooms.get(roomId);
              if (!r || r.size === 0) {
                deleteRoom(roomId);
              }
            }, 5000);
          } else {
            // Update participant count for remaining members
            setTimeout(() => broadcastState(roomId), 100);
          }
        }
      });
      // Clean up rate limit entries
      Object.keys(rateLimits).forEach(k => {
        if (k.startsWith(socket.id)) delete rateLimits[k];
      });
    });

  });
};
