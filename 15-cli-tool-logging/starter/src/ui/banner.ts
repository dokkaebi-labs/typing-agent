/**
 * 23강: 웰컴 배너 (실습 코드)
 *
 * 프로그램 시작 시 표시되는 ASCII 아트 배너를 구현합니다.
 */

import { colors } from './colors';

const VERSION = '1.0.0';

// TODO 1: ASCII 아트 배너 작성
// 힌트: 온라인 ASCII art generator 사용 가능
// 예시:
// ╔═══════════════════════════════════════════════════════════╗
// ║          TYPING AGENT - AI-Powered Assistant              ║
// ╚═══════════════════════════════════════════════════════════╝

export function printWelcome(): void {
  // TODO 2: 배너 출력
  // 1. ASCII 아트 출력 (색상 적용)
  // 2. 버전 정보 출력
  // 3. 안내 메시지 출력 ("/help for commands")

  console.log();
  console.log('='.repeat(60));
  console.log('  TYPING AGENT');
  console.log(`  Version ${VERSION}`);
  console.log('='.repeat(60));
  console.log();
  console.log('  Type /help for commands or start coding!');
  console.log('  Type /exit to leave.');
  console.log();

  // 위 코드를 색상이 적용된 버전으로 개선해보세요!
}

export function printGoodbye(): void {
  // TODO 3: 종료 메시지 출력
  // 예: "Happy Coding! See you!" 박스로 감싸기

  console.log();
  console.log('Happy Coding! See you!');
  console.log();
}
