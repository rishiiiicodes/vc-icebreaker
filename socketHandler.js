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
  isTurn,
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
    // Store IP once at connection time — used for rate limiting sensitive events.
    // Falls back to socket.id if IP is unavailable (e.g. local dev behind proxy).
    const clientIp = socket.handshake.address || socket.id;

    socket.on("joinRoom", (data) => {
      const { roomId: rawRoomId, name } = typeof data === "string"
        ? { roomId: data, name: "" }
        : (data || {});
      if (!rawRoomId || typeof rawRoomId !== "string") return;
      let roomId = rawRoomId.trim().toUpperCase().slice(0, 12);
      if (!roomId || roomId.length < 2) return;

      // IP-based rate limit for room creation/joining to prevent spammer creating 1000s of rooms
      if (isRateLimited(clientIp, "joinRoom", 200)) return; // Max 5 joins per second per IP

      // Leave previous rooms
      socket.rooms.forEach(r => { if (r !== socket.id) socket.leave(r); });

      const existingRoom = getRoom(roomId);
      const safeName = typeof name === "string" ? name.trim().slice(0, 20) : "";

      // Allow reconnections to full/locked rooms if the name matches an existing slot
      // Allow reconnections to full/locked rooms if the name matches an existing slot that is currently disconnected
      const isReconnecting = existingRoom && Object.entries(existingRoom.players).some(([id, p]) => p.name === safeName && !io.sockets.sockets.has(id));

      if (existingRoom && !isReconnecting && getParticipantCount(roomId) >= MAX_PLAYERS_PER_ROOM) {
        socket.emit("roomLocked", { reason: `Room is full (max ${MAX_PLAYERS_PER_ROOM})` });
        return;
      }

      if (existingRoom && !isReconnecting && existingRoom.isLocked === true) {
        socket.emit("roomLocked", { reason: "Room is locked by host" });
        return;
      }

      socket.join(roomId);
      socket.data.roomId = roomId;

      if (!existingRoom) {
        const newRoom = createRoom();
        newRoom.gamePhase = "category_select"; // Set to category selection for new rooms
        updateActivity(newRoom);
        rooms[roomId] = newRoom;
        if (logger) logger.info({ room: roomId }, "ROOM_CREATED");
      }

      const room = getRoom(roomId);
      normalizeRoomPlayers(room);

      // Clean up ghost players (sockets that are gone)
      const currentSocketIds = Array.from(io.sockets.sockets.keys());
      Object.keys(room.players).forEach(id => {
        if (!currentSocketIds.includes(id)) delete room.players[id];
      });

      let finalName = safeName || `Player ${Object.keys(room.players).length + 1}`;

      const names = getPlayerNames(room);
      if (names.includes(finalName)) {
        // If it's a reconnect, take over the old slot instead of duplicating
        const oldEntry = Object.entries(room.players).find(([id, p]) => p.name === finalName && !io.sockets.sockets.has(id));
        if (oldEntry) {
          delete room.players[oldEntry[0]];
        } else {
          let suffix = 2;
          while (names.includes(`${finalName} ${suffix}`)) suffix += 1;
          finalName = `${finalName} ${suffix}`;
        }
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
      if (isRateLimited(socket.id, "changeCategory", 1000)) return;
      const room = getRoom(roomId);
      if (!room) return;
      normalizeRoomPlayers(room);
      if (!isHost(socket, room)) return;
      const safeCategory = typeof category === "string"
        ? category.toLowerCase().replace(/[^a-z]/g, "")
        : "";
      changeCategory(room, safeCategory);

      updateActivity(room);

      if (logger) logger.info({ room: roomId, participants: getParticipantCount(roomId) }, "CATEGORY_CHANGED");
      broadcastState(roomId);
    });

    socket.on("setMood", ({ roomId, mood }) => {
      if (isRateLimited(socket.id, "setMood", 1000)) return;
      const room = getRoom(roomId);
      if (!room) return;
      
      // Store player's mood
      room.playerMoods[socket.id] = mood;
      
      // Recalculate dominant mood
      const moodCounts = {};
      Object.values(room.playerMoods).forEach(playerMood => {
        if (playerMood) {
          moodCounts[playerMood] = (moodCounts[playerMood] || 0) + 1;
        }
      });
      
      // Find most common mood (ties broken randomly)
      let maxCount = 0;
      let dominantMood = null;
      Object.entries(moodCounts).forEach(([moodName, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantMood = moodName;
        } else if (count === maxCount && Math.random() < 0.5) {
          // Random tie-breaker
          dominantMood = moodName;
        }
      });
      
      room.dominantMood = dominantMood;
      updateActivity(room);
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
      if (isRateLimited(socket.id, "setTimer", 500)) return;
      const room = getRoom(roomId);
      if (!room) return;
      normalizeRoomPlayers(room);
      if (!isHost(socket, room)) return;
      const dur = Math.floor(Number(duration));
      // Accept any positive integer 10–600 seconds (custom timer support)
      if (!Number.isFinite(dur) || dur < 10 || dur > 600) return;
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
      if (isRateLimited(clientIp, "nextQuestion", 500)) return;
      const room = getRoom(roomId);
      if (!room) return;
      normalizeRoomPlayers(room);
      if (!isHost(socket, room) && !isTurn(socket.id, room)) return;

      const nameCount = getPlayerNames(room).length;
      const question = nextQuestion(room, nameCount);
      updateActivity(room);
      if (logger) logger.info({ room: roomId, q: truncate(question) }, "QUESTION_SERVED");

      broadcastState(roomId);
    });

    socket.on("skipQuestion", ({ roomId }) => {
      if (isRateLimited(clientIp, "skipQuestion", 200)) return;
      const room = getRoom(roomId);
      if (!room) return;

      normalizeRoomPlayers(room);
      if (!isHost(socket, room) && !isTurn(socket.id, room)) return;

      const question = skipQuestion(room);
      updateActivity(room);
      if (question) {
        if (logger) logger.info({ room: roomId, q: truncate(room.currentQuestion) }, "QUESTION_SKIPPED_SERVED");
      } else {
        if (logger) logger.info({ room: roomId }, "QUESTION_SKIPPED_POOL_EXHAUSTED");
      }
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
      if (isRateLimited(clientIp, "resetRoom", 1000)) return;
      const room = getRoom(roomId);
      if (!room) return;
      normalizeRoomPlayers(room);
      if (!isHost(socket, room)) return;

      resetRoom(room);
      updateActivity(room);
      if (logger) logger.info({ room: roomId }, "ROOM_RESET");

      broadcastState(roomId);
    });

    socket.on("transferHost", ({ roomId, targetId }) => {
      const room = getRoom(roomId);
      if (!room) return;
      if (!isHost(socket, room)) return;

      const target = room.players[targetId];
      if (!target) return;

      assignHost(room, targetId);
      updateActivity(room);
      
      // Emit host change event to all players
      io.to(roomId).emit("hostChanged", { newHostName: target.name });
      broadcastState(roomId);

      if (logger) logger.info({ room: roomId, from: socket.id, to: targetId }, "HOST_TRANSFERRED");
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

      // Question-specific score (resets on next/reset)
      room.scores[votedFor] = (room.scores[votedFor] || 0) + 1;
      room.votedThisRound[socket.id] = true;

      // Category-persistent score
      const cat = room.category || "all";
      if (!room.categoryScores[cat]) room.categoryScores[cat] = {};
      room.categoryScores[cat][votedFor] = (room.categoryScores[cat][votedFor] || 0) + 1;

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
                const newHost = room.players[newHostId];
                updateActivity(room);
                io.to(roomId).emit("hostUpdated", { id: newHostId });
                // Emit host change notification
                if (newHost) {
                  io.to(roomId).emit("hostChanged", { newHostName: newHost.name });
                }
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
      // Clean up rate limit entries for both socket ID and IP keys
      Object.keys(rateLimits).forEach(k => {
        if (k.startsWith(socket.id) || k.startsWith(clientIp)) delete rateLimits[k];
      });
    });

    socket.on("startGame", ({ roomId }) => {
      const room = getRoom(roomId);
      if (!room) return;
      normalizeRoomPlayers(room);
      if (!isHost(socket, room)) return;
      
      // Validate room exists and gamePhase is "category_select"
      if (room.gamePhase !== "category_select") return;
      
      // Validate a category has been selected (room.category exists)
      if (!room.category || room.category === "all") return;
      
      // Set room.gamePhase = "playing"
      room.gamePhase = "playing";
      updateActivity(room);
      broadcastState(roomId);
      
      if (logger) logger.info({ room: roomId, category: room.category }, "GAME_STARTED");
    });

  });
};