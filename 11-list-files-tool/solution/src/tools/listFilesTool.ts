/**
 * 11강: listFilesTool - 프로젝트 시야 (완성 코드)
 *
 * 이 Tool은 Agent에게 '시야'를 제공합니다.
 * readFileTool이 '눈'(돋보기)이라면, listFilesTool은 '시야'(전체 조망)입니다.
 *
 * 기능:
 * - 디렉토리 내 파일/폴더 목록 반환
 * - 하위 폴더까지 재귀적으로 탐색
 * - .git, node_modules 등 불필요한 폴더 제외
 */

import { tool } from 'ai';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

// 제외할 디렉토리 목록
const EXCLUDED_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  '.idea',
  '.vscode',
]);

// 제외 여부 확인 함수
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
    // 상대 경로를 절대 경로로 변환
    const absolutePath = path.resolve(dirPath);

    // 경로 존재 여부 확인
    if (!fs.existsSync(absolutePath)) {
      return `오류: 경로를 찾을 수 없습니다 - ${dirPath}`;
    }

    // 디렉토리 여부 확인
    const stats = fs.statSync(absolutePath);
    if (!stats.isDirectory()) {
      return `오류: 경로가 디렉토리가 아닙니다 - ${dirPath}`;
    }

    // 결과 저장 배열
    const files: string[] = [];

    // 재귀 탐색 함수
    function walkDirectory(currentPath: string, basePath: string) {
      let entries: string[];
      try {
        entries = fs.readdirSync(currentPath);
      } catch {
        return; // 읽기 권한 없으면 건너뜀
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
