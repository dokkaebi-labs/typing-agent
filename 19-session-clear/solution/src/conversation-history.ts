/**
 * 18강: Session으로 대화 이력 관리하기 (완성 코드)
 *
 * 대화 이력을 JSONL 파일로 저장하고 복원합니다.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ModelMessage } from 'ai';

interface StoredMessage {
  timestamp: string;
  message: ModelMessage;
}

export class ConversationHistory {
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
      return []; // 파일이 없으면 빈 배열
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
        // 잘못된 줄은 건너뛰기
      }
    }

    return messages;
  }
}
