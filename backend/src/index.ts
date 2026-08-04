import app from "./app.js";
import { env } from "./core/config/env.js";
import { connectDatabase } from "./core/database/database.js";
import { logger } from "./core/logger/logger.js";

await connectDatabase();
const server = app.listen(env.PORT, () => {
  logger.info(`Server running on http://localhost:${env.PORT}`);
});

const shutdown = (signal: string) => {
  logger.info(`${signal} received. Shutting down...`);

  server.close(() => {
    logger.info("Server stopped.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
