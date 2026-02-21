import 'dotenv/config';
import { generateText, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { readFileTool } from './tools/readFileTool';
import { listFilesTool } from './tools/listFilesTool';
import { editFileTool } from './tools/editFileTool';
import { bashTool } from './tools/bashTool';
import { codeSearchTool } from './tools/codeSearchTool';
import * as readline from 'readline';

/**
 * 시스템 도구 확장 (완성 코드)
 *
 * 5개 Tool을 통합해서 Agent를 실행합니다:
 * - readFileTool: 파일 읽기
 * - listFilesTool: 디렉토리 탐색
 * - editFileTool: 파일 수정
 * - bashTool: 시스템 명령어 실행
 * - codeSearchTool: 코드베이스 검색
 */

// tools 객체 구성 - 5개 Tool 통합
const tools = {
  readFile: readFileTool,
  listFiles: listFilesTool,
  editFile: editFileTool,
  bash: bashTool,
  codeSearch: codeSearchTool,
};

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('=== Coding Agent (5 Tools) ===');
  console.log('Tools: readFile, listFiles, editFile, bash, codeSearch');
  console.log('종료하려면 "exit"를 입력하세요.\n');

  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log('종료합니다.');
        rl.close();
        return;
      }

      try {
        const response = await generateText({
          model: anthropic('claude-sonnet-4-20250514'),
          system: '당신은 코드를 읽고, 수정하고, 실행하는 코딩 에이전트입니다.',
          prompt: input,
          tools,
          stopWhen: stepCountIs(10),
        });

        // Tool 호출 로깅
        for (const step of response.steps) {
          if (step.toolCalls && step.toolCalls.length > 0) {
            for (const toolCall of step.toolCalls) {
              console.log(`[Tool] ${toolCall.toolName}(${JSON.stringify(toolCall.input).slice(0, 50)}...)`);
            }
          }
        }

        console.log(`\nAgent: ${response.text}\n`);
      } catch (error) {
        console.error('오류:', error);
      }

      askQuestion();
    });
  };

  askQuestion();
}

main().catch(console.error);

// 테스트용 함수 export
export async function runAgent(userInput: string) {
  const response = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: '당신은 코드를 읽고, 수정하고, 실행하는 코딩 에이전트입니다.',
    prompt: userInput,
    tools,
    stopWhen: stepCountIs(10),
  });

  return {
    text: response.text,
    steps: response.steps,
    toolCalls: response.steps.flatMap((step) => step.toolCalls || []),
  };
}

export { readFileTool, listFilesTool, editFileTool, bashTool, codeSearchTool };
