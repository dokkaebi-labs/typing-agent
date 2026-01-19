import 'dotenv/config';
import { generateText, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { readFileTool } from './tools/readFileTool';
import * as readline from 'readline';

/**
 * Vercel AI SDK 고수준 전환
 *
 * 9강에서 직접 구현했던 Agent Loop를 Vercel AI SDK의 고수준 API로 대체합니다.
 * - while 루프 → stopWhen 옵션
 * - 메시지 관리 → 자동
 * - 종료 조건 판단 → 자동
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

  // TODO 1: system prompt 정의 (간단하게!)
  // 힌트: Tool 설명은 tool()의 description이 자동으로 주입하므로, 역할만 적으면 됩니다
  // const systemPrompt = '당신은 파일을 읽고 분석하는 코딩 에이전트입니다.';

  // TODO 2: generateText 호출 (9강의 while 루프 대신!)
  // 힌트: stopWhen과 stepCountIs가 핵심입니다
  // const response = await generateText({
  //   model: anthropic('claude-sonnet-4-20250514'),
  //   system: systemPrompt,
  //   prompt: userInput,
  //   tools,  // 위에서 정의한 tools 객체 사용
  //   stopWhen: stepCountIs(10), // 이 한 줄이 9강의 while 루프를 대체합니다!
  // });

  // TODO 3: 응답 출력
  // console.log('Assistant:', response.text);

  // 비교해보세요 - 삭제된 것들:
  // - const messages: any[] = [...] (메시지 배열)
  // - let iterations = 0 (카운터)
  // - while (iterations < MAX_ITERATIONS) { ... } (루프 전체)
  // - if (response.toolCalls && response.toolCalls.length > 0) (분기)
  // - messages.push(...) (메시지 추가)
  // - iterations++ (카운터 증가)
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
