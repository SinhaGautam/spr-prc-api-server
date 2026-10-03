import { pathToFileURL } from "node:url";
import { closeDatabase, connectDatabase } from "./infrastructure/mongodb/MongoDatabase";
import { logger } from "./core/logging/Logger";
import { config } from "./core/config/Environment";

export async function startServer(port = config.port) {
  await connectDatabase();
  const { default: app } = await import("./app");

  const server = app.listen(port, () => {
    logger.info({ port }, "Server listening");
  });

  const shutdown = async (signal: NodeJS.Signals) => {
    logger.warn({ signal }, "Shutdown signal received");
    const forceExit = setTimeout(() => process.exit(1), 10_000);
    forceExit.unref();

    server.close(async (err) => {
      if (err) logger.error({ err }, "Error closing HTTP server");
      await closeDatabase();
      clearTimeout(forceExit);
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
