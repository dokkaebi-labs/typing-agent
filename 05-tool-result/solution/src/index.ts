import 'dotenv/config';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { readFileTool } from './tools/readFile';

const tools = {
  readFile: readFileTool,
};

async function main() {
  const userInput = 'package.json 파일 읽어줘';

  // === 1차 LLM 호출 ===
  console.log('\n=== 1차 LLM 호출 ===');
  console.log('사용자 입력:', userInput);

  const messages: any[] = [{ role: 'user', content: userInput }];

  const firstResponse = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages,
    tools,
  });

  console.log('LLM 응답:', JSON.stringify(firstResponse.toolCalls, null, 2));

  // Tool 호출이 없으면 바로 종료
  if (!firstResponse.toolCalls || firstResponse.toolCalls.length === 0) {
    console.log('Assistant:', firstResponse.text);
    return;
  }

  // === Tool 실행 ===
  const toolCall = firstResponse.toolCalls[0];

  // dynamic tool 체크
  if (toolCall.dynamic) {
    console.log('Dynamic tool은 지원하지 않습니다');
    return;
  }

  const tool = tools[toolCall.toolName as keyof typeof tools];

  if (!tool || !tool.execute) {
    console.log(`알 수 없는 Tool: ${toolCall.toolName}`);
    return;
  }

  console.log('\n=== Tool 실행 ===');
  console.log('Tool:', toolCall.toolName);

  const toolResult = await tool.execute(toolCall.input, {
    toolCallId: toolCall.toolCallId,
    messages: [],
  });
  console.log('결과:', String(toolResult).slice(0, 100) + '...');

  // === 2차 LLM 호출 ===
  console.log('\n=== 2차 LLM 호출 ===');

  // assistant 메시지 추가
  messages.push({
    role: 'assistant',
    content: [
      {
        type: 'tool-call',
        toolCallId: toolCall.toolCallId,
        toolName: toolCall.toolName,
        input: toolCall.input,
      },
    ],
  });

  // tool 결과 메시지 추가
  messages.push({
    role: 'tool',
    content: [
      {
        type: 'tool-result',
        toolCallId: toolCall.toolCallId,
        toolName: toolCall.toolName,
        output: {
          type: 'text',
          value: String(toolResult),
        },
      },
    ],
  });

  console.log('메시지 히스토리:', messages.length, '개');

  // 2차 LLM 호출
  const finalResponse = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages,
    tools,
  });

  console.log('\n=== 최종 응답 ===');
  console.log(finalResponse.text);
}

main();
