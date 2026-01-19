import 'dotenv/config';
import { generateText, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { readFileTool } from './tools/readFileTool';
import { listFilesTool } from './tools/listFilesTool';
import { editFileTool } from './tools/editFileTool';
import * as readline from 'readline';

/**
 * 13강: 중간 점검 - 여기까지 만든 것들
 *
 * TODO: 3개 Tool을 통합해서 Agent를 실행하세요.
 *
 * 이번 실습에서는 새로운 코드를 작성하기보다,
 * 지금까지 만든 Tool들을 조합해서 복합 작업을 테스트합니다.
 */

// tools 객체 구성
const tools = {
  readFile: readFileTool,
  listFiles: listFilesTool,
  editFile: editFileTool,
};

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('=== Coding Agent (3 Tools) ===');
  console.log('Tools: readFile, listFiles, editFile');
  console.log('종료하려면 "exit"를 입력하세요.\n');

  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log('종료합니다.');
        rl.close();
        return;
      }

      try {
        // TODO 1: generateText 호출
        // - model: anthropic('claude-sonnet-4-20250514')
        // - system: '당신은 파일을 읽고 수정하는 코딩 에이전트입니다.'
        // - prompt: input
        // - tools: tools 객체 사용
        // - stopWhen: stepCountIs(10)
        const response = await generateText({
          model: anthropic('claude-sonnet-4-20250514'),
          system: '당신은 파일을 읽고 수정하는 코딩 에이전트입니다.',
          prompt: input,
          tools,
          stopWhen: stepCountIs(10),
        });

        // TODO 2: Tool 호출 로깅 (선택사항)
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
