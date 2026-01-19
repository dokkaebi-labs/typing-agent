/**
 * 14강: bashTool - 시스템 명령어 실행
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

// TODO 1: exec를 Promise로 변환
// promisify()를 사용해서 async/await으로 사용할 수 있게 만드세요
const execAsync = promisify(exec);

// TODO 2: 위험한 명령어 목록 정의
// rm -rf, sudo, chmod 777 등 위험한 명령어를 차단해야 합니다
const DANGEROUS_COMMANDS = [
  // 위험한 명령어 패턴들을 추가하세요
];

export const bashTool = tool({
  // TODO 3: description 작성
  // - bash 명령어 실행 기능 설명
  // - stdout/stderr 반환 설명
  // - 타임아웃 시간 명시
  description: ``, // 설명을 작성하세요

  // TODO 4: inputSchema 스키마 정의
  // - command: 실행할 bash 명령어
  inputSchema: z.object({
    // 파라미터 스키마를 정의하세요
  }),

  execute: async ({ command }) => {
    // TODO 5: 위험한 명령어 차단
    // DANGEROUS_COMMANDS에 포함된 패턴이 있으면 에러 반환
    // 힌트: some()과 includes() 사용

    // TODO 6: 명령 실행
    // execAsync()로 명령 실행
    // 옵션:
    // - timeout: 120000 (120초)
    // - maxBuffer: 1024 * 1024 (1MB)
    try {
      // 명령 실행 코드 작성

      // TODO 7: 결과 포맷팅
      // stdout과 stderr를 합쳐서 반환
      // 빈 출력이면 "(출력 없음)" 표시

      return '구현 필요'; // 수정 필요
    } catch (error: any) {
      // TODO 8: 에러 처리
      // - 타임아웃: error.killed가 true
      // - 일반 에러: exitCode와 출력 반환

      return '구현 필요'; // 수정 필요
    }
  },
});
