/**
 * 25강: 프롬프트 포맷터 (완성 코드)
 */

import { colors } from './colors';

export function userPrompt(): string {
  return `${colors.bold}${colors.brightCyan}User >${colors.reset} `;
}

export function assistantPrompt(): string {
  return `${colors.bold}${colors.success}Assistant >${colors.reset}`;
}

export function divider(length: number = 60): string {
  return `${colors.muted}${'─'.repeat(length)}${colors.reset}`;
}

export function errorBox(message: string): string {
  return `
${colors.error}╭─ ERROR ─────────────────────────────────╮${colors.reset}
${colors.error}│ ${message}${colors.reset}
${colors.error}╰──────────────────────────────────────────╯${colors.reset}
`;
}
