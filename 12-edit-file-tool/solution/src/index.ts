import 'dotenv/config';
import { generateText, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { editFileTool } from './tools/editFileTool';
import * as readline from 'readline';

/**
 * 12강: editFileTool - 코드 수정 능력 (완성 코드)
 *
 * Agent가 파일을 수정할 수 있도록 editFileTool을 사용합니다.
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

  console.log('\n=== editFileTool 테스트 ===\n');

  const response = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: '당신은 파일을 읽고 수정하는 코딩 에이전트입니다.',
    prompt: userInput,
    tools: { editFile: editFileTool },
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
export { editFileTool };
