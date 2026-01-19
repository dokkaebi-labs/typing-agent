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
 * Agent Loop 직접 구현하기
 *
 * 이번 실습에서는 while 루프를 사용하여 Agent Loop를 구현합니다.
 * LLM이 Tool 호출을 멈출 때까지 반복하는 구조를 만들어봅시다.
 */

// TODO 1: 최대 반복 횟수 상수 정의
// 힌트: const MAX_ITERATIONS = 10;

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

  // TODO 2: messages 배열 초기화
  // 힌트: user 메시지를 담은 배열을 만드세요
  // const messages: any[] = [{ role: 'user', content: userInput }];

  // TODO 3: iterations 카운터 초기화
  // 힌트: let iterations = 0;

  console.log('\n=== Agent Loop 시작 ===\n');

  // TODO 4: while 루프 작성
  // 힌트: while (iterations < MAX_ITERATIONS) { ... }

  // 루프 내부:

  // TODO 5: LLM 호출
  // 힌트: generateText를 사용하세요
  // const response = await generateText({
  //   model: anthropic('claude-sonnet-4-20250514'),
  //   system: systemPrompt,
  //   messages,
  //   tools,
  // });

  // TODO 6: Tool 호출 여부 확인 및 분기
  // 힌트:
  // if (response.toolCalls && response.toolCalls.length > 0) {
  //   // Tool 호출 처리
  //   // - Tool 실행
  //   // - 메시지 추가
  //   // - iterations 증가
  // } else {
  //   // 자연어 응답 → 루프 종료
  //   console.log('Assistant:', response.text);
  //   break;
  // }

  // TODO 7: 최대 반복 도달 시 경고 출력
  // 힌트:
  // if (iterations >= MAX_ITERATIONS) {
  //   console.log('최대 반복 횟수에 도달했습니다.');
  // }
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
