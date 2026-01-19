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
 * 실행해보면, 2차 LLM이 또 Tool을 호출하려고 하지만
 * 현재 코드는 거기서 끝나버리는 문제를 확인할 수 있습니다.
 */

async function main() {
  // 주의: 이 요청은 두 파일을 모두 읽어야 합니다!
  const userInput = 'package.json이랑 tsconfig.json 둘 다 읽어서 이 프로젝트가 뭔지 설명해줘';

  console.log('=== Agent Loop 필요성 실습 ===');
  console.log('요청:', userInput);
  console.log('\n이 요청을 완수하려면 2개 파일을 모두 읽어야 합니다.');
  console.log('현재 구조에서 어떻게 동작하는지 확인해봅시다.\n');

  // messages 배열 초기화
  const messages: any[] = [{ role: 'user', content: userInput }];

  // === 1차 LLM 호출 ===
  console.log('=== 1차 LLM 호출 ===');

  const firstResponse = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages,
    tools,
  });

  // Tool 호출 확인
  if (!firstResponse.toolCalls || firstResponse.toolCalls.length === 0) {
    console.log('LLM이 바로 응답했습니다 (Tool 호출 없음)');
    console.log('Assistant:', firstResponse.text);
    return;
  }

  const toolCall = firstResponse.toolCalls[0];

  // dynamic tool 체크
  if ('dynamic' in toolCall && toolCall.dynamic) {
    console.log('Dynamic tool은 지원하지 않습니다');
    return;
  }

  console.log('LLM이 Tool을 호출했습니다:');
  console.log('- Tool:', toolCall.toolName);
  console.log('- 인자:', JSON.stringify(toolCall.input));

  // === Tool 실행 ===
  console.log('\n=== Tool 실행 ===');

  const tool = tools[toolCall.toolName as keyof typeof tools];

  if (!tool || !tool.execute) {
    console.log(`알 수 없는 Tool: ${toolCall.toolName}`);
    return;
  }

  const toolResult = await tool.execute(toolCall.input, {
    toolCallId: toolCall.toolCallId,
    messages: [],
  });
  console.log('결과:', String(toolResult).slice(0, 80) + '...');

  // === 2차 LLM 호출 준비 ===
  console.log('\n=== 2차 LLM 호출 ===');

  // assistant 메시지 추가
  messages.push({
    role: 'assistant',
    content: [{
      type: 'tool-call',
      toolCallId: toolCall.toolCallId,
      toolName: toolCall.toolName,
      input: toolCall.input,
    }],
  });

  // tool 결과 메시지 추가
  messages.push({
    role: 'tool',
    content: [{
      type: 'tool-result',
      toolCallId: toolCall.toolCallId,
      toolName: toolCall.toolName,
      output: { type: 'text', value: String(toolResult) },
    }],
  });

  // 2차 LLM 호출
  const secondResponse = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages,
    tools,
  });

  // === 문제점 확인 ===
  // 2차 응답이 또 Tool 호출인지 확인
  if (secondResponse.toolCalls && secondResponse.toolCalls.length > 0) {
    console.log('\n========================================');
    console.log('       문제 발견!');
    console.log('========================================');
    console.log('\n2차 LLM이 또 Tool을 호출하려고 합니다:');
    console.log('- Tool:', secondResponse.toolCalls[0].toolName);
    console.log('- 인자:', JSON.stringify(secondResponse.toolCalls[0].input));

    console.log('\n하지만 현재 코드는 여기서 끝나버립니다...');
    console.log('tsconfig.json은 읽지 못한 채 종료됩니다.');

    console.log('\n========================================');
    console.log('이것이 Agent Loop가 필요한 이유입니다!');
    console.log('========================================');

    console.log('\n해결책: while 루프로 Tool 호출이 끝날 때까지 반복');
    console.log('→ 다음 강의에서 구현합니다.');
  } else {
    console.log('\n=== 최종 응답 ===');
    console.log(secondResponse.text);
    console.log('\n(운이 좋게 LLM이 한 번에 처리했거나, 요청을 다르게 해석했습니다)');
  }
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
