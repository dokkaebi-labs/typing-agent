/**
 * 24강: Tool Calling 로깅 (완성 코드)
 */

import { generateText, tool, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as readline from 'readline';
import { ToolLogger } from './ui/tool-logger';
import 'dotenv/config';

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

function handleStepFinish(
  toolCalls: Array<{ toolName: string; input: Record<string, unknown> }>,
  toolResults: Array<{ toolName: string; output: unknown }>
): void {
  // Tool 호출 로깅
  for (const call of toolCalls) {
    toolLogger.logToolStart(call.toolName, call.input);
  }

  // Tool 결과 로깅
  for (const result of toolResults) {
    const resultStr =
      typeof result.output === 'string'
        ? result.output
        : JSON.stringify(result.output);

    if (resultStr?.startsWith('Error:')) {
      toolLogger.logToolError(result.toolName, resultStr);
    } else {
      toolLogger.logToolComplete(result.toolName, resultStr);
    }
  }
}

async function chat(userMessage: string): Promise<string> {
  const result = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: '당신은 코딩 에이전트입니다.',
    prompt: userMessage,
    tools: { readFile: readFileTool },
    stopWhen: stepCountIs(5),

    onStepFinish: ({ toolCalls, toolResults }) => {
      handleStepFinish(
        toolCalls.filter((c): c is typeof c & { input: Record<string, unknown> } => !('dynamic' in c && c.dynamic)),
        toolResults
      );
    },
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
