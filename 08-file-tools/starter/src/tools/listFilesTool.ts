/**
 * 11강: listFilesTool - 프로젝트 시야
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

// TODO 1: 제외할 디렉토리 목록 정의
// .git, node_modules, dist, build, .idea, .vscode 등을 제외해야 합니다
// 힌트: Set을 사용하면 O(1)으로 빠르게 확인할 수 있습니다
const EXCLUDED_DIRS = new Set([
  // 여기에 제외할 디렉토리 이름들을 추가하세요
]);

// TODO 2: 제외 여부 확인 함수 구현
function shouldExclude(name: string): boolean {
  // EXCLUDED_DIRS에 포함되어 있는지 확인하세요
  return false; // 수정 필요
}

export const listFilesTool = tool({
  // TODO 3: description 작성
  // - 디렉토리 탐색 기능 설명
  // - 재귀 탐색 여부 설명
  // - 제외되는 폴더 목록 설명
  description: '', // 설명을 작성하세요

  // TODO 4: inputSchema 스키마 정의
  // - path: 탐색할 디렉토리 경로 (문자열)
  inputSchema: z.object({
    // 파라미터 스키마를 정의하세요
  }),

  execute: async ({ path: dirPath }) => {
    // TODO 5: 상대 경로를 절대 경로로 변환
    // 힌트: path.resolve(dirPath) 사용

    // TODO 6: 경로 존재 여부 확인
    // 힌트: fs.existsSync() 사용

    // TODO 7: 디렉토리 여부 확인
    // 힌트: fs.statSync().isDirectory() 사용

    // 결과 저장 배열
    const files: string[] = [];

    // TODO 8: 재귀 탐색 함수 구현
    function walkDirectory(currentPath: string, basePath: string) {
      // 8-1. fs.readdirSync()로 디렉토리 내용 읽기
      // 8-2. 각 항목에 대해:
      //      - shouldExclude()로 제외 대상인지 확인
      //      - path.join()으로 전체 경로 생성
      //      - path.relative()로 상대 경로 계산
      //      - fs.statSync()로 파일/폴더 구분
      //      - 폴더면 끝에 '/' 붙이고 재귀 호출
      //      - 파일이면 그냥 추가
      // 8-3. try-catch로 권한 없는 폴더 처리
    }

    // TODO 9: walkDirectory 호출
    // walkDirectory(absolutePath, absolutePath);

    // TODO 10: 결과 포맷팅 및 반환
    // - 비어있으면 "디렉토리가 비어있습니다" 반환
    // - 결과가 있으면 정렬해서 반환

    return '구현 필요'; // 수정 필요
  },
});
