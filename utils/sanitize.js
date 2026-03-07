/**
 * Data sanitization utilities
 */

/**
 * Remove potentially dangerous characters from strings
 * @param {string} str - Input string
 * @param {number} maxLength - Maximum length
 * @returns {string} Sanitized string
 */
function sanitizeString(str, maxLength = 100) {
  if (typeof str !== "string") return "";
  
  return str
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets to prevent HTML injection
    .slice(0, maxLength);
}

/**
 * Sanitize room state before sending to clients
 * Removes sensitive server-side data
 * @param {object} room - Room object
 * @returns {object} Sanitized room object
 */
function sanitizeRoomState(room) {
  if (!room) return null;
  
  const {
    lastActivity, // Don't expose internal timestamps
    ...safeRoom
  } = room;
  
  return safeRoom;
}

/**
 * Sanitize player data before broadcasting
 * @param {object} player - Player object
 * @returns {object} Sanitized player object
 */
function sanitizePlayerData(player) {
  if (!player) return null;
  
  return {
    id: player.id,
    name: sanitizeString(player.name, 20),
    isHost: !!player.isHost,
    joinedAt: player.joinedAt
  };
}

/**
 * Sanitize error messages for client consumption
 * @param {Error|string} error - Error object or message
 * @param {boolean} isDevelopment - Whether in development mode
 * @returns {string} Safe error message
 */
function sanitizeErrorMessage(error, isDevelopment = false) {
  if (isDevelopment) {
    return error instanceof Error ? error.message : String(error);
  }
  
  // In production, return generic messages
  const genericMessages = {
    "ECONNREFUSED": "Connection refused",
    "ETIMEDOUT": "Request timeout",
    "ENOTFOUND": "Resource not found"
  };
  
  if (error instanceof Error && error.code) {
    return genericMessages[error.code] || "An error occurred";
  }
  
  return "An error occurred";
}

module.exports = {
  sanitizeString,
  sanitizeRoomState,
  sanitizePlayerData,
  sanitizeErrorMessage
};
