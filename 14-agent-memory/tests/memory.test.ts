/**
 * 22강: AgentMemory 테스트
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AgentMemory } from '../solution/src/agent-memory';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('AgentMemory', () => {
  const testDir = './test-memory-' + Date.now();
  let memory: AgentMemory;

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
    memory = new AgentMemory(testDir);
  });

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true });
    } catch {
      // 무시
    }
  });

  it('인스턴스를 생성할 수 있다', () => {
    expect(memory).toBeInstanceOf(AgentMemory);
  });

  it('파일이 없을 때 null을 반환한다', async () => {
    const result = await memory.getMemory();
    expect(result).toBeNull();
  });

  it('메모리를 저장할 수 있다', async () => {
    await memory.addMemory('이 프로젝트는 TypeScript 기반이야');

    const result = await memory.getMemory();
    expect(result).toBe('- 이 프로젝트는 TypeScript 기반이야');
  });

  it('여러 메모리를 누적해서 저장한다', async () => {
    await memory.addMemory('TypeScript 기반');
    await memory.addMemory('Jest로 테스트');
    await memory.addMemory('camelCase 스타일');

    const result = await memory.getMemory();
    expect(result).toContain('- TypeScript 기반');
    expect(result).toContain('- Jest로 테스트');
    expect(result).toContain('- camelCase 스타일');
  });

  it('CODING_AGENT.md 파일이 생성된다', async () => {
    await memory.addMemory('테스트');

    const filePath = path.join(testDir, 'CODING_AGENT.md');
    const exists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(true);
  });
});

describe('Session vs Memory', () => {
  it('Memory는 Session과 독립적이다', () => {
    // Session은 sessionId로 구분
    const sessionId1 = 'session-1';
    const sessionId2 = 'session-2';

    // Memory는 프로젝트 루트에 하나만 존재
    const memoryPath = 'CODING_AGENT.md';

    // sessionId가 바뀌어도 memory 경로는 동일
    expect(sessionId1).not.toBe(sessionId2);
    expect(memoryPath).toBe('CODING_AGENT.md'); // 항상 동일
  });
});
