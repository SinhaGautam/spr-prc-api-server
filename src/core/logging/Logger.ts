import pino from "pino";
import { E } from "../config/Environment";

export const logger = pino({
  name: E.APP_NAME,
  level: E.LOG_LEVEL,
  base: { service: E.APP_NAME, environment: E.NODE_ENV },
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
    "authorization",
    "token",
    "pushToken",
  ],
  ...(E.NODE_ENV === "production"
    ? {}
    : { transport: { target: "pino-pretty", options: { colorize: true } } }),
});
