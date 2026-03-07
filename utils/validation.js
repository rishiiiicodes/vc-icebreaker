/**
 * Input validation utilities
 */

const { VALID_CATEGORIES, VALID_LANGUAGES } = require("../rooms/questionEngine");

const ROOM_CODE_REGEX = /^[A-Z0-9]{2,12}$/;
const NAME_MAX_LENGTH = 20;
const VALID_EMOJIS = ["🔥", "😂", "😮", "❤️", "❤"];
const VALID_MOODS = ["chill", "hype", "chaotic", "deep"];

function sanitizeString(str, maxLength = 100) {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, maxLength);
}

function validateRoomId(roomId) {
  if (!roomId || typeof roomId !== "string") {
    return { valid: false, error: "Room ID is required" };
  }
  
  const normalized = roomId.trim().toUpperCase().slice(0, 12);
  
  if (!ROOM_CODE_REGEX.test(normalized)) {
    return { valid: false, error: "Invalid room code format" };
  }
  
  return { valid: true, value: normalized };
}

function validatePlayerName(name) {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "Name is required" };
  }
  
  const sanitized = sanitizeString(name, NAME_MAX_LENGTH);
  
  if (sanitized.length < 1) {
    return { valid: false, error: "Name must be at least 1 character" };
  }
  
  return { valid: true, value: sanitized };
}

function validateCategory(category) {
  if (!category || typeof category !== "string") {
    return { valid: false, error: "Category is required" };
  }
  
  const normalized = category.toLowerCase().replace(/[^a-z]/g, "");
  
  if (!VALID_CATEGORIES.includes(normalized)) {
    return { valid: false, error: "Invalid category" };
  }
  
  return { valid: true, value: normalized };
}

function validateLanguage(language) {
  if (!language || typeof language !== "string") {
    return { valid: false, error: "Language is required" };
  }
  
  const normalized = language.toLowerCase().replace(/[^a-z]/g, "");
  
  if (!VALID_LANGUAGES.includes(normalized)) {
    return { valid: false, error: "Invalid language" };
  }
  
  return { valid: true, value: normalized };
}

function validateTimerDuration(duration) {
  const dur = Math.floor(Number(duration));
  
  if (!Number.isFinite(dur) || dur < 10 || dur > 600) {
    return { valid: false, error: "Timer duration must be between 10 and 600 seconds" };
  }
  
  return { valid: true, value: dur };
}

function validateEmoji(emoji) {
  if (!emoji || typeof emoji !== "string") {
    return { valid: false, error: "Emoji is required" };
  }
  
  const emojiStr = String(emoji).trim();
  const base = emojiStr.replace(/\uFE0F/g, "");
  
  if (!VALID_EMOJIS.includes(base)) {
    return { valid: false, error: "Invalid emoji" };
  }
  
  return { valid: true, value: emojiStr };
}

function validateMood(mood) {
  if (!mood || typeof mood !== "string") {
    return { valid: false, error: "Mood is required" };
  }
  
  const normalized = mood.toLowerCase().trim();
  
  if (!VALID_MOODS.includes(normalized)) {
    return { valid: false, error: "Invalid mood. Must be one of: chill, hype, chaotic, deep" };
  }
  
  return { valid: true, value: normalized };
}

module.exports = {
  sanitizeString,
  validateRoomId,
  validatePlayerName,
  validateCategory,
  validateLanguage,
  validateTimerDuration,
  validateEmoji,
  validateMood,
  VALID_CATEGORIES,
  VALID_LANGUAGES,
  VALID_MOODS
};
