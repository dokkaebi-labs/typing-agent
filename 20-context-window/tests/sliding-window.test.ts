/**
 * 20강: Sliding Window 테스트
 */

import { describe, it, expect } from 'vitest';

describe('Sliding Window', () => {
  const MAX_MESSAGES = 20;

  it('slice(-N)은 마지막 N개를 반환한다', () => {
    const messages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const sliced = messages.slice(-5);
    expect(sliced).toEqual([6, 7, 8, 9, 10]);
  });

  it('배열이 N보다 작으면 전체를 반환한다', () => {
    const messages = [1, 2, 3];
    const sliced = messages.slice(-10);
    expect(sliced).toEqual([1, 2, 3]);
  });

  it('MAX_MESSAGES 초과 시 오래된 것이 잘린다', () => {
    // 25개 메시지 생성
    const messages = Array.from({ length: 25 }, (_, i) => `msg-${i + 1}`);

    // Sliding Window 적용
    const windowed = messages.slice(-MAX_MESSAGES);

    expect(windowed.length).toBe(MAX_MESSAGES);
    expect(windowed[0]).toBe('msg-6'); // 첫 5개가 잘림
    expect(windowed[windowed.length - 1]).toBe('msg-25');
  });

  it('정확히 MAX_MESSAGES일 때는 전체 유지', () => {
    const messages = Array.from({ length: MAX_MESSAGES }, (_, i) => `msg-${i}`);
    const windowed = messages.slice(-MAX_MESSAGES);
    expect(windowed.length).toBe(MAX_MESSAGES);
  });
});

describe('Context Window 개념', () => {
  it('토큰 계산 예시 (영어)', () => {
    // 영어: 약 1토큰 = 0.75 단어
    const words = 100;
    const estimatedTokens = Math.ceil(words / 0.75);
    expect(estimatedTokens).toBeGreaterThan(words);
  });

  it('토큰 계산 예시 (한글)', () => {
    // 한글: 약 1토큰 = 0.5 글자
    const chars = 100;
    const estimatedTokens = Math.ceil(chars / 0.5);
    expect(estimatedTokens).toBe(200); // 한글은 더 많은 토큰 사용
  });
});
