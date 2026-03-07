const config = require("../config");

const rooms = {};

function createRoom(category = "chill") {
  return {
    category,
    usedIndexes: [],
    currentQuestion: null,
    participants: 0,
    currentTurn: -1,
    players: {},
    scores: {}, // per-round/question scores (keyed by socket ID)
    categoryScores: {}, // { categoryName: { socketId: totalWins } }
    votedThisRound: {},
    timerEnabled: false,
    timerDuration: 60,
    isLocked: false,
    lastActivity: Date.now(),
    dominantMood: null, // most common mood among players
    playerMoods: {}, // { socketId: mood } for tracking individual player moods
    gamePhase: "lobby" // "lobby" | "category_select" | "playing"
  };
}

function getRoom(roomId) {
  return rooms[roomId];
}

function deleteRoom(roomId) {
  delete rooms[roomId];
}

function updateActivity(room) {
  if (!room) return;
  room.lastActivity = Date.now();
}

function startCleanup(io, logger) {
  setInterval(() => {
    const now = Date.now();
    const ttl = config.roomInactivityTTL;
    Object.keys(rooms).forEach(roomId => {
      const room = rooms[roomId];
      if (!room) return;
      if (!room.lastActivity) return;
      if (now - room.lastActivity <= ttl) return;
      const liveRoom = io.sockets.adapter.rooms.get(roomId);
      if (liveRoom && liveRoom.size > 0) return;
      delete rooms[roomId];
      if (logger) {
        logger.info({ room: roomId }, "ROOM_CLEANUP - inactive");
      }
    });
  }, config.roomCleanupInterval);
}

module.exports = {
  rooms,
  createRoom,
  getRoom,
  deleteRoom,
  updateActivity,
  startCleanup
};
