import { pathToFileURL } from "node:url";
import app from "./app";
import { logger } from "./lib/logger";
import { getPort } from "./config/env";
import { closeMongo, connectMongo } from "./lib/mongodb";

export async function startServer(port = getPort()) {
  await connectMongo();

  const server = app.listen(port, () => {
    logger.info({ port }, "Server listening");
  });

  const shutdown = async (signal: NodeJS.Signals) => {
    logger.warn({ signal }, "Shutdown signal received");

    server.close(async (err) => {
      if (err) {
        logger.error({ err }, "Error closing HTTP server");
      }

      await closeMongo();
      process.exit(err ? 1 : 0);
    });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await startServer();
}
