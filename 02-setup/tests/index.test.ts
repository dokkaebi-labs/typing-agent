import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock generateText
vi.mock('ai', async () => {
  const actual = await vi.importActual('ai');
  return {
    ...actual,
    generateText: vi.fn(),
  };
});

import { generateText } from 'ai';

describe('03-first-chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateText 호출', () => {
    it('단일 사용자 메시지를 전달해야 한다', async () => {
      const mockGenerateText = generateText as ReturnType<typeof vi.fn>;
      mockGenerateText.mockResolvedValue({
        text: '안녕하세요!',
        toolCalls: [],
        toolResults: [],
      });

      await generateText({
        model: {} as any,
        messages: [
          {
            role: 'user',
            content: '안녕',
          },
        ],
      });

      expect(mockGenerateText).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: [
            {
              role: 'user',
              content: '안녕',
            },
          ],
        })
      );
    });

    it('응답 텍스트를 반환해야 한다', async () => {
      const mockGenerateText = generateText as ReturnType<typeof vi.fn>;
      mockGenerateText.mockResolvedValue({
        text: '안녕하세요! 무엇을 도와드릴까요?',
        toolCalls: [],
        toolResults: [],
      });

      const result = await generateText({
        model: {} as any,
        messages: [{ role: 'user', content: '안녕' }],
      });

      expect(result.text).toBe('안녕하세요! 무엇을 도와드릴까요?');
    });

    it('각 호출마다 새로운 메시지를 전달한다 (stateless)', async () => {
      const mockGenerateText = generateText as ReturnType<typeof vi.fn>;
      mockGenerateText.mockResolvedValue({
        text: '응답',
        toolCalls: [],
        toolResults: [],
      });

      // 첫 번째 호출
      await generateText({
        model: {} as any,
        messages: [{ role: 'user', content: '첫 번째 질문' }],
      });

      // 두 번째 호출 - 이전 대화 없이 새로운 메시지만
      await generateText({
        model: {} as any,
        messages: [{ role: 'user', content: '두 번째 질문' }],
      });

      expect(mockGenerateText).toHaveBeenCalledTimes(2);

      // 첫 번째 호출 확인
      expect(mockGenerateText).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          messages: [{ role: 'user', content: '첫 번째 질문' }],
        })
      );

      // 두 번째 호출 확인 - 히스토리 없이 단일 메시지만
      expect(mockGenerateText).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          messages: [{ role: 'user', content: '두 번째 질문' }],
        })
      );
    });
  });

  describe('메시지 형식', () => {
    it('user role과 content를 포함해야 한다', async () => {
      const mockGenerateText = generateText as ReturnType<typeof vi.fn>;
      mockGenerateText.mockResolvedValue({
        text: '응답',
        toolCalls: [],
        toolResults: [],
      });

      const userInput = '테스트 메시지';

      await generateText({
        model: {} as any,
        messages: [
          {
            role: 'user',
            content: userInput,
          },
        ],
      });

      expect(mockGenerateText).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: userInput,
            }),
          ]),
        })
      );
    });
  });
});
