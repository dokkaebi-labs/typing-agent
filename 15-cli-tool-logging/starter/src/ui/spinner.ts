/**
 * 23강: 로딩 스피너 (실습 코드)
 *
 * 브라이유 문자를 사용한 터미널 스피너를 구현합니다.
 */

import { colors } from './colors';

export class Spinner {
  // 브라이유 문자 프레임
  private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private currentFrame = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private message: string;

  constructor(message: string = 'Thinking') {
    this.message = message;
  }

  // TODO 1: 스피너 시작
  // 1. setInterval로 100ms마다 프레임 변경
  // 2. process.stdout.write로 같은 줄에 출력
  // 3. '\r'로 커서를 줄 맨 앞으로 이동 (줄바꿈 없이 덮어쓰기)
  start(): void {
    // 여기에 코드를 작성하세요
  }

  // TODO 2: 스피너 정지
  // 1. clearInterval로 타이머 정지
  // 2. 스피너 줄 지우기 (공백으로 덮어쓰기)
  stop(): void {
    // 여기에 코드를 작성하세요
  }

  // 메시지 변경
  updateMessage(message: string): void {
    this.message = message;
  }
}
