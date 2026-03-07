const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const compression = require("compression");

const config = require("./config");
const logger = require("./utils/logger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const socketHandler = require("./socketHandler");

const app = express();
const server = http.createServer(app);

// Trust proxy for accurate IP addresses behind load balancers
app.set("trust proxy", 1);

// Compression middleware
app.use(compression());

// Security headers - keep simple to not break PWA or WebGL
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  hsts: config.nodeEnv === "production" ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false
}));

// CORS
app.use(cors({ 
  origin: config.allowedOrigins,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindow,
  max: config.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" }
});

app.use(limiter);

// Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Static files with caching
app.use(express.static("public", {
  maxAge: config.nodeEnv === "production" ? "1d" : 0,
  etag: true
}));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Metrics endpoint (optional)
if (config.features.advancedMetrics) {
  app.get("/metrics", (req, res) => {
    const memUsage = process.memoryUsage();
    res.status(200).json({
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`
      },
      nodeVersion: process.version
    });
  });
}

// Socket.io setup
const io = new Server(server, {
  cors: { 
    origin: config.allowedOrigins,
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ["websocket", "polling"]
});

socketHandler(io, logger);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

server.listen(config.port, "0.0.0.0", () => {
  logger.info({
    port: config.port,
    env: config.nodeEnv,
    origins: config.allowedOrigins
  }, "Server started successfully");
});

// Graceful shutdown
function shutdown() {
  logger.info("SIGTERM/SIGINT received. Shutting down gracefully...");

  // Stop accepting new HTTP connections and drain any in-flight requests.
  // closeAllConnections() is available in Node 18.2+; skip gracefully on older versions.
  if (typeof server.closeAllConnections === "function") {
    server.closeAllConnections();
  }

  io.close(() => {
    logger.info("Socket.io and HTTP server closed.");
    process.exit(0);
  });
  setTimeout(() => {
    logger.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);