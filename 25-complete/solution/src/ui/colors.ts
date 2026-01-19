/**
 * 25강: 터미널 색상 (완성 코드)
 */

export const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',

  brightBlack: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',

  primary: '\x1b[96m',
  success: '\x1b[92m',
  warning: '\x1b[93m',
  error: '\x1b[91m',
  muted: '\x1b[90m',
};

export function success(text: string): string {
  return `${colors.success}✓ ${text}${colors.reset}`;
}

export function error(text: string): string {
  return `${colors.error}✗ ${text}${colors.reset}`;
}

export function warning(text: string): string {
  return `${colors.warning}⚠ ${text}${colors.reset}`;
}

export function info(text: string): string {
  return `${colors.brightMagenta}ℹ ${text}${colors.reset}`;
}
