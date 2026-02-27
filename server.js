require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const cors = require("cors");
const pino = require("pino");
const rateLimit = require("express-rate-limit");

const socketHandler = require("./socketHandler");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty" }
      : undefined,
});

const app = express();
const server = http.createServer(app);

// Keep helmet simple to not break the PWA or WebGL
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS === "*"
  ? "*"
  : (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim());

app.use(cors({ origin: allowedOrigins }));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

const io = new Server(server, {
  cors: { origin: allowedOrigins },
});

app.use(express.static("public"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

socketHandler(io, logger);

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server running on port ${PORT}`);
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