/**
 * listFilesTool - 디렉토리 탐색 (이전 강의에서 완성)
 */

import { tool } from 'ai';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

const EXCLUDED_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  '.idea',
  '.vscode',
]);

function shouldExclude(name: string): boolean {
  return EXCLUDED_DIRS.has(name);
}

export const listFilesTool = tool({
  description:
    '주어진 경로의 디렉토리에서 모든 파일과 폴더를 재귀적으로 탐색합니다. .git, node_modules 등은 제외됩니다.',
  inputSchema: z.object({
    path: z.string().describe('탐색할 디렉토리 경로'),
  }),
  execute: async ({ path: dirPath }) => {
    const absolutePath = path.resolve(dirPath);

    if (!fs.existsSync(absolutePath)) {
      return `오류: 경로를 찾을 수 없습니다 - ${dirPath}`;
    }

    const stats = fs.statSync(absolutePath);
    if (!stats.isDirectory()) {
      return `오류: 경로가 디렉토리가 아닙니다 - ${dirPath}`;
    }

    const files: string[] = [];

    function walkDirectory(currentPath: string, basePath: string) {
      let entries: string[];
      try {
        entries = fs.readdirSync(currentPath);
      } catch {
        return;
      }

      for (const entry of entries) {
        if (shouldExclude(entry)) {
          continue;
        }

        const fullPath = path.join(currentPath, entry);
        const relativePath = path.relative(basePath, fullPath);

        try {
          const entryStats = fs.statSync(fullPath);
          if (entryStats.isDirectory()) {
            files.push(`${relativePath}/`);
            walkDirectory(fullPath, basePath);
          } else {
            files.push(relativePath);
          }
        } catch {
          // 접근 불가 파일은 건너뜀
        }
      }
    }

    walkDirectory(absolutePath, absolutePath);

    if (files.length === 0) {
      return `디렉토리가 비어있습니다: ${dirPath}`;
    }

    return `Found ${files.length} items:\n${files.sort().join('\n')}`;
  },
});
