/**
 * 16강: CodingAgent 클래스로 REPL 만들기 (완성 코드)
 *
 * REPL = Read-Eval-Print Loop
 * 입력받고, 실행하고, 출력하고, 반복합니다.
 */

import 'dotenv/config';
import * as readline from 'readline';
import { CodingAgent } from './agent/CodingAgent';

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
  const agent = new CodingAgent();

  console.log('Coding Agent가 시작되었습니다. 종료하려면 "exit"을 입력하세요.');
  console.log();

  while (true) {
    const input = await prompt();

    if (!input) continue; // 빈 입력 무시

    if (input === 'exit') {
      console.log('종료합니다.');
      rl.close();
      break;
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

main().catch(console.error);

// 테스트용 export
export { CodingAgent };
