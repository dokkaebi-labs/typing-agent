/**
 * 17강: Stateless 한계 테스트
 *
 * 이 테스트는 Agent가 이전 대화를 기억하지 못함을 검증합니다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CodingAgent } from '../solution/src/agent/CodingAgent';

// 대화 맥락을 추적하기 위한 mock
let callCount = 0;
let lastPrompt = '';

vi.mock('ai', () => ({
  generateText: vi.fn().mockImplementation(async ({ prompt }) => {
    callCount++;
    lastPrompt = prompt;

    // 각 호출에서 받은 prompt만 확인 가능
    // 이전 호출의 정보는 없음
    return {
      text: `응답 ${callCount}: "${prompt}"에 대한 답변`,
      steps: [],
      toolCalls: [],
      toolResults: [],
    };
  }),
  tool: vi.fn((config) => config),
  stepCountIs: vi.fn((n: number) => ({ type: 'stepCount', count: n })),
}));

vi.mock('@ai-sdk/anthropic', () => ({
  anthropic: vi.fn(() => 'mock-model'),
}));

describe('Stateless 한계', () => {
  let agent: CodingAgent;

  beforeEach(() => {
    callCount = 0;
    lastPrompt = '';
    agent = new CodingAgent();
  });

  it('각 chat() 호출이 독립적이다', async () => {
    await agent.chat('README.md 읽어줘');
    expect(callCount).toBe(1);

    await agent.chat('방금 읽은 파일 요약해줘');
    expect(callCount).toBe(2);

    // 두 번째 호출에서 첫 번째 호출의 정보가 없음
    expect(lastPrompt).toBe('방금 읽은 파일 요약해줘');
    expect(lastPrompt).not.toContain('README.md');
  });

  it('이전 대화 맥락을 알 수 없다', async () => {
    // 첫 번째 대화
    await agent.chat('파일1.txt 읽어줘');

    // 두 번째 대화 - "아까"가 무엇인지 알 수 없음
    await agent.chat('아까 그 파일 다시 보여줘');

    // prompt에는 현재 메시지만 있음
    expect(lastPrompt).toBe('아까 그 파일 다시 보여줘');
    expect(lastPrompt).not.toContain('파일1.txt');
  });

  it('매 호출이 첫 대화처럼 처리된다', async () => {
    // 연속으로 3번 호출
    await agent.chat('첫 번째 질문');
    await agent.chat('두 번째 질문');
    await agent.chat('세 번째 질문');

    // 세 번째 호출에서는 이전 두 질문의 정보가 없음
    expect(lastPrompt).toBe('세 번째 질문');
    expect(lastPrompt).not.toContain('첫 번째');
    expect(lastPrompt).not.toContain('두 번째');
  });
});

describe('문제 인식', () => {
  it('generateText는 매번 독립적인 요청이다', async () => {
    const agent = new CodingAgent();

    // 같은 Agent 인스턴스로 여러 번 호출해도
    // 각 호출은 서로 다른 독립적인 API 요청
    const response1 = await agent.chat('질문 1');
    const response2 = await agent.chat('질문 2');

    // 응답은 있지만, 맥락 연결은 없음
    expect(response1).toBeDefined();
    expect(response2).toBeDefined();
  });
});
