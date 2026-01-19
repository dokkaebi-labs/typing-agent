import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileTool } from '../solution/src/tools/readFile';
import * as fs from 'fs';
import * as path from 'path';

describe('05-read-file-tool', () => {
  const testDir = path.join(__dirname, 'fixtures');
  const testFile = path.join(testDir, 'test.txt');
  const testContent = 'Hello, World!';

  beforeEach(() => {
    fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(testFile, testContent);
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  describe('readFileTool', () => {
    it('description이 정의되어 있어야 한다', () => {
      expect(readFileTool.description).toBeDefined();
      expect(readFileTool.description).toContain('파일');
    });

    it('inputSchema가 정의되어 있어야 한다', () => {
      expect(readFileTool.inputSchema).toBeDefined();
    });

    it('존재하는 파일의 내용을 반환해야 한다', async () => {
      const result = await readFileTool.execute!(
        { path: testFile },
        { toolCallId: 'test', messages: [] }
      );
      expect(result).toBe(testContent);
    });

    it('존재하지 않는 파일은 에러 메시지를 반환해야 한다', async () => {
      const result = await readFileTool.execute!(
        { path: '/not/exist/file.txt' },
        { toolCallId: 'test', messages: [] }
      );
      expect(result).toContain('오류');
      expect(result).toContain('파일을 찾을 수 없습니다');
    });

    it('디렉토리 경로는 에러 메시지를 반환해야 한다', async () => {
      const result = await readFileTool.execute!(
        { path: testDir },
        { toolCallId: 'test', messages: [] }
      );
      expect(result).toContain('오류');
      expect(result).toContain('디렉토리');
    });

    it('에러 메시지는 경로를 포함해야 한다', async () => {
      const fakePath = '/fake/path/file.txt';
      const result = await readFileTool.execute!(
        { path: fakePath },
        { toolCallId: 'test', messages: [] }
      );
      expect(result).toContain(fakePath);
    });
  });

  describe('에러 처리 패턴', () => {
    it('예외를 던지지 않고 문자열을 반환해야 한다', async () => {
      // 존재하지 않는 파일을 읽어도 예외가 발생하지 않아야 함
      await expect(
        readFileTool.execute!({ path: '/not/exist.txt' }, { toolCallId: 'test', messages: [] })
      ).resolves.not.toThrow();
    });

    it('반환값은 항상 문자열이어야 한다', async () => {
      const successResult = await readFileTool.execute!(
        { path: testFile },
        { toolCallId: 'test', messages: [] }
      );
      const errorResult = await readFileTool.execute!(
        { path: '/not/exist.txt' },
        { toolCallId: 'test', messages: [] }
      );

      expect(typeof successResult).toBe('string');
      expect(typeof errorResult).toBe('string');
    });
  });
});
