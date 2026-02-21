import 'dotenv/config';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { readFileTool } from './tools/readFile';
import * as readline from 'readline';

const tools = {
  readFile: readFileTool,
};

const systemPrompt = `# 역할
당신은 코딩 에이전트입니다.

## 도구
### 사용 가능한 도구
- readFile(path: string): 주어진 경로의 파일 내용을 읽어서 반환합니다.

### 도구 사용 규칙
- 파일을 읽어야 할 때만 readFile 도구를 사용하세요.
- 도구가 필요하지 않은 일반 대화는 그냥 텍스트로 응답하세요.`;

/**
 * Agent Loop 직접 구현하기 - 완성 코드
 *
 * 핵심 구조:
 * while (iterations < MAX_ITERATIONS) {
 *   LLM 호출 → Tool 호출? → 실행 → 메시지 추가 → 반복
 *                    ↓ No
 *               자연어 응답 → break
 * }
 */

// 최대 반복 횟수 상수 정의
const MAX_ITERATIONS = 10;

async function main() {
  // 사용자 입력 받기
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const userInput = await new Promise<string>((resolve) => {
    rl.question('User: ', resolve);
  });
  rl.close();

  // messages 배열 초기화
  const messages: any[] = [{ role: 'user', content: userInput }];

  // iterations 카운터 초기화
  let iterations = 0;

  console.log('\n=== Agent Loop 시작 ===\n');

  // Agent Loop
  while (iterations < MAX_ITERATIONS) {
    console.log(`--- 반복 ${iterations + 1} ---`);

    // LLM 호출
    const response = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt,
      messages,
      tools,
    });

    // Tool 호출 여부 확인
    if (response.toolCalls && response.toolCalls.length > 0) {
      // Tool 호출 처리
      const toolCall = response.toolCalls[0];

      // dynamic tool 체크 (StaticToolCall로 타입 좁히기)
      if ('dynamic' in toolCall && toolCall.dynamic) {
        console.log('Dynamic tool은 지원하지 않습니다');
        break;
      }

      const tool = tools[toolCall.toolName as keyof typeof tools];

      if (!tool || !tool.execute) {
        console.log(`알 수 없는 Tool: ${toolCall.toolName}`);
        break;
      }

      console.log(`[Tool] ${toolCall.toolName}(${JSON.stringify(toolCall.input)})`);

      // Tool 실행
      const toolResult = await tool.execute(toolCall.input, {
        toolCallId: toolCall.toolCallId,
        messages: [],
      });
      console.log(`[결과] ${String(toolResult).slice(0, 80)}...`);

      // 메시지에 추가
      messages.push({
        role: 'assistant',
        content: [{
          type: 'tool-call',
          toolCallId: toolCall.toolCallId,
          toolName: toolCall.toolName,
          input: toolCall.input,
        }],
      });
      messages.push({
        role: 'tool',
        content: [{
          type: 'tool-result',
          toolCallId: toolCall.toolCallId,
          toolName: toolCall.toolName,
          output: { type: 'text', value: String(toolResult) },
        }],
      });

      // iterations 증가
      iterations++;
      console.log('');
    } else {
      // 자연어 응답 → 루프 종료
      console.log('\n=== Agent Loop 종료 ===');
      console.log(`총 ${iterations}번의 Tool 호출 후 완료\n`);
      console.log('Assistant:', response.text);
      break;
    }
  }

  // 최대 반복 도달 시 경고
  if (iterations >= MAX_ITERATIONS) {
    console.log('\n=== Agent Loop 종료 ===');
    console.log(`최대 반복 횟수(${MAX_ITERATIONS})에 도달했습니다.`);
  }
}

main().catch(console.error);

// 테스트용 함수 export
export async function runAgentLoop(userInput: string, maxIterations: number = 10) {
  const messages: any[] = [{ role: 'user', content: userInput }];
  let iterations = 0;
  const toolCallLog: Array<{ tool: string; input: any; result: string }> = [];

  while (iterations < maxIterations) {
    const response = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt,
      messages,
      tools,
    });

    if (response.toolCalls && response.toolCalls.length > 0) {
      const toolCall = response.toolCalls[0];

      // dynamic tool 체크
      if ('dynamic' in toolCall && toolCall.dynamic) {
        break;
      }

      const tool = tools[toolCall.toolName as keyof typeof tools];

      if (!tool || !tool.execute) {
        break;
      }

      const toolResult = await tool.execute(toolCall.input, {
        toolCallId: toolCall.toolCallId,
        messages: [],
      });

      toolCallLog.push({
        tool: toolCall.toolName,
        input: toolCall.input,
        result: String(toolResult).slice(0, 100),
      });

      messages.push({
        role: 'assistant',
        content: [{
          type: 'tool-call',
          toolCallId: toolCall.toolCallId,
          toolName: toolCall.toolName,
          input: toolCall.input,
        }],
      });
      messages.push({
        role: 'tool',
        content: [{
          type: 'tool-result',
          toolCallId: toolCall.toolCallId,
          toolName: toolCall.toolName,
          output: { type: 'text', value: String(toolResult) },
        }],
      });

      iterations++;
    } else {
      return {
        finalResponse: response.text,
        iterations,
        toolCallLog,
        reachedMaxIterations: false,
      };
    }
  }

  return {
    finalResponse: null,
    iterations,
    toolCallLog,
    reachedMaxIterations: true,
  };
}
