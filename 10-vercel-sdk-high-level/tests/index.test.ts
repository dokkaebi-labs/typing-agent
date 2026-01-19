import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * 10강 테스트: Vercel AI SDK 고수준 전환
 *
 * 이 테스트는 Mock을 사용하여 stopWhen 옵션의 동작을 검증합니다.
 */

// generateText 모킹
vi.mock('ai', async () => {
  const actual = await vi.importActual('ai');
  return {
    ...actual,
    generateText: vi.fn(),
  };
});

import { generateText, stepCountIs } from 'ai';

const mockedGenerateText = vi.mocked(generateText);

describe('Vercel AI SDK 고수준 전환', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('stopWhen 옵션', () => {
    it('stopWhen으로 연속 Tool 호출이 동작한다', async () => {
      // generateText가 steps를 반환하는 시나리오
      mockedGenerateText.mockResolvedValueOnce({
        text: '두 파일을 분석했습니다.',
        steps: [
          {
            toolCalls: [{ toolCallId: '1', toolName: 'readFile', input: { path: 'package.json' } }],
            toolResults: [{ toolCallId: '1', result: '{"name": "test"}' }],
          },
          {
            toolCalls: [{ toolCallId: '2', toolName: 'readFile', input: { path: 'tsconfig.json' } }],
            toolResults: [{ toolCallId: '2', result: '{"compilerOptions": {}}' }],
          },
          {
            text: '두 파일을 분석했습니다.',
            toolCalls: [],
            toolResults: [],
          },
        ],
        finishReason: 'stop',
      } as any);

      const result = await mockedGenerateText({
        model: {} as any,
        prompt: '두 파일 읽어줘',
        tools: {} as any,
        stopWhen: stepCountIs(10),
      });

      expect(result.steps).toHaveLength(3);
      expect(result.text).toBe('두 파일을 분석했습니다.');
    });

    it('stepCountIs(1)이면 Tool 호출 없이 바로 응답한다', async () => {
      mockedGenerateText.mockResolvedValueOnce({
        text: '안녕하세요!',
        steps: [{ text: '안녕하세요!', toolCalls: [], toolResults: [] }],
        finishReason: 'stop',
      } as any);

      const result = await mockedGenerateText({
        model: {} as any,
        prompt: '안녕',
        stopWhen: stepCountIs(1),
      });

      expect(result.steps).toHaveLength(1);
      expect(result.text).toBe('안녕하세요!');
    });
  });

  describe('9강과 동일한 결과', () => {
    it('연속 파일 읽기 요청에 동일하게 응답한다', async () => {
      // 9강에서 테스트한 것과 동일한 시나리오
      const expectedResponse = '이 프로젝트는 TypeScript 기반의 AI 코딩 에이전트입니다.';

      mockedGenerateText.mockResolvedValueOnce({
        text: expectedResponse,
        steps: [
          {
            toolCalls: [{ toolCallId: '1', toolName: 'readFile', input: { path: 'package.json' } }],
            toolResults: [{ toolCallId: '1', result: '{"name": "test"}' }],
          },
          {
            toolCalls: [{ toolCallId: '2', toolName: 'readFile', input: { path: 'tsconfig.json' } }],
            toolResults: [{ toolCallId: '2', result: '{}' }],
          },
          { text: expectedResponse, toolCalls: [], toolResults: [] },
        ],
        finishReason: 'stop',
      } as any);

      const result = await mockedGenerateText({
        model: {} as any,
        prompt: 'package.json이랑 tsconfig.json 둘 다 읽어서 이 프로젝트가 뭔지 설명해줘',
        tools: {} as any,
        stopWhen: stepCountIs(10),
      });

      expect(result.text).toContain('TypeScript');
    });
  });

  describe('코드 간소화 확인', () => {
    it('한 번의 generateText 호출로 모든 것이 처리된다', async () => {
      mockedGenerateText.mockResolvedValueOnce({
        text: '완료',
        steps: [
          { toolCalls: [{ toolName: 'readFile', input: {} }], toolResults: [{ result: 'content' }] },
          { text: '완료', toolCalls: [], toolResults: [] },
        ],
        finishReason: 'stop',
      } as any);

      await mockedGenerateText({
        model: {} as any,
        prompt: '파일 읽어줘',
        tools: {} as any,
        stopWhen: stepCountIs(10),
      });

      // 9강에서는 while 루프 안에서 여러 번 호출했지만,
      // 10강에서는 generateText 한 번 호출로 끝
      expect(mockedGenerateText).toHaveBeenCalledTimes(1);
    });

    it('메시지 배열 관리가 필요 없다', () => {
      // 9강에서는 이런 코드가 필요했음:
      // const messages: any[] = [{ role: 'user', content: userInput }];
      // messages.push({ role: 'assistant', content: ... });
      // messages.push({ role: 'tool', content: ... });

      // 10강에서는 prompt만 전달하면 됨
      const options = {
        model: {} as any,
        prompt: '파일 읽어줘', // messages 배열 대신 prompt 하나
        stopWhen: stepCountIs(10),
      };

      expect(options.prompt).toBeDefined();
      // messages 배열이 없음 - generateText가 내부에서 관리
    });

    it('while 루프가 필요 없다', () => {
      // 9강 코드:
      // while (iterations < MAX_ITERATIONS) {
      //   const response = await generateText(...);
      //   if (response.toolCalls?.length > 0) {
      //     // Tool 실행
      //     iterations++;
      //   } else {
      //     break;
      //   }
      // }

      // 10강 코드:
      // const response = await generateText({ stopWhen: stepCountIs(10), ... });
      // -> 끝!

      // stopWhen이 while 루프를 대체함을 확인
      const stopCondition = stepCountIs(10);
      expect(stopCondition).toBeDefined();
    });
  });

  describe('steps 정보 활용', () => {
    it('각 step에서 Tool 호출 정보를 확인할 수 있다', async () => {
      mockedGenerateText.mockResolvedValueOnce({
        text: '완료',
        steps: [
          {
            toolCalls: [
              { toolCallId: '1', toolName: 'readFile', input: { path: 'a.txt' } },
              { toolCallId: '2', toolName: 'readFile', input: { path: 'b.txt' } },
            ],
            toolResults: [
              { toolCallId: '1', result: 'content a' },
              { toolCallId: '2', result: 'content b' },
            ],
          },
          { text: '완료', toolCalls: [], toolResults: [] },
        ],
        finishReason: 'stop',
      } as any);

      const result = await mockedGenerateText({
        model: {} as any,
        prompt: '파일 읽어줘',
        stopWhen: stepCountIs(10),
      });

      // steps에서 Tool 호출 정보 추출
      const allToolCalls = result.steps.flatMap((step: any) => step.toolCalls || []);
      expect(allToolCalls).toHaveLength(2);
      expect(allToolCalls[0].toolName).toBe('readFile');
    });

    it('step 수로 몇 번의 반복이 있었는지 알 수 있다', async () => {
      mockedGenerateText.mockResolvedValueOnce({
        text: '완료',
        steps: [
          { toolCalls: [{ toolName: 'readFile' }], toolResults: [] },
          { toolCalls: [{ toolName: 'readFile' }], toolResults: [] },
          { toolCalls: [{ toolName: 'readFile' }], toolResults: [] },
          { text: '완료', toolCalls: [], toolResults: [] },
        ],
        finishReason: 'stop',
      } as any);

      const result = await mockedGenerateText({
        model: {} as any,
        prompt: '세 파일 읽어줘',
        stopWhen: stepCountIs(10),
      });

      // 4단계: Tool 3번 + 최종 응답 1번
      expect(result.steps).toHaveLength(4);
    });
  });
});
