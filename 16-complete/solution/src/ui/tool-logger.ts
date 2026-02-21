/**
 * 25강: Tool 로거 (완성 코드)
 */

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
  private activeTools: Map<string, number> = new Map();

  logToolStart(toolName: string, args: Record<string, unknown>): void {
    this.activeTools.set(toolName, Date.now());

    const icon = this.getToolIcon(toolName);
    const argsPreview = this.formatArgs(args);

    console.log();
    console.log(`${colors.brightCyan}${icon} ${toolName}${colors.reset}`);
    console.log(`${colors.muted}   ${argsPreview}${colors.reset}`);
  }

  logToolComplete(toolName: string, result?: string): void {
    const startTime = this.activeTools.get(toolName);
    const duration = startTime ? Date.now() - startTime : 0;
    this.activeTools.delete(toolName);

    const resultPreview = this.formatResult(result);

    console.log(
      `${colors.success}   ✓ 완료${colors.reset} ${colors.muted}(${duration}ms)${colors.reset}`
    );
    if (resultPreview) {
      console.log(`${colors.muted}   ${resultPreview}${colors.reset}`);
    }
  }

  logToolError(toolName: string, error: string): void {
    this.activeTools.delete(toolName);

    console.log(`${colors.error}   ✗ 실패: ${error}${colors.reset}`);
  }

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

  private formatResult(result?: string): string {
    if (!result) return '';

    if (result.length > 100) {
      return `${result.length.toLocaleString()} bytes`;
    }
    return '';
  }
}
