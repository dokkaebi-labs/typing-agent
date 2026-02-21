import 'dotenv/config';
import { generateText, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { readFileTool } from './tools/readFileTool';
import * as readline from 'readline';

/**
 * Vercel AI SDK 고수준 전환 - 완성 코드
 *
 * 9강 코드와 비교:
 * - 9강: ~80줄 (while 루프, 메시지 관리, 종료 조건 직접 구현)
 * - 10강: ~30줄 (stopWhen 옵션 하나로 대체)
 *
 * 동일한 결과, 70% 코드 감소!
 */

// tools 객체 분리 (6강 이후 패턴)
const tools = {
  readFile: readFileTool,
};

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

  console.log('\n=== Vercel AI SDK 고수준 API 실행 ===\n');

  // system prompt - Tool 설명은 자동 주입되므로 역할만 적습니다
  const systemPrompt = '당신은 파일을 읽고 분석하는 코딩 에이전트입니다.';

  // generateText 호출 - 이게 전부입니다!
  const response = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: systemPrompt,
    prompt: userInput,
    tools,
    stopWhen: stepCountIs(10), // 이 한 줄이 9강의 while 루프를 대체합니다!
  });

  // 실행 과정 로깅 (선택사항)
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
      console.log(`[Text] ${step.text.slice(0, 80)}...`);
    }
  }

  // 최종 응답 출력
  console.log('\n=== 최종 응답 ===\n');
  console.log('Assistant:', response.text);
}

main().catch(console.error);

// 테스트용 함수 export
export async function runHighLevelAgent(userInput: string, maxSteps: number = 10) {
  const response = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: '당신은 파일을 읽고 분석하는 코딩 에이전트입니다.',
    prompt: userInput,
    tools,
    stopWhen: stepCountIs(maxSteps),
  });

  return {
    text: response.text,
    steps: response.steps,
    toolCalls: response.steps.flatMap((step) => step.toolCalls || []),
    toolResults: response.steps.flatMap((step) => step.toolResults || []),
  };
}
