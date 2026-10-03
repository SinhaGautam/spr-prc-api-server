import { logger } from "../logging/logger";

export type ServiceContext = Record<string, unknown>;

export abstract class BaseApiService {
  protected async execute<T>(
    operation: string,
    action: () => Promise<T>,
    context?: ServiceContext,
  ): Promise<T> {
    const startedAt = Date.now();

    try {
      const result = await action();

      logger.info(
        {
          ...context,
          operation,
          durationMs: Date.now() - startedAt,
        },
        "Application service operation completed",
      );

      return result;
    } catch (error) {
      logger.error(
        {
          ...context,
          operation,
          durationMs: Date.now() - startedAt,
          err: error,
        },
        "Application service operation failed",
      );

      throw error;
    }
  }
}
