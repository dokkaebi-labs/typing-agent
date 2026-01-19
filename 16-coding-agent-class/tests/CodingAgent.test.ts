/**
 * 16강: CodingAgent 클래스 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CodingAgent } from '../solution/src/agent/CodingAgent';

// generateText mock
vi.mock('ai', () => ({
  generateText: vi.fn().mockResolvedValue({
    text: '안녕하세요! 무엇을 도와드릴까요?',
    steps: [],
    toolCalls: [],
    toolResults: [],
  }),
  tool: vi.fn((config) => config),
  stepCountIs: vi.fn((n) => ({ type: 'stepCount', count: n })),
}));

vi.mock('@ai-sdk/anthropic', () => ({
  anthropic: vi.fn(() => 'mock-model'),
}));

describe('CodingAgent', () => {
  let agent: CodingAgent;

  beforeEach(() => {
    agent = new CodingAgent();
  });

  it('인스턴스를 생성할 수 있다', () => {
    expect(agent).toBeInstanceOf(CodingAgent);
  });

  it('chat() 메서드가 문자열을 반환한다', async () => {
    const response = await agent.chat('안녕하세요');
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });

  it('chat()을 여러 번 호출할 수 있다', async () => {
    const response1 = await agent.chat('첫 번째 메시지');
    const response2 = await agent.chat('두 번째 메시지');
    const response3 = await agent.chat('세 번째 메시지');

    expect(typeof response1).toBe('string');
    expect(typeof response2).toBe('string');
    expect(typeof response3).toBe('string');
  });

  it('빈 메시지에도 응답한다', async () => {
    const response = await agent.chat('');
    expect(typeof response).toBe('string');
  });
});

describe('CodingAgent 클래스 구조', () => {
  it('chat 메서드가 존재한다', () => {
    const agent = new CodingAgent();
    expect(typeof agent.chat).toBe('function');
  });

  it('chat 메서드가 Promise를 반환한다', () => {
    const agent = new CodingAgent();
    const result = agent.chat('test');
    expect(result).toBeInstanceOf(Promise);
  });
});
