import 'dotenv/config';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { readFileTool } from './tools/readFile';

// tools 객체 구성
const tools = {
  readFile: readFileTool,
};

async function main() {
  const userInput = 'package.json 파일 읽어줘';

  // 1. LLM 호출
  console.log('=== 1. LLM 호출 ===');
  console.log('사용자 입력:', userInput);

  const response = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages: [{ role: 'user', content: userInput }],
    tools,
  });

  console.log('toolCalls:', JSON.stringify(response.toolCalls, null, 2));

  // Tool 호출 여부 확인
  if (!response.toolCalls || response.toolCalls.length === 0) {
    console.log('Assistant:', response.text);
    return;
  }

  // 2. Tool 실행 (라우팅)
  console.log('\n=== 2. Tool 실행 ===');

  const toolCall = response.toolCalls[0];

  // dynamic tool이 아닌 경우에만 처리 (타입 가드)
  if (toolCall.dynamic) {
    console.log('Dynamic tool은 지원하지 않습니다');
    return;
  }

  // toolName으로 해당 Tool 찾기
  const tool = tools[toolCall.toolName];

  if (!tool || !tool.execute) {
    console.log(`알 수 없는 Tool: ${toolCall.toolName}`);
    return;
  }

  console.log('Tool:', toolCall.toolName);
  console.log('Input:', toolCall.input);

  // Tool 실행
  const result = await tool.execute(toolCall.input, {
    toolCallId: toolCall.toolCallId,
    messages: [],
  });

  console.log('결과:', String(result).slice(0, 100) + '...');
}

main();
