import 'dotenv/config';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { readFileTool } from './tools/readFile';

// TODO 1: tools 객체를 구성하세요
// 힌트: const tools = { readFile: readFileTool };
const tools = {};

async function main() {
  const userInput = 'package.json 파일 읽어줘';

  // 1. LLM 호출
  console.log('=== 1. LLM 호출 ===');
  console.log('사용자 입력:', userInput);

  const response = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages: [{ role: 'user', content: userInput }],
    tools: tools as any,
  });

  console.log('toolCalls:', JSON.stringify(response.toolCalls, null, 2));

  // TODO 2: toolCalls가 있는지 확인하는 조건문을 작성하세요
  // 힌트: if (!response.toolCalls || response.toolCalls.length === 0) {
  //         console.log('Assistant:', response.text);
  //         return;
  //       }

  // 2. Tool 실행 (라우팅)
  console.log('\n=== 2. Tool 실행 ===');

  const toolCall = response.toolCalls[0];

  // TODO 3: toolName으로 해당 Tool을 찾으세요
  // 힌트: const tool = tools[toolCall.toolName];
  const tool = null as any;

  if (!tool || !tool.execute) {
    console.log(`알 수 없는 Tool: ${toolCall.toolName}`);
    return;
  }

  console.log('Tool:', toolCall.toolName);
  console.log('Input:', toolCall.input);

  // TODO 4: Tool의 execute 함수를 호출하세요
  // 힌트: const result = await tool.execute(toolCall.input, {});
  const result = 'TODO 4를 완성하세요';

  console.log('결과:', String(result).slice(0, 100) + '...');
}

main();
