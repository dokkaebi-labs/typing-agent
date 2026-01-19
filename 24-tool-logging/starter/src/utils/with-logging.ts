/**
 * 24강: withLogging 래퍼 (실습 코드 - 선택)
 *
 * Tool을 감싸서 시작/완료 시점에 자동으로 로깅합니다.
 */

import { tool } from 'ai';
import { z } from 'zod';
import { ToolLogger } from '../ui/tool-logger';

const logger = new ToolLogger();

// TODO: withLogging 래퍼 함수 구현
// 기존 tool() 함수를 감싸서 로깅을 추가합니다.
//
// 사용 예시:
// export const readFileTool = withLogging(
//   'readFile',
//   readFileSchema,
//   '파일의 내용을 읽습니다',
//   async ({ path }) => {
//     const content = await fs.readFile(path, 'utf-8');
//     return content;
//   }
// );

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
      // TODO 1: 시작 로깅
      // logger.logToolStart(toolName, input);

      try {
        // TODO 2: 실제 실행
        const result = await execute(input);

        // TODO 3: 완료 로깅
        // logger.logToolComplete(toolName, result);

        return result;
      } catch (error) {
        // TODO 4: 실패 로깅
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        // logger.logToolError(toolName, errorMessage);

        return `Error: ${errorMessage}`;
      }
    },
  });
}
