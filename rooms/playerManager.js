function normalizeRoomPlayers(room) {
  if (!room || !room.players || room._playersMigrated) return;
  room._playersMigrated = true;
  Object.entries(room.players).forEach(([id, p]) => {
    if (typeof p === "string") {
      room.players[id] = {
        id,
        name: p,
        isHost: false,
        joinedAt: room.lastActivity || Date.now()
      };
      return;
    }
    if (!p || typeof p !== "object") return;
    if (p.id !== id) p.id = id;
    if (typeof p.name !== "string") p.name = String(p.name || "");
    if (typeof p.isHost !== "boolean") p.isHost = false;
    if (typeof p.joinedAt !== "number") p.joinedAt = room.lastActivity || Date.now();
  });
}

function getPlayerNames(room) {
  return Object.values(room.players || {}).map(p => p?.name).filter(Boolean);
}

function isHost(socket, room) {
  if (!room) return false;
  normalizeRoomPlayers(room);
  return room.players[socket.id]?.isHost === true;
}

function assignHost(room, socketId) {
  if (!room || !room.players || !socketId) return null;
  normalizeRoomPlayers(room);
  Object.values(room.players).forEach(p => { if (p) p.isHost = false; });
  if (room.players[socketId]) {
    room.players[socketId].isHost = true;
    return socketId;
  }
  return null;
}

function reassignHost(room) {
  if (!room || !room.players) return null;
  normalizeRoomPlayers(room);
  const remaining = Object.values(room.players || {});
  if (remaining.length === 0) return null;
  let nextHost = null;
  remaining.forEach(p => {
    if (!p) return;
    if (!nextHost || (p.joinedAt || Infinity) < (nextHost.joinedAt || Infinity)) {
      nextHost = p;
    }
  });
  if (!nextHost) return null;
  remaining.forEach(p => { if (p) p.isHost = false; });
  nextHost.isHost = true;
  return nextHost.id || null;
}

function isTurn(socketId, room) {
  if (!room || !room.players || !socketId) return false;
  normalizeRoomPlayers(room);
  const players = Object.values(room.players);
  if (players.length === 0) return false;
  const idx = ((Number(room.currentTurn || 0) % players.length) + players.length) % players.length;
  return players[idx]?.id === socketId;
}

module.exports = {
  normalizeRoomPlayers,
  isHost,
  isTurn,
  assignHost,
  reassignHost,
  getPlayerNames
};
