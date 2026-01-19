/**
 * 19강: Session 초기화 테스트
 */

import { describe, it, expect, vi } from 'vitest';

describe('/clear 명령어', () => {
  it('새 Agent 인스턴스 생성으로 세션 초기화', () => {
    // 시뮬레이션: let agent 사용
    let agentId = 'session-1';

    // /clear 시 새 세션 ID
    agentId = 'session-2';

    expect(agentId).toBe('session-2');
    expect(agentId).not.toBe('session-1');
  });

  it('const는 재할당 불가, let은 가능', () => {
    // const는 재할당 시 컴파일 에러
    // let은 재할당 가능
    let value = 1;
    value = 2;
    expect(value).toBe(2);
  });
});

describe('명령어 분기 처리', () => {
  it('/clear 명령어 감지', () => {
    const input = '/clear';
    const isClearCommand = input === '/clear';
    expect(isClearCommand).toBe(true);
  });

  it('exit 명령어 감지', () => {
    const input = 'exit';
    const isExitCommand = input === 'exit';
    expect(isExitCommand).toBe(true);
  });

  it('일반 메시지는 명령어가 아님', () => {
    const input: string = '파일 읽어줘';
    const isCommand = input === '/clear' || input === 'exit';
    expect(isCommand).toBe(false);
  });
});
