/**
 * Room code generation utilities
 */

const ADJECTIVES = [
  "CHILL", "EPIC", "WILD", "COOL", "BOLD", "FAST", "KEEN", "ZANY",
  "MINT", "NEON", "FIRE", "WAVE", "STAR", "MOON", "NOVA", "FLUX"
];

const NOUNS = [
  "TEAM", "CREW", "PACK", "GANG", "CLUB", "BAND", "UNIT", "HIVE",
  "TRIO", "QUAD", "SQUAD", "GUILD", "FORCE", "TRIBE", "CLAN", "ZONE"
];

/**
 * Generate a unique, memorable room code
 * Format: ADJECTIVE + NOUN + NUMBER (e.g., EPICTEAM42)
 * @returns {string} Room code
 */
function generateRoomCode() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${adj}${noun}${num}`;
}

/**
 * Generate a room code that doesn't exist in the provided set
 * @param {Set<string>} existingCodes - Set of existing room codes
 * @param {number} maxAttempts - Maximum generation attempts
 * @returns {string} Unique room code
 */
function generateUniqueRoomCode(existingCodes, maxAttempts = 100) {
  for (let i = 0; i < maxAttempts; i++) {
    const code = generateRoomCode();
    if (!existingCodes.has(code)) {
      return code;
    }
  }
  
  // Fallback: add timestamp suffix if we can't find unique code
  const code = generateRoomCode();
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  return `${code}${timestamp}`.slice(0, 12);
}

module.exports = {
  generateRoomCode,
  generateUniqueRoomCode,
  ADJECTIVES,
  NOUNS
};
