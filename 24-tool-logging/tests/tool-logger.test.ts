/**
 * 24강: Tool Logger 테스트
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToolLogger } from '../solution/src/ui/tool-logger';

describe('ToolLogger', () => {
  let logger: ToolLogger;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logger = new ToolLogger();
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('인스턴스를 생성할 수 있다', () => {
    expect(logger).toBeInstanceOf(ToolLogger);
  });

  it('logToolStart가 Tool 이름과 인자를 출력한다', () => {
    logger.logToolStart('readFile', { path: 'README.md' });

    expect(consoleSpy).toHaveBeenCalled();
    const calls = consoleSpy.mock.calls.flat().join(' ');
    expect(calls).toContain('readFile');
    expect(calls).toContain('path');
    expect(calls).toContain('README.md');
  });

  it('logToolStart가 아이콘을 출력한다', () => {
    logger.logToolStart('readFile', { path: 'test.txt' });

    const calls = consoleSpy.mock.calls.flat().join(' ');
    expect(calls).toContain('📖');
  });

  it('logToolComplete가 완료 메시지를 출력한다', () => {
    logger.logToolStart('readFile', { path: 'test.txt' });
    logger.logToolComplete('readFile', 'file content');

    const calls = consoleSpy.mock.calls.flat().join(' ');
    expect(calls).toContain('✓');
    expect(calls).toContain('완료');
  });

  it('logToolComplete가 실행 시간을 표시한다', async () => {
    logger.logToolStart('readFile', { path: 'test.txt' });

    // 약간의 지연
    await new Promise((resolve) => setTimeout(resolve, 10));

    logger.logToolComplete('readFile', 'content');

    const calls = consoleSpy.mock.calls.flat().join(' ');
    expect(calls).toMatch(/\d+ms/);
  });

  it('logToolComplete가 긴 결과는 바이트 수로 표시한다', () => {
    logger.logToolStart('readFile', { path: 'test.txt' });
    const longResult = 'a'.repeat(200);
    logger.logToolComplete('readFile', longResult);

    const calls = consoleSpy.mock.calls.flat().join(' ');
    expect(calls).toContain('bytes');
  });

  it('logToolError가 에러 메시지를 출력한다', () => {
    logger.logToolStart('readFile', { path: 'notfound.txt' });
    logger.logToolError('readFile', 'ENOENT: no such file');

    const calls = consoleSpy.mock.calls.flat().join(' ');
    expect(calls).toContain('✗');
    expect(calls).toContain('실패');
    expect(calls).toContain('ENOENT');
  });

  it('각 Tool에 맞는 아이콘을 반환한다', () => {
    const tools = ['readFile', 'listFiles', 'editFile', 'bash', 'codeSearch'];
    const expectedIcons = ['📖', '📁', '✏️', '💻', '🔍'];

    tools.forEach((toolName, index) => {
      consoleSpy.mockClear();
      logger.logToolStart(toolName, {});
      const calls = consoleSpy.mock.calls.flat().join(' ');
      expect(calls).toContain(expectedIcons[index]);
    });
  });

  it('알 수 없는 Tool은 기본 아이콘을 사용한다', () => {
    logger.logToolStart('unknownTool', {});

    const calls = consoleSpy.mock.calls.flat().join(' ');
    expect(calls).toContain('🔧');
  });
});

describe('Tool Logging Integration', () => {
  it('시작 → 완료 흐름이 정상 동작한다', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = new ToolLogger();

    logger.logToolStart('readFile', { path: 'test.txt' });
    logger.logToolComplete('readFile', 'content');

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('시작 → 실패 흐름이 정상 동작한다', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = new ToolLogger();

    logger.logToolStart('readFile', { path: 'notfound.txt' });
    logger.logToolError('readFile', 'File not found');

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
