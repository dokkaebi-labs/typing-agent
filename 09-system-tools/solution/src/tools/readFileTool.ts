/**
 * readFileTool - 파일 읽기 (이전 강의에서 완성)
 */

import { tool } from 'ai';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

export const readFileTool = tool({
  description: '파일의 내용을 읽어서 반환합니다. 텍스트 파일만 지원합니다.',
  inputSchema: z.object({
    path: z.string().describe('읽을 파일의 경로'),
  }),
  execute: async ({ path: filePath }) => {
    try {
      const absolutePath = path.resolve(filePath);

      if (!fs.existsSync(absolutePath)) {
        return `오류: 파일을 찾을 수 없습니다 - ${filePath}`;
      }

      const stats = fs.statSync(absolutePath);
      if (!stats.isFile()) {
        return `오류: 경로가 파일이 아닙니다 - ${filePath}`;
      }

      const content = fs.readFileSync(absolutePath, 'utf-8');
      return content;
    } catch (error) {
      return `오류: 파일 읽기 실패 - ${error instanceof Error ? error.message : error}`;
    }
  },
});
