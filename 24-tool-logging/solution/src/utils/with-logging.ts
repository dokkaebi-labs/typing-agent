/**
 * 24강: withLogging 래퍼 (완성 코드)
 */

import { tool } from 'ai';
import { z } from 'zod';
import { ToolLogger } from '../ui/tool-logger';

const logger = new ToolLogger();

export function withLogging<T extends z.ZodType>(
  toolName: string,
  schema: T,
  description: string,
  execute: (input: z.infer<T>) => Promise<string>
) {
  return tool({
    description,
    inputSchema: schema,
    execute: async (input) => {
      // 시작 로깅
      logger.logToolStart(toolName, input as Record<string, unknown>);

      try {
        const result = await execute(input);

        // 완료 로깅
        logger.logToolComplete(toolName, result);

        return result;
      } catch (error) {
        // 실패 로깅
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        logger.logToolError(toolName, errorMessage);

        return `Error: ${errorMessage}`;
      }
    },
  });
}
