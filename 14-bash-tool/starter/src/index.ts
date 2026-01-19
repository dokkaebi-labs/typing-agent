import 'dotenv/config';
import { generateText, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { bashTool } from './tools/bashTool';
import * as readline from 'readline';

/**
 * 14강: bashTool - 시스템 명령어 실행
 *
 * 이 실습에서는 Agent가 시스템 명령어를 실행할 수 있도록
 * bashTool을 구현합니다.
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

  console.log('\n=== bashTool 테스트 ===\n');

  const response = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: '당신은 코드를 읽고, 수정하고, 실행하는 코딩 에이전트입니다.',
    prompt: userInput,
    tools: { bash: bashTool },
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
export { bashTool };
