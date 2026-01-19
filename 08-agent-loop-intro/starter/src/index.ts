import 'dotenv/config';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { readFileTool } from './tools/readFile';

const tools = {
  readFile: readFileTool,
};

/**
 * Agent Loop의 필요성을 이해하기 위한 실습입니다.
 *
 * 이 코드는 7강에서 만든 코드와 거의 동일합니다.
 * 차이점: 여러 파일을 읽어야 하는 요청을 보냅니다.
 *
 * 실행해보고, 무엇이 문제인지 확인해보세요.
 */

async function main() {
  // 주의: 이 요청은 두 파일을 모두 읽어야 합니다!
  const userInput = 'package.json이랑 tsconfig.json 둘 다 읽어서 이 프로젝트가 뭔지 설명해줘';

  // TODO 1: messages 배열 초기화
  // 힌트: 7강에서 했던 것처럼 user 메시지를 담은 배열을 만드세요

  // TODO 2: 1차 LLM 호출
  // 힌트: generateText를 사용하세요
  // - model: anthropic('claude-sonnet-4-20250514')
  // - messages: 위에서 만든 배열
  // - tools: tools 객체

  // TODO 3: Tool 호출 확인
  // 힌트: toolCalls가 없으면 텍스트 응답을 출력하고 종료

  // TODO 4: Tool 실행
  // 힌트: 7강에서 했던 것처럼 Tool을 실행하세요
  // - dynamic tool 체크: if ('dynamic' in toolCall && toolCall.dynamic) 처리
  // - tool과 tool.execute 존재 확인
  // - execute 호출 시 옵션 전달: { toolCallId, messages: [] }

  // TODO 5: 2차 LLM 호출을 위한 메시지 추가
  // 힌트:
  // - assistant 메시지 (toolCalls 포함)
  // - tool 메시지 (결과 포함)

  // TODO 6: 2차 LLM 호출
  // 힌트: generateText를 다시 호출하세요

  // TODO 7: 문제점 확인 - 2차 응답이 또 Tool 호출인지 확인
  // 아래 코드를 완성하세요:
  // if (secondResponse.toolCalls && secondResponse.toolCalls.length > 0) {
  //   console.log('\n=== 문제 발견! ===');
  //   console.log('2차 LLM이 또 Tool을 호출하려고 합니다:');
  //   console.log(JSON.stringify(secondResponse.toolCalls, null, 2));
  //   console.log('\n하지만 현재 코드는 여기서 끝나버립니다...');
  //   console.log('tsconfig.json은 읽지 못한 채 종료됩니다.');
  //   console.log('\n이것이 Agent Loop가 필요한 이유입니다!');
  // } else {
  //   console.log('\n=== 최종 응답 ===');
  //   console.log(secondResponse.text);
  // }
}

// 실행 가능한 함수 export (테스트용)
export async function runSinglePass() {
  const userInput = 'package.json이랑 tsconfig.json 둘 다 읽어서 이 프로젝트가 뭔지 설명해줘';

  const messages: any[] = [{ role: 'user', content: userInput }];

  // 1차 호출
  const firstResponse = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages,
    tools,
  });

  if (!firstResponse.toolCalls || firstResponse.toolCalls.length === 0) {
    return { type: 'text', content: firstResponse.text, needsMoreTools: false };
  }

  // Tool 실행
  const toolCall = firstResponse.toolCalls[0];

  // dynamic tool 체크
  if ('dynamic' in toolCall && toolCall.dynamic) {
    return { type: 'error', content: 'Dynamic tool not supported', needsMoreTools: false };
  }

  const tool = tools[toolCall.toolName as keyof typeof tools];

  if (!tool || !tool.execute) {
    return { type: 'error', content: `Unknown tool: ${toolCall.toolName}`, needsMoreTools: false };
  }

  const toolResult = await tool.execute(toolCall.input, {
    toolCallId: toolCall.toolCallId,
    messages: [],
  });

  // 2차 호출
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

  const secondResponse = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages,
    tools,
  });

  // 2차 응답이 또 Tool 호출인지 확인
  const needsMoreTools = secondResponse.toolCalls && secondResponse.toolCalls.length > 0;

  return {
    type: needsMoreTools ? 'toolCall' : 'text',
    content: needsMoreTools ? secondResponse.toolCalls : secondResponse.text,
    needsMoreTools,
  };
}

main().catch(console.error);
