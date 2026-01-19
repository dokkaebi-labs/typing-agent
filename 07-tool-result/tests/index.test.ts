import { describe, it, expect } from 'vitest';

describe('07-tool-result', () => {
  describe('메시지 구조', () => {
    it('assistant 메시지 구조가 올바라야 한다', () => {
      const assistantMessage = {
        role: 'assistant',
        content: [
          {
            type: 'tool-call',
            toolCallId: 'call_abc123',
            toolName: 'readFile',
            input: { path: 'package.json' },
          },
        ],
      };

      expect(assistantMessage.role).toBe('assistant');
      expect(assistantMessage.content[0].type).toBe('tool-call');
      expect(assistantMessage.content[0].toolCallId).toBe('call_abc123');
      expect(assistantMessage.content[0].toolName).toBe('readFile');
      expect(assistantMessage.content[0].input).toEqual({ path: 'package.json' });
    });

    it('tool 결과 메시지 구조가 올바라야 한다', () => {
      const toolMessage = {
        role: 'tool',
        content: [
          {
            type: 'tool-result',
            toolCallId: 'call_abc123',
            toolName: 'readFile',
            output: { type: 'text', value: '파일 내용입니다' },
          },
        ],
      };

      expect(toolMessage.role).toBe('tool');
      expect(toolMessage.content[0].type).toBe('tool-result');
      expect(toolMessage.content[0].toolCallId).toBe('call_abc123');
      expect(toolMessage.content[0].toolName).toBe('readFile');
      expect(toolMessage.content[0].output.value).toBe('파일 내용입니다');
    });

    it('toolCallId가 매칭되어야 한다', () => {
      const toolCall = {
        type: 'tool-call',
        toolCallId: 'call_xyz789',
        toolName: 'readFile',
        input: { path: 'test.txt' },
      };

      const toolResult = {
        type: 'tool-result',
        toolCallId: toolCall.toolCallId,
        toolName: toolCall.toolName,
        output: { type: 'text', value: '테스트 내용' },
      };

      expect(toolResult.toolCallId).toBe(toolCall.toolCallId);
      expect(toolResult.toolName).toBe(toolCall.toolName);
    });
  });

  describe('메시지 히스토리', () => {
    it('올바른 순서로 메시지가 쌓여야 한다', () => {
      const messages: any[] = [];

      // 1. 사용자 메시지
      messages.push({ role: 'user', content: 'package.json 읽어줘' });

      // 2. assistant 메시지 (tool call)
      messages.push({
        role: 'assistant',
        content: [
          {
            type: 'tool-call',
            toolCallId: 'call_001',
            toolName: 'readFile',
            input: { path: 'package.json' },
          },
        ],
      });

      // 3. tool 결과
      messages.push({
        role: 'tool',
        content: [
          {
            type: 'tool-result',
            toolCallId: 'call_001',
            toolName: 'readFile',
            output: { type: 'text', value: '...' },
          },
        ],
      });

      expect(messages).toHaveLength(3);
      expect(messages[0].role).toBe('user');
      expect(messages[1].role).toBe('assistant');
      expect(messages[2].role).toBe('tool');
    });

    it('2차 LLM 호출 전 메시지가 3개여야 한다', () => {
      const messages: any[] = [
        { role: 'user', content: 'test' },
        {
          role: 'assistant',
          content: [
            {
              type: 'tool-call',
              toolCallId: 'call_001',
              toolName: 'readFile',
              input: { path: 'test.txt' },
            },
          ],
        },
        {
          role: 'tool',
          content: [
            {
              type: 'tool-result',
              toolCallId: 'call_001',
              toolName: 'readFile',
              output: { type: 'text', value: 'test content' },
            },
          ],
        },
      ];

      expect(messages).toHaveLength(3);
    });
  });

  describe('에러 케이스', () => {
    it('에러 문자열도 tool-result로 전달되어야 한다', () => {
      const errorResult = '오류: 파일을 찾을 수 없습니다: secret.txt';

      const toolMessage = {
        role: 'tool',
        content: [
          {
            type: 'tool-result',
            toolCallId: 'call_error',
            toolName: 'readFile',
            output: { type: 'text', value: errorResult },
          },
        ],
      };

      expect(toolMessage.content[0].output.value).toContain('오류');
    });

    it('에러 메시지에 경로가 포함되어야 한다', () => {
      const path = 'secret.txt';
      const errorResult = `오류: 파일을 찾을 수 없습니다: ${path}`;

      expect(errorResult).toContain(path);
    });
  });

  describe('여러 Tool 호출', () => {
    it('여러 tool-result를 content 배열에 담을 수 있어야 한다', () => {
      const toolMessage = {
        role: 'tool',
        content: [
          {
            type: 'tool-result',
            toolCallId: 'call_001',
            toolName: 'readFile',
            output: { type: 'text', value: 'result 1' },
          },
          {
            type: 'tool-result',
            toolCallId: 'call_002',
            toolName: 'readFile',
            output: { type: 'text', value: 'result 2' },
          },
        ],
      };

      expect(toolMessage.content).toHaveLength(2);
      expect(toolMessage.content[0].toolCallId).toBe('call_001');
      expect(toolMessage.content[1].toolCallId).toBe('call_002');
    });
  });
});
