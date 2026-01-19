/**
 * 24강: Tool Calling 로깅 (실습 진입점)
 *
 * onStepFinish 콜백으로 Tool 호출을 로깅합니다.
 */

import { generateText, tool, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as readline from 'readline';
import { ToolLogger } from './ui/tool-logger';
import 'dotenv/config';

// 간단한 readFileTool
const readFileTool = tool({
  description: '파일의 내용을 읽습니다',
  inputSchema: z.object({
    path: z.string().describe('읽을 파일의 경로'),
  }),
  execute: async ({ path }) => {
    try {
      const content = await fs.readFile(path, 'utf-8');
      return content;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

const toolLogger = new ToolLogger();

// TODO: handleStepFinish 함수 구현
// toolCalls와 toolResults를 받아서 로깅합니다.
function handleStepFinish(
  toolCalls: Array<{ toolName: string; input: Record<string, unknown> }>,
  toolResults: Array<{ toolName: string; result: unknown }>
): void {
  // TODO 1: Tool 호출 로깅
  // for (const call of toolCalls) {
  //   toolLogger.logToolStart(call.toolName, call.input);
  // }

  // TODO 2: Tool 결과 로깅
  // for (const result of toolResults) {
  //   const resultStr = typeof result.result === 'string'
  //     ? result.result
  //     : JSON.stringify(result.result);
  //
  //   if (resultStr.startsWith('Error:')) {
  //     toolLogger.logToolError(result.toolName, resultStr);
  //   } else {
  //     toolLogger.logToolComplete(result.toolName, resultStr);
  //   }
  // }
}

async function chat(userMessage: string): Promise<string> {
  const result = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: '당신은 코딩 에이전트입니다.',
    prompt: userMessage,
    tools: { readFile: readFileTool },
    stopWhen: stepCountIs(5),

    // TODO 3: onStepFinish 콜백 연결
    // onStepFinish: ({ toolCalls, toolResults }) => {
    //   handleStepFinish(
    //     toolCalls.filter((c): c is typeof c & { input: Record<string, unknown> } => !('dynamic' in c && c.dynamic)),
    //     toolResults
    //   );
    // },
  });

  return result.text;
}

async function main() {
  console.log('Tool Logging Demo');
  console.log('='.repeat(40));
  console.log();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = () => {
    rl.question('User > ', async (input) => {
      input = input.trim();

      if (!input) {
        prompt();
        return;
      }

      if (input === '/exit') {
        console.log('종료합니다.');
        rl.close();
        return;
      }

      console.log('\nProcessing...\n');
      const response = await chat(input);
      console.log('\nAssistant >');
      console.log(response);
      console.log('\n' + '-'.repeat(40) + '\n');

      prompt();
    });
  };

  prompt();
}

main().catch(console.error);
