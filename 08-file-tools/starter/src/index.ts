import 'dotenv/config';
import { generateText, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { readFileTool } from './tools/readFileTool';
// TODO 1: listFilesTool을 import하세요
// import { listFilesTool } from './tools/listFilesTool';
// TODO 2: editFileTool을 import하세요
// import { editFileTool } from './tools/editFileTool';
import * as readline from 'readline';

/**
 * 파일 도구 확장
 *
 * 이전 강의에서 만든 readFileTool에 이어,
 * listFilesTool과 editFileTool을 추가합니다.
 *
 * - readFileTool: 파일 읽기 (이전 강의에서 완성)
 * - listFilesTool: 디렉토리 탐색 (TODO)
 * - editFileTool: 파일 수정 (TODO)
 */

// TODO 3: tools 객체에 listFiles와 editFile을 추가하세요
const tools = {
  readFile: readFileTool,
  // listFiles: listFilesTool,
  // editFile: editFileTool,
};

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const userInput = await new Promise<string>((resolve) => {
    rl.question('User: ', resolve);
  });
  rl.close();

  console.log('\n=== File Tools 테스트 ===\n');

  const response = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: '당신은 파일을 읽고 수정하는 코딩 에이전트입니다.',
    prompt: userInput,
    tools,
    stopWhen: stepCountIs(10),
  });

  console.log(`총 ${response.steps.length}단계 실행됨\n`);

  for (let i = 0; i < response.steps.length; i++) {
    const step = response.steps[i];
    console.log(`--- Step ${i + 1} ---`);

    if (step.toolCalls && step.toolCalls.length > 0) {
      for (const toolCall of step.toolCalls) {
        console.log(`[Tool] ${toolCall.toolName}(${JSON.stringify(toolCall.input)})`);
      }
    }

    if (step.text) {
      console.log(`[Text] ${step.text.slice(0, 100)}...`);
    }
  }

  console.log('\n=== 최종 응답 ===\n');
  console.log('Assistant:', response.text);
}

main().catch(console.error);

// 테스트용 함수 export
export { readFileTool };
