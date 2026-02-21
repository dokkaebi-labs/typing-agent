import 'dotenv/config';
import { generateText, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { readFileTool } from './tools/readFileTool';
import { listFilesTool } from './tools/listFilesTool';
import { editFileTool } from './tools/editFileTool';
// TODO 1: bashTool을 import하세요
// import { bashTool } from './tools/bashTool';
// TODO 2: codeSearchTool을 import하세요
// import { codeSearchTool } from './tools/codeSearchTool';
import * as readline from 'readline';

/**
 * 시스템 도구 확장
 *
 * 이전 강의에서 만든 파일 도구(readFile, listFiles, editFile)에 이어,
 * bashTool과 codeSearchTool을 추가합니다.
 *
 * - readFileTool: 파일 읽기 (이전 강의에서 완성)
 * - listFilesTool: 디렉토리 탐색 (이전 강의에서 완성)
 * - editFileTool: 파일 수정 (이전 강의에서 완성)
 * - bashTool: 시스템 명령어 실행 (TODO)
 * - codeSearchTool: 코드베이스 검색 (TODO)
 */

// TODO 3: tools 객체에 bash와 codeSearch를 추가하세요
const tools = {
  readFile: readFileTool,
  listFiles: listFilesTool,
  editFile: editFileTool,
  // bash: bashTool,
  // codeSearch: codeSearchTool,
};

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('=== Coding Agent (System Tools) ===');
  console.log('Tools: readFile, listFiles, editFile + bash(TODO), codeSearch(TODO)');
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
export { readFileTool, listFilesTool, editFileTool };
