/**
 * 24강: Tool 로거 (실습 코드)
 *
 * Tool 호출을 시각화하는 로거를 구현합니다.
 */

// 색상 코드 (23강에서 가져옴)
const colors = {
  reset: '\x1b[0m',
  brightCyan: '\x1b[96m',
  brightGreen: '\x1b[92m',
  brightRed: '\x1b[91m',
  muted: '\x1b[90m',
  success: '\x1b[92m',
  error: '\x1b[91m',
};

export class ToolLogger {
  // 실행 중인 Tool의 시작 시간을 저장
  private activeTools: Map<string, number> = new Map();

  // TODO 1: Tool 호출 시작 로깅
  // 1. 시작 시간 저장 (실행 시간 측정용)
  // 2. 아이콘 + Tool 이름 출력
  // 3. 인자 미리보기 출력
  //
  // 출력 예시:
  // 📖 readFile
  //    path: README.md
  logToolStart(toolName: string, args: Record<string, unknown>): void {
    // 여기에 코드를 작성하세요
  }

  // TODO 2: Tool 호출 완료 로깅
  // 1. 시작 시간으로부터 실행 시간 계산
  // 2. ✓ 완료 + 실행 시간 출력
  // 3. 결과가 길면 바이트 수만 표시
  //
  // 출력 예시:
  //    ✓ 완료 (23ms)
  //    1,234 bytes
  logToolComplete(toolName: string, result?: string): void {
    // 여기에 코드를 작성하세요
  }

  // TODO 3: Tool 호출 실패 로깅
  // ✗ 실패 + 에러 메시지 출력
  //
  // 출력 예시:
  //    ✗ 실패: ENOENT: no such file or directory
  logToolError(toolName: string, error: string): void {
    // 여기에 코드를 작성하세요
  }

  // Tool별 아이콘 매핑
  private getToolIcon(toolName: string): string {
    const icons: Record<string, string> = {
      readFile: '📖',
      listFiles: '📁',
      editFile: '✏️',
      bash: '💻',
      codeSearch: '🔍',
    };
    return icons[toolName] || '🔧';
  }

  // 인자 포맷팅 (첫 번째 인자만 미리보기)
  private formatArgs(args: Record<string, unknown>): string {
    const entries = Object.entries(args);
    if (entries.length === 0) return '';

    const [key, value] = entries[0];
    const valueStr =
      typeof value === 'string'
        ? value.length > 50
          ? value.slice(0, 50) + '...'
          : value
        : JSON.stringify(value);

    return `${key}: ${valueStr}`;
  }

  // 결과 포맷팅 (너무 길면 바이트 수만)
  private formatResult(result?: string): string {
    if (!result) return '';

    if (result.length > 100) {
      return `${result.length.toLocaleString()} bytes`;
    }
    return '';
  }
}
