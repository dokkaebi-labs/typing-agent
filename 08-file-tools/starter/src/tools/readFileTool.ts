/**
 * readFileTool - 파일 읽기 (이전 강의에서 완성)
 */

import { tool } from 'ai';
import { z } from 'zod';
import { readFile, stat } from 'fs/promises';
import path from 'path';

export const readFileTool = tool({
  description: '주어진 경로의 파일 내용을 읽어서 반환합니다',
  inputSchema: z.object({
    filePath: z.string().describe('읽을 파일의 경로'),
  }),
  execute: async ({ filePath }: { filePath: string }) => {
    const resolvedPath = path.resolve(filePath);
    try {
      const fileStat = await stat(resolvedPath);

      if (fileStat.isDirectory()) {
        return `오류: ${resolvedPath}는 디렉토리입니다`;
      }

      const content = await readFile(resolvedPath, 'utf-8');
      return content;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return `오류: 파일을 찾을 수 없습니다: ${resolvedPath}`;
      }
      return `오류: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
