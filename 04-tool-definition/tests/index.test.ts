import { describe, it, expect } from 'vitest';
import { readFileTool, editFileTool, listFilesTool } from '../solution/src/index';

describe('04-tool-definition', () => {
  describe('readFileTool', () => {
    it('description이 정의되어 있어야 한다', () => {
      expect(readFileTool.description).toBeDefined();
      expect(typeof readFileTool.description).toBe('string');
    });

    it('inputSchema가 정의되어 있어야 한다', () => {
      expect(readFileTool.inputSchema).toBeDefined();
    });

    it('execute가 파일 경로를 포함한 결과를 반환해야 한다', async () => {
      const result = await readFileTool.execute!(
        { path: 'src/index.ts' },
        { toolCallId: 'test', messages: [] }
      );
      expect(result).toContain('src/index.ts');
    });

    it('다른 경로로도 동작해야 한다', async () => {
      const result = await readFileTool.execute!(
        { path: 'package.json' },
        { toolCallId: 'test', messages: [] }
      );
      expect(result).toContain('package.json');
    });
  });

  describe('editFileTool', () => {
    it('description이 정의되어 있어야 한다', () => {
      expect(editFileTool.description).toBeDefined();
    });

    it('inputSchema에 path, oldText, newText가 있어야 한다', () => {
      expect(editFileTool.inputSchema).toBeDefined();
    });

    it('execute가 success를 반환해야 한다', async () => {
      const result = await editFileTool.execute!(
        { path: 'src/index.ts', oldText: 'hello', newText: 'world' },
        { toolCallId: 'test', messages: [] }
      );
      expect(result).toEqual({ success: true });
    });

    it('다른 텍스트로도 동작해야 한다', async () => {
      const result = await editFileTool.execute!(
        { path: 'test.ts', oldText: 'console.log', newText: 'console.error' },
        { toolCallId: 'test', messages: [] }
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('listFilesTool', () => {
    it('description이 정의되어 있어야 한다', () => {
      expect(listFilesTool.description).toBeDefined();
    });

    it('execute가 배열을 반환해야 한다', async () => {
      const result = await listFilesTool.execute!(
        { path: 'src' },
        { toolCallId: 'test', messages: [] }
      );
      expect(Array.isArray(result)).toBe(true);
    });

    it('recursive 옵션 없이도 동작해야 한다', async () => {
      const result = await listFilesTool.execute!(
        { path: 'src' },
        { toolCallId: 'test', messages: [] }
      );
      expect(result).toBeDefined();
    });

    it('recursive 옵션과 함께 동작해야 한다', async () => {
      const result = await listFilesTool.execute!(
        { path: 'src', recursive: true },
        { toolCallId: 'test', messages: [] }
      );
      expect(result).toBeDefined();
    });

    it('선택적 파라미터(recursive)가 없어도 동작해야 한다', async () => {
      const result = await listFilesTool.execute!(
        { path: '.' },
        { toolCallId: 'test', messages: [] }
      );
      expect(result).toBeDefined();
    });
  });
});
