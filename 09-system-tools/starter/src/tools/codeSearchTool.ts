/**
 * 15강: codeSearchTool - 코드베이스 검색
 *
 * 이 Tool은 Agent에게 '검색 엔진'을 제공합니다.
 * ripgrep을 사용해서 수천 개 파일에서도 원하는 코드를
 * 순식간에 찾아냅니다.
 *
 * 사전 요구사항: ripgrep 설치 필요
 * - macOS: brew install ripgrep
 * - Windows: choco install ripgrep
 */

import { tool } from 'ai';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const codeSearchTool = tool({
  // TODO 1: description 작성
  // - ripgrep 기반 코드 검색 설명
  // - 정규식 지원 설명
  // - 결과 제한 (50개) 설명
  // - 예시 포함 (TODO 검색, async function 검색 등)
  description: ``, // 설명을 작성하세요

  // TODO 2: inputSchema 스키마 정의
  // - pattern: 검색 패턴 (정규식 지원)
  // - path: 검색할 경로 (기본값: ".")
  // - fileType: 파일 타입 필터 (예: 'ts', 'js') - optional
  // - caseSensitive: 대소문자 구분 여부 (기본값: false)
  inputSchema: z.object({
    // 파라미터 스키마를 정의하세요
  }),

  execute: async ({ pattern, path = '.', fileType, caseSensitive = false }) => {
    // TODO 3: ripgrep 명령어 조립
    // 기본 옵션들:
    // - --line-number: 라인 번호 표시
    // - --with-filename: 파일명 표시
    // - --color=never: 컬러 코드 제거 (중요!)
    // - --no-heading: 파일별 그룹화 안 함
    const args: string[] = [
      // 기본 옵션들을 추가하세요
    ];

    // TODO 4: 대소문자 구분 옵션 추가
    // caseSensitive가 false면 --ignore-case 추가

    // TODO 5: 파일 타입 필터 옵션 추가
    // fileType이 있으면 --type 옵션 추가

    // TODO 6: 패턴과 경로 추가
    // 패턴은 따옴표로 감싸기 (특수문자 처리)

    // TODO 7: 명령 실행
    // - timeout: 30000 (30초)
    // - maxBuffer: 5MB
    const command = `rg ${args.join(' ')}`;

    try {
      // 명령 실행 코드 작성

      // TODO 8: 결과 처리
      // - 빈 결과면 "검색 결과 없음" 반환
      // - 50개 초과면 처음 50개만 표시하고 생략 메시지 추가
      // - 결과 개수와 함께 반환

      return '구현 필요'; // 수정 필요
    } catch (error) {
      // TODO 9: 에러 처리
      // - exitCode 1: 검색 결과 없음 (에러 아님!)
      //   if (error instanceof Error && 'code' in error && error.code === 1)
      // - 타임아웃 체크:
      //   if (error instanceof Error && 'killed' in error && error.killed)
      // - 그 외: ripgrep 오류

      return '구현 필요'; // 수정 필요
    }
  },
});
