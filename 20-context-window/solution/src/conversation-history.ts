/**
 * 20강: Context Window와 Sliding Window (완성 코드)
 *
 * Sliding Window: 최근 N개 메시지만 유지합니다.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ModelMessage } from 'ai';

interface StoredMessage {
  timestamp: string;
  message: ModelMessage;
}

export class ConversationHistory {
  private static readonly MAX_MESSAGES = 20; // Sliding Window 크기

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

    // Sliding Window: 최근 N개만 반환
    return messages.slice(-ConversationHistory.MAX_MESSAGES);
  }
}
