/**
 * 23강: 터미널 색상 (실습 코드)
 *
 * ANSI 이스케이프 코드로 터미널 텍스트에 색상을 적용합니다.
 */

// TODO 1: 색상 코드 정의
// ANSI 이스케이프 코드: '\x1b[숫자m' 형식
// - 0: reset (초기화)
// - 1: bold (굵게)
// - 2: dim (흐리게)
// - 90-97: 밝은 전경색 (90=회색, 91=빨강, 92=초록, 93=노랑, 94=파랑, 95=자주, 96=청록)
export const colors = {
  // 기본 스타일
  reset: '', // '\x1b[0m'
  bold: '',  // '\x1b[1m'
  dim: '',   // '\x1b[2m'

  // 밝은 전경색
  brightBlack: '',   // '\x1b[90m' (회색)
  brightRed: '',     // '\x1b[91m'
  brightGreen: '',   // '\x1b[92m'
  brightYellow: '',  // '\x1b[93m'
  brightBlue: '',    // '\x1b[94m'
  brightMagenta: '', // '\x1b[95m'
  brightCyan: '',    // '\x1b[96m'

  // 시맨틱 색상 (용도별)
  primary: '',  // cyan 사용
  success: '',  // green 사용
  warning: '',  // yellow 사용
  error: '',    // red 사용
  muted: '',    // gray 사용
};

// TODO 2: 헬퍼 함수 구현
// 각 함수는 텍스트 앞에 아이콘과 색상을 추가하고, 끝에 reset을 붙입니다.
// 예: success("완료!") → "\x1b[92m✓ 완료!\x1b[0m"

export function success(text: string): string {
  // 초록색 + ✓ 아이콘
  return text; // 여기를 수정하세요
}

export function error(text: string): string {
  // 빨간색 + ✗ 아이콘
  return text; // 여기를 수정하세요
}

export function warning(text: string): string {
  // 노란색 + ⚠ 아이콘
  return text; // 여기를 수정하세요
}

export function info(text: string): string {
  // 자주색 + ℹ 아이콘
  return text; // 여기를 수정하세요
}
