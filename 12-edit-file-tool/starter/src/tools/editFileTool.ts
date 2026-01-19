/**
 * 12강: editFileTool - 코드 수정 능력
 *
 * 이 Tool은 Agent에게 '손'을 제공합니다.
 * Claude Code에서 가장 많이 쓰이는 Tool입니다.
 *
 * 3가지 모드:
 * - 생성 모드: 파일이 없고 oldText가 비어있으면 새 파일 생성
 * - 추가 모드: 파일이 있고 oldText가 비어있으면 끝에 추가
 * - 교체 모드: oldText를 newText로 교체 (1회 매칭만 허용)
 */

import { tool } from 'ai';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

export const editFileTool = tool({
  // TODO 1: description 작성
  // - 3가지 모드 설명 (생성, 추가, 교체)
  // - oldText가 비어있을 때와 값이 있을 때의 동작 설명
  // - 1회 매칭 규칙 설명
  description: ``, // 설명을 작성하세요

  // TODO 2: parameters 스키마 정의
  // - path: 수정하거나 생성할 파일 경로
  // - oldText: 찾아서 교체할 문자열 (빈 문자열 = 생성/추가 모드)
  // - newText: 교체할 새 문자열
  inputSchema: z.object({
    // 파라미터 스키마를 정의하세요
  }),

  execute: async ({ path: filePath, oldText, newText }) => {
    // TODO 3: 기본 검증
    // oldText와 newText가 동일하면 에러 반환
    // 힌트: 같은 걸로 바꾸는 건 의미 없음

    // TODO 4: 절대 경로 변환
    // path.resolve() 사용
    const absolutePath = ''; // 수정 필요

    // TODO 5: 파일이 존재하지 않을 경우 처리
    // 5-1. oldText가 비어있으면 → 생성 모드
    //      - 부모 디렉토리가 없으면 생성 (fs.mkdirSync({ recursive: true }))
    //      - fs.writeFileSync()로 파일 생성
    // 5-2. oldText에 값이 있으면 → 에러 (수정할 파일이 없음)

    // TODO 6: 파일 내용 읽기
    // fs.readFileSync() 사용, 에러 처리 필요

    // TODO 7: 추가 모드 처리
    // oldText가 비어있고 파일이 존재하면 → 끝에 추가
    // fs.appendFileSync() 사용

    // TODO 8: 교체 모드 - 등장 횟수 계산
    // content.split(oldText).length - 1로 횟수 계산
    // - 0번: 에러 (찾을 수 없음)
    // - 1번: 교체 진행
    // - 2번 이상: 에러 (더 구체적인 문자열 요청)

    // TODO 9: 교체 실행
    // content.replace(oldText, newText)로 교체
    // fs.writeFileSync()로 저장

    return '구현 필요'; // 수정 필요
  },
});
