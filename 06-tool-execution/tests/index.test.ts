import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileTool } from '../solution/src/tools/readFile';

describe('06-tool-execution', () => {
  describe('tools 객체 패턴', () => {
    it('tools 객체에서 Tool을 찾을 수 있어야 한다', () => {
      const tools = {
        readFile: readFileTool,
      };

      const toolName = 'readFile';
      const tool = tools[toolName as keyof typeof tools];

      expect(tool).toBeDefined();
      expect(tool).toBe(readFileTool);
    });

    it('존재하지 않는 Tool은 undefined를 반환해야 한다', () => {
      const tools = {
        readFile: readFileTool,
      };

      const toolName = 'unknownTool';
      const tool = tools[toolName as keyof typeof tools];

      expect(tool).toBeUndefined();
    });
  });

  describe('Tool 실행', () => {
    it('Tool의 execute 함수를 호출할 수 있어야 한다', async () => {
      const tools = {
        readFile: readFileTool,
      };

      const toolCall = {
        toolName: 'readFile',
        input: { path: 'package.json' },
      };

      const tool = tools[toolCall.toolName as keyof typeof tools];
      const result = await tool.execute!(toolCall.input, { toolCallId: 'test', messages: [] });

      expect(typeof result).toBe('string');
    });

    it('input을 올바르게 전달해야 한다', async () => {
      const mockExecute = vi.fn().mockResolvedValue('mock result');
      const mockTool = {
        execute: mockExecute,
      };

      const input = { path: 'test.txt' };
      await mockTool.execute!(input, { toolCallId: 'test', messages: [] });

      expect(mockExecute).toHaveBeenCalledWith(input, expect.any(Object));
    });
  });

  describe('toolCalls 구조', () => {
    it('toolCalls 배열 구조를 이해해야 한다', () => {
      const mockToolCalls = [
        {
          toolCallId: 'call_abc123',
          toolName: 'readFile',
          input: { path: 'package.json' },
        },
      ];

      expect(mockToolCalls).toHaveLength(1);
      expect(mockToolCalls[0].toolName).toBe('readFile');
      expect(mockToolCalls[0].input.path).toBe('package.json');
      expect(mockToolCalls[0].toolCallId).toBeDefined();
    });

    it('여러 toolCalls를 처리할 수 있어야 한다', () => {
      const mockToolCalls = [
        { toolCallId: 'call_1', toolName: 'readFile', input: { path: 'a.txt' } },
        { toolCallId: 'call_2', toolName: 'readFile', input: { path: 'b.txt' } },
      ];

      expect(mockToolCalls).toHaveLength(2);
      expect(mockToolCalls[0].input.path).toBe('a.txt');
      expect(mockToolCalls[1].input.path).toBe('b.txt');
    });
  });

  describe('Tool 호출 여부 확인', () => {
    it('toolCalls가 빈 배열이면 Tool 호출 없음', () => {
      const response = { toolCalls: [], text: '안녕하세요!' };

      const hasToolCalls = response.toolCalls && response.toolCalls.length > 0;
      expect(hasToolCalls).toBe(false);
    });

    it('toolCalls에 항목이 있으면 Tool 호출 있음', () => {
      const response = {
        toolCalls: [{ toolCallId: 'call_1', toolName: 'readFile', input: {} }],
        text: '',
      };

      const hasToolCalls = response.toolCalls && response.toolCalls.length > 0;
      expect(hasToolCalls).toBe(true);
    });
  });
});
