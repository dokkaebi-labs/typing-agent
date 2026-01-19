import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * 8강 테스트: Agent Loop 필요성 이해
 *
 * 이 테스트는 Mock을 사용하여 LLM API 호출 없이
 * 단일 호출 구조의 한계를 검증합니다.
 */

// generateText 모킹
vi.mock('ai', async () => {
  const actual = await vi.importActual('ai');
  return {
    ...actual,
    generateText: vi.fn(),
  };
});

import { generateText } from 'ai';

const mockedGenerateText = vi.mocked(generateText);

describe('Agent Loop 필요성', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('단일 호출 동작 확인', () => {
    it('1차 호출에서 Tool을 호출한다', async () => {
      // 1차 호출: Tool 호출
      mockedGenerateText.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            toolCallId: 'call_1',
            toolName: 'readFile',
            input: { path: 'package.json' },
          },
        ],
        toolResults: [],
        finishReason: 'tool-calls',
        usage: { promptTokens: 100, completionTokens: 50 },
      } as any);

      const result = await mockedGenerateText({
        model: {} as any,
        messages: [{ role: 'user', content: '파일 읽어줘' }],
        tools: {} as any,
      });

      expect(result.toolCalls).toHaveLength(1);
      expect(result.toolCalls![0].toolName).toBe('readFile');
    });

    it('Tool 호출이 없으면 텍스트 응답을 반환한다', async () => {
      mockedGenerateText.mockResolvedValueOnce({
        text: '안녕하세요! 무엇을 도와드릴까요?',
        toolCalls: [],
        toolResults: [],
        finishReason: 'stop',
        usage: { promptTokens: 100, completionTokens: 50 },
      } as any);

      const result = await mockedGenerateText({
        model: {} as any,
        messages: [{ role: 'user', content: '안녕' }],
        tools: {} as any,
      });

      expect(result.toolCalls).toHaveLength(0);
      expect(result.text).toBe('안녕하세요! 무엇을 도와드릴까요?');
    });
  });

  describe('연속 Tool 호출 시나리오', () => {
    it('2차 호출에서 또 Tool을 호출하면 처리하지 못한다', async () => {
      // 시나리오: 두 파일을 읽어야 하는 요청

      // 1차 호출: package.json 읽기
      mockedGenerateText.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            toolCallId: 'call_1',
            toolName: 'readFile',
            input: { path: 'package.json' },
          },
        ],
        toolResults: [],
        finishReason: 'tool-calls',
        usage: { promptTokens: 100, completionTokens: 50 },
      } as any);

      // 2차 호출: tsconfig.json도 읽으려고 함
      mockedGenerateText.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            toolCallId: 'call_2',
            toolName: 'readFile',
            input: { path: 'tsconfig.json' },
          },
        ],
        toolResults: [],
        finishReason: 'tool-calls',
        usage: { promptTokens: 200, completionTokens: 50 },
      } as any);

      // 1차 호출
      const firstResult = await mockedGenerateText({
        model: {} as any,
        messages: [
          {
            role: 'user',
            content: 'package.json이랑 tsconfig.json 둘 다 읽어줘',
          },
        ],
        tools: {} as any,
      });

      expect(firstResult.toolCalls).toHaveLength(1);
      expect(firstResult.toolCalls![0].input).toEqual({ path: 'package.json' });

      // 2차 호출 (Tool 결과 전달 후)
      const secondResult = await mockedGenerateText({
        model: {} as any,
        messages: [
          {
            role: 'user',
            content: 'package.json이랑 tsconfig.json 둘 다 읽어줘',
          },
          { role: 'assistant', content: firstResult.toolCalls },
          {
            role: 'tool',
            content: [
              {
                type: 'tool-result',
                toolCallId: 'call_1',
                result: '{"name": "test"}',
              },
            ],
          },
        ],
        tools: {} as any,
      });

      // 문제 확인: 2차 응답이 또 Tool 호출!
      expect(secondResult.toolCalls).toHaveLength(1);
      expect(secondResult.toolCalls![0].input).toEqual({ path: 'tsconfig.json' });

      // 현재 구조에서는 여기서 끝 - tsconfig.json을 읽지 못함
      // 이것이 Agent Loop가 필요한 이유!
    });
  });

  describe('종료 조건 이해', () => {
    it('toolCalls가 비어있으면 종료해야 한다', () => {
      const response = {
        text: '파일을 읽었습니다.',
        toolCalls: [],
      };

      const shouldContinue = response.toolCalls && response.toolCalls.length > 0;
      expect(shouldContinue).toBe(false);
    });

    it('toolCalls가 있으면 계속해야 한다', () => {
      const response = {
        text: '',
        toolCalls: [{ toolName: 'readFile', input: { path: 'test.txt' } }],
      };

      const shouldContinue = response.toolCalls && response.toolCalls.length > 0;
      expect(shouldContinue).toBe(true);
    });
  });

  describe('Agent vs Chat 차이', () => {
    it('Chat은 한 번 응답하고 끝난다', async () => {
      mockedGenerateText.mockResolvedValueOnce({
        text: '안녕하세요!',
        toolCalls: [],
        finishReason: 'stop',
      } as any);

      const result = await mockedGenerateText({
        model: {} as any,
        messages: [{ role: 'user', content: '안녕' }],
      });

      // Chat: 1회 호출로 끝
      expect(mockedGenerateText).toHaveBeenCalledTimes(1);
      expect(result.text).toBe('안녕하세요!');
    });

    it('Agent는 목표 달성까지 반복해야 한다 (현재 미구현)', async () => {
      // 이 테스트는 Agent Loop 없이는 실패하는 시나리오를 보여줌

      // 1차: Tool 호출
      mockedGenerateText.mockResolvedValueOnce({
        text: '',
        toolCalls: [{ toolCallId: '1', toolName: 'readFile', input: { path: 'a.txt' } }],
        finishReason: 'tool-calls',
      } as any);

      // 2차: 또 Tool 호출
      mockedGenerateText.mockResolvedValueOnce({
        text: '',
        toolCalls: [{ toolCallId: '2', toolName: 'readFile', input: { path: 'b.txt' } }],
        finishReason: 'tool-calls',
      } as any);

      // 3차: 최종 응답 (Agent Loop가 있어야 도달)
      mockedGenerateText.mockResolvedValueOnce({
        text: '두 파일을 모두 읽었습니다.',
        toolCalls: [],
        finishReason: 'stop',
      } as any);

      // 현재 구조: 2회만 호출 (Agent Loop 없음)
      await mockedGenerateText({ model: {} as any, messages: [] });
      await mockedGenerateText({ model: {} as any, messages: [] });

      // 3번째 호출은 도달하지 못함
      expect(mockedGenerateText).toHaveBeenCalledTimes(2);

      // Agent Loop가 있으면 3번 호출되어 최종 응답에 도달해야 함
      // → 다음 강의에서 구현
    });
  });
});
