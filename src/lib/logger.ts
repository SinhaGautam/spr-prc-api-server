import pino from "pino";
import { config } from "../config/env";

const isProduction = config.nodeEnv === "production";

export const logger = pino({
  name: config.appName,
  level: config.logLevel,
  base: {
    service: config.appName,
    environment: config.nodeEnv,
  },
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
    "authorization",
  ],
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }),
});
