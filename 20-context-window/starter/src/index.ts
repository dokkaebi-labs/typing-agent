/**
 * 20강: Context Window와 Sliding Window
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
  let agent = new CodingAgent(); // const → let으로 변경!

  console.log('Coding Agent가 시작되었습니다.');
  console.log('명령어: /clear (새 대화 시작), exit (종료)');
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
      agent = new CodingAgent(); // 새 Agent 생성 (새 UUID)
      console.log('새로운 대화가 시작되었습니다.');
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
