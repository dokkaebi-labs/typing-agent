/**
 * 21강: History Compression 적용하기 (스타터 코드)
 *
 * Sliding Window의 한계를 극복하기 위해 오래된 대화를 요약합니다.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ModelMessage, generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

interface StoredMessage {
  timestamp: string;
  message: ModelMessage;
}

// TODO 1: COMPRESS_THRESHOLD와 KEEP_RECENT 상수 정의
// - COMPRESS_THRESHOLD: 압축을 시작하는 메시지 수 (예: 10)
// - KEEP_RECENT: 항상 원본으로 유지할 최근 메시지 수 (예: 4)
//
// 힌트:
// private static readonly COMPRESS_THRESHOLD = 10;
// private static readonly KEEP_RECENT = 4;

export class ConversationHistory {
  // TODO 1: 상수 추가

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

  // TODO 2: loadAllMessages() 구현
  // - 세션 파일에서 모든 메시지를 로드
  // - getHistory()와 compressHistory()에서 공통으로 사용
  //
  // 힌트: 20강의 getHistory() 내부 로직을 분리

  private async loadAllMessages(): Promise<ModelMessage[]> {
    // TODO 2 구현
    return [];
  }

  // TODO 3: getHistory() 수정
  // - loadAllMessages()를 호출하고
  // - 최근 KEEP_RECENT개만 반환
  //
  // 힌트:
  // const messages = await this.loadAllMessages();
  // return messages.slice(-ConversationHistory.KEEP_RECENT);

  async getHistory(): Promise<ModelMessage[]> {
    // TODO 3 구현
    return [];
  }

  // TODO 4: getSummary() 구현
  // - summaryFile에서 요약을 읽어서 반환
  // - 파일이 없으면 null 반환
  //
  // 힌트:
  // const content = await fs.readFile(this.summaryFile, 'utf-8');
  // return content.trim() || null;

  async getSummary(): Promise<string | null> {
    // TODO 4 구현
    return null;
  }

  // TODO 5: compressHistory() 구현
  // 1. 메시지 수가 COMPRESS_THRESHOLD 이하면 return
  // 2. 요약할 대상 분리 (전체 - 최근 KEEP_RECENT개)
  // 3. 기존 요약이 있으면 포함
  // 4. LLM에게 요약 요청
  // 5. 요약 파일에 저장
  //
  // 힌트: 강의 스크립트 참조

  async compressHistory(): Promise<void> {
    // TODO 5 구현
  }
}
