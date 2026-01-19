/**
 * 21강: History Compression 테스트
 */

import { describe, it, expect, vi } from 'vitest';

// Mock generateText
vi.mock('ai', () => ({
  generateText: vi.fn().mockResolvedValue({
    text: '사용자가 README.md를 읽고 빌드 방법을 확인함.',
  }),
  ModelMessage: {},
}));

vi.mock('@ai-sdk/anthropic', () => ({
  anthropic: vi.fn(() => 'mock-model'),
}));

describe('History Compression 개념', () => {
  it('압축 임계값 체크', () => {
    const COMPRESS_THRESHOLD = 10;
    const messages = Array.from({ length: 8 }, (_, i) => `msg-${i}`);

    const shouldCompress = messages.length > COMPRESS_THRESHOLD;
    expect(shouldCompress).toBe(false);
  });

  it('압축 대상 분리', () => {
    const KEEP_RECENT = 4;
    const messages = Array.from({ length: 12 }, (_, i) => `msg-${i}`);

    const toSummarize = messages.slice(0, messages.length - KEEP_RECENT);
    const toKeep = messages.slice(-KEEP_RECENT);

    expect(toSummarize.length).toBe(8); // 처음 8개 요약
    expect(toKeep.length).toBe(4); // 최근 4개 유지
  });

  it('토큰 절약 효과', () => {
    // 원본: 3000 토큰
    const originalTokens = 3000;
    // 요약: 100 토큰
    const summaryTokens = 100;

    const savings = ((originalTokens - summaryTokens) / originalTokens) * 100;
    expect(savings).toBeGreaterThan(95); // 95% 이상 절약
  });
});

describe('하이브리드 전략', () => {
  it('요약 + 최근 메시지 조합', () => {
    const summary = '사용자가 README.md를 읽음';
    const recentMessages = ['질문3', '답변3', '질문4', '답변4'];

    // LLM에 전달할 컨텍스트
    const context = [summary, ...recentMessages];

    expect(context.length).toBe(5); // 요약 1개 + 최근 4개
    expect(context[0]).toBe(summary);
  });
});
