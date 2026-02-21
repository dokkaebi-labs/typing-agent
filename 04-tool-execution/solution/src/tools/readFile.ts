import { tool } from 'ai';
import { z } from 'zod';
import { readFile, stat } from 'fs/promises';

export const readFileTool = tool({
  description: '주어진 경로의 파일 내용을 읽어서 반환합니다',
  inputSchema: z.object({
    path: z.string().describe('읽을 파일의 경로'),
  }),
  execute: async ({ path }) => {
    try {
      const fileStat = await stat(path);

      if (fileStat.isDirectory()) {
        return `오류: ${path}는 디렉토리입니다`;
      }

      const content = await readFile(path, 'utf-8');
      return content;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return `오류: 파일을 찾을 수 없습니다: ${path}`;
      }
      return `오류: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
