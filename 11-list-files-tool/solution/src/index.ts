import 'dotenv/config';
import { generateText, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { listFilesTool } from './tools/listFilesTool';
import * as readline from 'readline';

/**
 * 11강: listFilesTool - 프로젝트 시야 (완성 코드)
 *
 * Agent가 디렉토리 구조를 탐색할 수 있도록 listFilesTool을 사용합니다.
 */

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const userInput = await new Promise<string>((resolve) => {
    rl.question('User: ', resolve);
  });
  rl.close();

  console.log('\n=== listFilesTool 테스트 ===\n');

  const response = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: '당신은 파일을 읽고 분석하는 코딩 에이전트입니다.',
    prompt: userInput,
    tools: { listFiles: listFilesTool },
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
export { listFilesTool };
