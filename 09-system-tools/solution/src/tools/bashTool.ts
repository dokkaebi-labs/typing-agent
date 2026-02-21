/**
 * bashTool - 시스템 명령어 실행 (완성 코드)
 *
 * 이 Tool은 Agent에게 '발'을 제공합니다.
 * 시스템 명령어를 실행할 수 있게 되면, 빌드하고, 테스트하고,
 * git 명령을 실행하는 진짜 Coding Agent가 됩니다.
 *
 * 주의: 위험하지만 필수적인 Tool입니다.
 * 보안 고려사항을 반드시 지켜야 합니다.
 */

import { tool } from 'ai';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// 위험한 명령어 목록
const DANGEROUS_COMMANDS = ['rm -rf', 'sudo', 'chmod 777', '> /dev/'];

export const bashTool = tool({
  description: `bash 명령어를 실행하고 결과를 반환합니다.
stdout과 stderr를 합쳐서 반환합니다.
타임아웃: 120초.
성공/실패 모두 exit code와 출력을 반환합니다.`,
  inputSchema: z.object({
    command: z.string().describe("실행할 bash 명령어 (예: 'ls -la', 'git status')"),
  }),
  execute: async ({ command }) => {
    // 위험한 명령어 차단
    if (DANGEROUS_COMMANDS.some((d) => command.includes(d))) {
      return '오류: 위험한 명령어는 실행할 수 없습니다.';
    }

    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: 120000, // 120초 타임아웃
        maxBuffer: 1024 * 1024, // 1MB 버퍼
      });

      const output = stdout + stderr;
      return `출력:\n${output.trim() || '(출력 없음)'}`;
    } catch (error) {
      // 타임아웃 처리
      if (error instanceof Error && 'killed' in error && error.killed) {
        return '타임아웃: 120초 초과로 명령이 종료되었습니다.';
      }

      // 일반 에러 처리
      const exitCode =
        error instanceof Error && 'code' in error ? (error.code as number) : 1;
      const stdout =
        error instanceof Error && 'stdout' in error ? String(error.stdout) : '';
      const stderr =
        error instanceof Error && 'stderr' in error ? String(error.stderr) : '';
      const output = stdout + stderr;

      return `명령 실패 (exit code: ${exitCode})\n출력:\n${output.trim() || '(출력 없음)'}`;
    }
  },
});
