import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * 9강 테스트: Agent Loop 구현
 *
 * 이 테스트는 Mock을 사용하여 Agent Loop의 동작을 검증합니다.
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

describe('Agent Loop 구현', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('기본 루프 동작', () => {
    it('Tool 호출 후 다시 LLM 호출이 발생한다', async () => {
      // 1차: Tool 호출
      mockedGenerateText.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          { toolCallId: 'call_1', toolName: 'readFile', input: { path: 'package.json' } },
        ],
        finishReason: 'tool-calls',
      } as any);

      // 2차: 자연어 응답
      mockedGenerateText.mockResolvedValueOnce({
        text: '파일을 읽었습니다.',
        toolCalls: [],
        finishReason: 'stop',
      } as any);

      // 간단한 Agent Loop 시뮬레이션
      const messages: any[] = [{ role: 'user', content: '파일 읽어줘' }];
      let iterations = 0;
      const maxIterations = 10;

      while (iterations < maxIterations) {
        const response = await mockedGenerateText({
          model: {} as any,
          messages,
          tools: {} as any,
        });

        if (response.toolCalls && response.toolCalls.length > 0) {
          // Tool 실행 (모의)
          messages.push({ role: 'assistant', content: response.toolCalls });
          messages.push({ role: 'tool', content: [{ result: 'mock result' }] });
          iterations++;
        } else {
          break;
        }
      }

      // 2번 호출되어야 함 (1차 Tool, 2차 자연어)
      expect(mockedGenerateText).toHaveBeenCalledTimes(2);
      expect(iterations).toBe(1); // Tool 호출 1번
    });

    it('연속 Tool 호출을 처리한다', async () => {
      // 1차: package.json 읽기
      mockedGenerateText.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          { toolCallId: 'call_1', toolName: 'readFile', input: { path: 'package.json' } },
        ],
        finishReason: 'tool-calls',
      } as any);

      // 2차: tsconfig.json 읽기
      mockedGenerateText.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          { toolCallId: 'call_2', toolName: 'readFile', input: { path: 'tsconfig.json' } },
        ],
        finishReason: 'tool-calls',
      } as any);

      // 3차: 자연어 응답
      mockedGenerateText.mockResolvedValueOnce({
        text: '두 파일을 모두 분석했습니다.',
        toolCalls: [],
        finishReason: 'stop',
      } as any);

      const messages: any[] = [{ role: 'user', content: '두 파일 읽어줘' }];
      let iterations = 0;
      const maxIterations = 10;
      const toolCallLog: string[] = [];

      while (iterations < maxIterations) {
        const response = await mockedGenerateText({
          model: {} as any,
          messages,
          tools: {} as any,
        });

        if (response.toolCalls && response.toolCalls.length > 0) {
          toolCallLog.push(response.toolCalls[0].input.path);
          messages.push({ role: 'assistant', content: response.toolCalls });
          messages.push({ role: 'tool', content: [{ result: 'mock result' }] });
          iterations++;
        } else {
          break;
        }
      }

      // 3번 호출 (Tool 2번 + 자연어 1번)
      expect(mockedGenerateText).toHaveBeenCalledTimes(3);
      expect(iterations).toBe(2);
      expect(toolCallLog).toEqual(['package.json', 'tsconfig.json']);
    });
  });

  describe('종료 조건', () => {
    it('자연어 응답이 나오면 루프를 종료한다', async () => {
      mockedGenerateText.mockResolvedValueOnce({
        text: '안녕하세요!',
        toolCalls: [],
        finishReason: 'stop',
      } as any);

      const messages: any[] = [{ role: 'user', content: '안녕' }];
      let iterations = 0;
      let finalText = '';

      while (iterations < 10) {
        const response = await mockedGenerateText({
          model: {} as any,
          messages,
        });

        if (response.toolCalls && response.toolCalls.length > 0) {
          iterations++;
        } else {
          finalText = response.text;
          break;
        }
      }

      expect(iterations).toBe(0); // Tool 호출 없음
      expect(finalText).toBe('안녕하세요!');
    });

    it('toolCalls가 빈 배열이면 종료한다', async () => {
      mockedGenerateText.mockResolvedValueOnce({
        text: '완료했습니다.',
        toolCalls: [], // 빈 배열
        finishReason: 'stop',
      } as any);

      const response = await mockedGenerateText({
        model: {} as any,
        messages: [],
      });

      const shouldContinue = response.toolCalls && response.toolCalls.length > 0;
      expect(shouldContinue).toBe(false);
    });
  });

  describe('무한 루프 방지 (maxIterations)', () => {
    it('maxIterations에 도달하면 강제 종료한다', async () => {
      // 계속 Tool 호출하는 상황
      mockedGenerateText.mockResolvedValue({
        text: '',
        toolCalls: [
          { toolCallId: 'call_x', toolName: 'readFile', input: { path: 'file.txt' } },
        ],
        finishReason: 'tool-calls',
      } as any);

      const maxIterations = 3; // 테스트를 위해 작은 값 사용
      let iterations = 0;

      while (iterations < maxIterations) {
        const response = await mockedGenerateText({
          model: {} as any,
          messages: [],
        });

        if (response.toolCalls && response.toolCalls.length > 0) {
          iterations++;
        } else {
          break;
        }
      }

      expect(iterations).toBe(maxIterations);
      expect(mockedGenerateText).toHaveBeenCalledTimes(maxIterations);
    });

    it('maxIterations 도달 여부를 정확히 판단한다', () => {
      const maxIterations = 10;

      // 경계값 테스트
      expect(9 < maxIterations).toBe(true); // 계속
      expect(10 < maxIterations).toBe(false); // 종료
      expect(11 < maxIterations).toBe(false); // 이미 초과
    });
  });

  describe('메시지 이력 관리', () => {
    it('Tool 호출 후 assistant와 tool 메시지가 추가된다', async () => {
      mockedGenerateText
        .mockResolvedValueOnce({
          text: '',
          toolCalls: [{ toolCallId: 'call_1', toolName: 'readFile', input: { path: 'a.txt' } }],
        } as any)
        .mockResolvedValueOnce({
          text: '완료',
          toolCalls: [],
        } as any);

      const messages: any[] = [{ role: 'user', content: '테스트' }];
      const initialLength = messages.length;

      // 1차 호출
      const response1 = await mockedGenerateText({ model: {} as any, messages });

      if (response1.toolCalls?.length) {
        messages.push({ role: 'assistant', content: response1.toolCalls });
        messages.push({
          role: 'tool',
          content: [{ type: 'tool-result', toolCallId: 'call_1', result: 'content' }],
        });
      }

      // 메시지가 2개 추가됨 (assistant + tool)
      expect(messages.length).toBe(initialLength + 2);
      expect(messages[1].role).toBe('assistant');
      expect(messages[2].role).toBe('tool');
    });

    it('여러 Tool 호출 시 메시지가 누적된다', async () => {
      mockedGenerateText
        .mockResolvedValueOnce({
          text: '',
          toolCalls: [{ toolCallId: 'call_1', toolName: 'readFile', input: { path: 'a.txt' } }],
        } as any)
        .mockResolvedValueOnce({
          text: '',
          toolCalls: [{ toolCallId: 'call_2', toolName: 'readFile', input: { path: 'b.txt' } }],
        } as any)
        .mockResolvedValueOnce({
          text: '완료',
          toolCalls: [],
        } as any);

      const messages: any[] = [{ role: 'user', content: '테스트' }];
      let iterations = 0;

      while (iterations < 10) {
        const response = await mockedGenerateText({ model: {} as any, messages });

        if (response.toolCalls?.length) {
          messages.push({ role: 'assistant', content: response.toolCalls });
          messages.push({ role: 'tool', content: [{ result: 'content' }] });
          iterations++;
        } else {
          break;
        }
      }

      // user(1) + (assistant + tool) * 2 = 5
      expect(messages.length).toBe(5);
    });
  });

  describe('Agent Loop 전체 흐름', () => {
    it('정상적인 Agent Loop 흐름을 완수한다', async () => {
      // 시나리오: 사용자가 두 파일 요청 → Tool 2번 → 최종 응답
      mockedGenerateText
        .mockResolvedValueOnce({
          text: '',
          toolCalls: [{ toolCallId: '1', toolName: 'readFile', input: { path: 'package.json' } }],
        } as any)
        .mockResolvedValueOnce({
          text: '',
          toolCalls: [{ toolCallId: '2', toolName: 'readFile', input: { path: 'tsconfig.json' } }],
        } as any)
        .mockResolvedValueOnce({
          text: '이 프로젝트는 TypeScript 기반의 Node.js 프로젝트입니다.',
          toolCalls: [],
        } as any);

      const messages: any[] = [
        { role: 'user', content: 'package.json과 tsconfig.json을 읽고 프로젝트를 설명해줘' },
      ];
      let iterations = 0;
      let finalResponse = '';

      while (iterations < 10) {
        const response = await mockedGenerateText({ model: {} as any, messages });

        if (response.toolCalls?.length) {
          messages.push({ role: 'assistant', content: response.toolCalls });
          messages.push({ role: 'tool', content: [{ result: 'mock content' }] });
          iterations++;
        } else {
          finalResponse = response.text;
          break;
        }
      }

      expect(iterations).toBe(2);
      expect(finalResponse).toContain('TypeScript');
      expect(mockedGenerateText).toHaveBeenCalledTimes(3);
    });
  });
});
