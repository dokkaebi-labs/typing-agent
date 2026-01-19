/**
 * 23강: 프롬프트 포맷터 (실습 코드)
 *
 * 사용자 입력 및 Agent 응답 프롬프트를 포맷팅합니다.
 */

import { colors } from './colors';

// TODO 1: 사용자 프롬프트 포맷
// 예: "User > " (청록색, 굵게)
export function userPrompt(): string {
  return 'User > '; // 색상을 적용해보세요
}

// TODO 2: 어시스턴트 프롬프트 포맷
// 예: "Assistant >" (초록색, 굵게)
export function assistantPrompt(): string {
  return 'Assistant >'; // 색상을 적용해보세요
}

// TODO 3: 구분선 생성
// 예: "────────────────────────────────────────" (회색)
export function divider(length: number = 60): string {
  return '-'.repeat(length); // '─' 문자와 색상을 적용해보세요
}

// TODO 4: 에러 박스 생성
// 예:
// ╭─ ERROR ─────────────────────────────────╮
// │ 에러 메시지                              │
// ╰──────────────────────────────────────────╯
export function errorBox(message: string): string {
  return `Error: ${message}`; // 박스 형태로 개선해보세요
}
