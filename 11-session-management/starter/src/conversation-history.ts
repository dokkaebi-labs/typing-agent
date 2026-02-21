/**
 * 18강: Session으로 대화 이력 관리하기 (스타터 코드)
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

// TODO 1: ConversationHistory 클래스 구조 정의
// - sessionFile: string (세션 파일 경로)
// - constructor(sessionId: string): 세션 디렉토리와 파일 경로 설정
//
// 힌트:
// export class ConversationHistory {
//   private sessionFile: string;
//
//   constructor(sessionId: string) {
//     const sessionDir = '.coding-agent/sessions';
//     this.sessionFile = path.join(sessionDir, `${sessionId}.jsonl`);
//   }
// }

// TODO 2: ensureDirectory() 구현
// - 세션 디렉토리가 없으면 생성
// - fs.mkdir(dir, { recursive: true }) 사용
//
// 힌트:
// private async ensureDirectory(): Promise<void> {
//   const dir = path.dirname(this.sessionFile);
//   try {
//     await fs.access(dir);
//   } catch {
//     await fs.mkdir(dir, { recursive: true });
//   }
// }

// TODO 3: addMessages() 구현
// - userMessage와 assistantMessage를 쌍으로 저장
// - fs.appendFile()로 JSONL 형식 추가
//
// 힌트: entries 배열을 만들어서 한 번에 추가

// TODO 4: getHistory() 구현
// - 저장된 대화 이력을 ModelMessage[] 배열로 반환
// - 파일이 없으면 빈 배열 반환
// - JSONL 파싱해서 message만 추출

export class ConversationHistory {
  private sessionFile: string;

  constructor(sessionId: string) {
    // TODO 1 구현
    this.sessionFile = '';
  }

  private async ensureDirectory(): Promise<void> {
    // TODO 2 구현
  }

  async addMessages(
    userMessage: string,
    assistantMessage: string
  ): Promise<void> {
    // TODO 3 구현
  }

  async getHistory(): Promise<ModelMessage[]> {
    // TODO 4 구현
    return [];
  }
}
