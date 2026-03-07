require("dotenv").config();

const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  
  // Security
  allowedOrigins: process.env.ALLOWED_ORIGINS === "*" 
    ? "*" 
    : (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean),
  
  // Room settings
  maxPlayersPerRoom: parseInt(process.env.MAX_PLAYERS_PER_ROOM || "50", 10),
  roomCleanupInterval: parseInt(process.env.ROOM_CLEANUP_INTERVAL_MS || "300000", 10),
  roomInactivityTTL: parseInt(process.env.ROOM_INACTIVITY_TTL_MS || "1800000", 10),
  
  // Logging
  logLevel: process.env.LOG_LEVEL || "info",
  
  // Rate limiting
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  
  // Redis (for future horizontal scaling)
  redisUrl: process.env.REDIS_URL,
  enableRedis: process.env.ENABLE_REDIS === "true",
  
  // Feature flags
  features: {
    analytics: process.env.ENABLE_ANALYTICS === "true",
    advancedMetrics: process.env.ENABLE_ADVANCED_METRICS === "true"
  }
};

// Validation
if (config.maxPlayersPerRoom < 1 || config.maxPlayersPerRoom > 200) {
  throw new Error("MAX_PLAYERS_PER_ROOM must be between 1 and 200");
}

if (config.nodeEnv === "production" && config.allowedOrigins === "*") {
  console.warn("⚠️  WARNING: ALLOWED_ORIGINS is set to '*' in production. This is insecure!");
}

module.exports = config;
