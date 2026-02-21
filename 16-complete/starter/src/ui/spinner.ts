/**
 * 23강: 로딩 스피너 (완성 코드)
 */

import { colors } from './colors';

export class Spinner {
  private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private currentFrame = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private message: string;

  constructor(message: string = 'Thinking') {
    this.message = message;
  }

  start(): void {
    this.interval = setInterval(() => {
      const frame = this.frames[this.currentFrame % this.frames.length];
      process.stdout.write(
        `\r${colors.brightCyan}${frame}${colors.reset} ${this.message}...`
      );
      this.currentFrame++;
    }, 100);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      // 스피너 줄 지우기
      process.stdout.write('\r' + ' '.repeat(this.message.length + 15) + '\r');
    }
  }

  updateMessage(message: string): void {
    this.message = message;
  }
}
