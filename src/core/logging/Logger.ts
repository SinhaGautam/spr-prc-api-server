import pino from "pino";
import { config } from "../config/Environment";

export const logger = pino({
  name: config.appName,
  level: config.logLevel,
  base: { service: config.appName, environment: config.environment },
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
    "authorization",
    "token",
    "pushToken",
  ],
  ...(config.environment === "production"
    ? {}
    : { transport: { target: "pino-pretty", options: { colorize: true } } }),
});
