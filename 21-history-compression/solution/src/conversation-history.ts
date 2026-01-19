/**
 * 21강: History Compression 적용하기 (완성 코드)
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ModelMessage, generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

interface StoredMessage {
  timestamp: string;
  message: ModelMessage;
}

export class ConversationHistory {
  private static readonly COMPRESS_THRESHOLD = 10;
  private static readonly KEEP_RECENT = 4;

  private sessionFile: string;
  private summaryFile: string;

  constructor(sessionId: string) {
    const sessionDir = '.coding-agent/sessions';
    this.sessionFile = path.join(sessionDir, `${sessionId}.jsonl`);
    this.summaryFile = path.join(sessionDir, `${sessionId}-summary.md`);
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

  private async loadAllMessages(): Promise<ModelMessage[]> {
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

    return messages;
  }

  async getHistory(): Promise<ModelMessage[]> {
    const messages = await this.loadAllMessages();
    return messages.slice(-ConversationHistory.KEEP_RECENT);
  }

  async getSummary(): Promise<string | null> {
    try {
      await fs.access(this.summaryFile);
    } catch {
      return null;
    }

    const content = await fs.readFile(this.summaryFile, 'utf-8');
    return content.trim() || null;
  }

  async compressHistory(): Promise<void> {
    const messages = await this.loadAllMessages();

    if (messages.length <= ConversationHistory.COMPRESS_THRESHOLD) {
      return;
    }

    const toSummarize = messages.slice(
      0,
      messages.length - ConversationHistory.KEEP_RECENT
    );

    let conversationText = '';

    const existingSummary = await this.getSummary();
    if (existingSummary) {
      conversationText += `이전 요약: ${existingSummary}\n\n`;
    }

    for (const msg of toSummarize) {
      if (msg.role === 'user') {
        conversationText += `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        conversationText += `Assistant: ${msg.content}\n`;
      }
    }

    const { text: summary } = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: conversationText,
      prompt: '이 대화를 간결하게 요약하세요. 핵심 정보만 남기고, 3-5문장으로 작성하세요.',
    });

    await this.ensureDirectory();
    await fs.writeFile(this.summaryFile, summary);
  }
}
