const pino = require("pino");
const config = require("../config");

const logger = pino({
  level: config.logLevel,
  transport: config.nodeEnv !== "production"
    ? { target: "pino-pretty", options: { colorize: true } }
    : undefined,
  formatters: {
    level: (label) => ({ level: label })
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res
  }
});

module.exports = logger;
