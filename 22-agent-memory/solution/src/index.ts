/**
 * 22강: AgentMemory - 프로젝트 컨텍스트 (완성 코드)
 */

import 'dotenv/config';
import * as readline from 'readline';
import { CodingAgent } from './coding-agent';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(): Promise<string> {
  return new Promise((resolve) => {
    rl.question('User: ', (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  let agent = new CodingAgent();

  console.log('Coding Agent가 시작되었습니다.');
  console.log('명령어: /clear (새 대화), /memory add <내용>, /memory show, exit (종료)');
  console.log();

  while (true) {
    const input = await prompt();

    if (!input) continue;

    if (input === 'exit') {
      console.log('종료합니다.');
      rl.close();
      break;
    }

    // /clear 명령 처리
    if (input === '/clear') {
      agent = new CodingAgent();
      console.log('새로운 대화가 시작되었습니다.');
      console.log();
      continue;
    }

    // /memory add 명령어
    if (input.startsWith('/memory add ')) {
      const content = input.replace('/memory add ', '').trim();
      await agent.addMemory(content);
      console.log(`메모리에 저장했습니다: ${content}`);
      console.log();
      continue;
    }

    // /memory show 명령어
    if (input === '/memory show') {
      const memory = await agent.getMemory();
      if (memory) {
        console.log('=== Project Memory ===');
        console.log(memory);
        console.log('====================');
      } else {
        console.log('저장된 메모리가 없습니다.');
      }
      console.log();
      continue;
    }

    try {
      const response = await agent.chat(input);
      console.log('Agent:', response);
      console.log();
    } catch (error) {
      console.error('오류 발생:', error);
      console.log();
    }
  }
}

main();
