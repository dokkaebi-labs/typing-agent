/**
 * 20강: Context Window와 Sliding Window (스타터 코드)
 *
 * Sliding Window를 적용하여 최근 N개 메시지만 유지합니다.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ModelMessage } from 'ai';

interface StoredMessage {
  timestamp: string;
  message: ModelMessage;
}

// TODO 1: MAX_MESSAGES 상수 정의
// - Sliding Window 크기 (최근 20개 메시지만 유지)
// - private static readonly로 선언
//
// 힌트:
// private static readonly MAX_MESSAGES = 20;

export class ConversationHistory {
  // TODO 1: MAX_MESSAGES 상수 추가

  private sessionFile: string;

  constructor(sessionId: string) {
    const sessionDir = '.coding-agent/sessions';
    this.sessionFile = path.join(sessionDir, `${sessionId}.jsonl`);
  }

  private async ensureDirectory(): Promise<void> {
    const dir = path.dirname(this.sessionFile);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  async addMessages(
    userMessage: string,
    assistantMessage: string
  ): Promise<void> {
    await this.ensureDirectory();

    const entries: StoredMessage[] = [
      {
        timestamp: new Date().toISOString(),
        message: { role: 'user', content: userMessage },
      },
      {
        timestamp: new Date().toISOString(),
        message: { role: 'assistant', content: assistantMessage },
      },
    ];

    const lines = entries.map((entry) => JSON.stringify(entry)).join('\n') + '\n';

    await fs.appendFile(this.sessionFile, lines);
  }

  async getHistory(): Promise<ModelMessage[]> {
    try {
      await fs.access(this.sessionFile);
    } catch {
      return [];
    }

    const content = await fs.readFile(this.sessionFile, 'utf-8');
    const messages: ModelMessage[] = [];

    for (const line of content.split('\n')) {
      if (!line.trim()) continue;

      try {
        const entry: StoredMessage = JSON.parse(line);
        messages.push(entry.message);
      } catch (e) {
        console.error('파싱 실패:', line);
      }
    }

    // TODO 2: Sliding Window 적용
    // - slice(-N)을 사용하여 최근 N개만 반환
    // - 현재는 전체를 반환하고 있음
    //
    // 힌트:
    // return messages.slice(-ConversationHistory.MAX_MESSAGES);

    return messages; // ← 수정 필요: Sliding Window 적용
  }
}
