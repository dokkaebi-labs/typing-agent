/**
 * 18강: Session 관리 테스트
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ConversationHistory } from '../solution/src/conversation-history';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('ConversationHistory', () => {
  const testSessionId = 'test-session-' + Date.now();
  const testDir = '.coding-agent/sessions';
  let history: ConversationHistory;

  beforeEach(() => {
    history = new ConversationHistory(testSessionId);
  });

  afterEach(async () => {
    // 테스트 후 정리
    try {
      await fs.rm(testDir, { recursive: true });
    } catch {
      // 폴더가 없어도 무시
    }
  });

  it('인스턴스를 생성할 수 있다', () => {
    expect(history).toBeInstanceOf(ConversationHistory);
  });

  it('파일이 없을 때 빈 배열을 반환한다', async () => {
    const messages = await history.getHistory();
    expect(messages).toEqual([]);
  });

  it('메시지를 저장할 수 있다', async () => {
    await history.addMessages('안녕하세요', '안녕하세요! 무엇을 도와드릴까요?');

    const messages = await history.getHistory();
    expect(messages).toHaveLength(2);
    expect(messages[0]).toEqual({ role: 'user', content: '안녕하세요' });
    expect(messages[1]).toEqual({
      role: 'assistant',
      content: '안녕하세요! 무엇을 도와드릴까요?',
    });
  });

  it('여러 대화를 누적해서 저장한다', async () => {
    await history.addMessages('질문 1', '답변 1');
    await history.addMessages('질문 2', '답변 2');
    await history.addMessages('질문 3', '답변 3');

    const messages = await history.getHistory();
    expect(messages).toHaveLength(6);
  });

  it('JSONL 파일이 생성된다', async () => {
    await history.addMessages('테스트', '테스트 응답');

    const filePath = path.join(testDir, `${testSessionId}.jsonl`);
    const exists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(true);
  });
});

describe('Session 영속성', () => {
  const sessionId = 'persistence-test-' + Date.now();
  const testDir = '.coding-agent/sessions';

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true });
    } catch {
      // 무시
    }
  });

  it('같은 세션 ID로 이력을 복원할 수 있다', async () => {
    // 첫 번째 인스턴스에서 저장
    const history1 = new ConversationHistory(sessionId);
    await history1.addMessages('첫 번째 대화', '첫 번째 응답');

    // 두 번째 인스턴스에서 복원
    const history2 = new ConversationHistory(sessionId);
    const messages = await history2.getHistory();

    expect(messages).toHaveLength(2);
    expect(messages[0].content).toBe('첫 번째 대화');
  });
});
