/**
 * codeSearchTool - 코드베이스 검색 (15강에서 만든 Tool 재사용)
 */

import { tool } from 'ai';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const codeSearchTool = tool({
  description: `ripgrep을 사용해 코드를 검색합니다. 정규식을 지원합니다.
파일 경로, 라인 번호, 매칭된 내용을 반환합니다.
가독성을 위해 결과를 50개로 제한합니다.
예시:
- pattern="TODO" → TODO 주석 찾기
- pattern="async function" fileType="ts" → TypeScript에서 async 함수
- pattern="class.*implements" → 클래스 구현 정규식 검색`,
  inputSchema: z.object({
    pattern: z.string().describe('검색 패턴 (정규식 지원)'),
    path: z.string().default('.').describe('검색할 경로 (기본값: 현재 디렉토리)'),
    fileType: z
      .string()
      .optional()
      .describe("파일 타입 필터 (예: 'ts', 'js', 'py')"),
    caseSensitive: z.boolean().default(false).describe('대소문자 구분 여부'),
  }),
  execute: async ({ pattern, path = '.', fileType, caseSensitive = false }) => {
    // ripgrep 명령어 조립
    const args: string[] = [
      '--line-number', // 라인 번호 표시
      '--with-filename', // 파일명 표시
      '--color=never', // 컬러 코드 제거 (중요!)
      '--no-heading', // 파일별 그룹화 안 함
    ];

    // 대소문자 구분 옵션
    if (!caseSensitive) {
      args.push('--ignore-case');
    }

    // 파일 타입 필터
    if (fileType) {
      args.push('--type', fileType);
    }

    // 패턴과 경로 추가 (특수문자 처리를 위해 따옴표로 감싸기)
    args.push(`"${pattern}"`);
    args.push(path);

    const command = `rg ${args.join(' ')}`;

    try {
      const { stdout } = await execAsync(command, {
        timeout: 30000, // 30초 타임아웃
        maxBuffer: 1024 * 1024 * 5, // 5MB 버퍼
      });

      // 결과 처리
      const lines = stdout
        .trim()
        .split('\n')
        .filter((line) => line.length > 0);

      if (lines.length === 0) {
        return `검색 결과 없음: '${pattern}'`;
      }

      // 50개 초과면 처음 50개만 표시
      if (lines.length > 50) {
        const truncated = lines.slice(0, 50).join('\n');
        return `${lines.length}개 결과 발견 (처음 50개만 표시):\n\n${truncated}\n\n... ${lines.length - 50}개 결과 생략`;
      }

      return `${lines.length}개 결과 발견:\n\n${stdout.trim()}`;
    } catch (error) {
      // exitCode 1은 "검색 결과 없음" (에러가 아님!)
      if (error instanceof Error && 'code' in error && error.code === 1) {
        return `검색 결과 없음: '${pattern}'`;
      }

      // 타임아웃
      if (error instanceof Error && 'killed' in error && error.killed) {
        return '타임아웃: 30초 초과';
      }

      // 진짜 에러
      return `ripgrep 오류: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
