/**
 * 16강: CodingAgent 클래스로 REPL 만들기 (스타터 코드)
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

// TODO 3: prompt() 함수 구현
// - Promise<string>을 반환하는 함수
// - rl.question()으로 사용자 입력을 받습니다
// - 입력값을 trim()해서 resolve합니다
//
// 힌트:
// function prompt(): Promise<string> {
//   return new Promise((resolve) => {
//     rl.question('User: ', (answer) => {
//       resolve(answer.trim());
//     });
//   });
// }

// TODO 4: main() 함수 구현 - REPL 루프
// 1. CodingAgent 인스턴스 생성
// 2. 시작 메시지 출력
// 3. while (true) 무한 루프
//    - prompt()로 입력 받기
//    - 빈 입력이면 continue
//    - "exit"이면 종료
//    - agent.chat(input)으로 응답 받아서 출력
//
// 힌트:
// async function main() {
//   const agent = new CodingAgent();
//   console.log('Coding Agent가 시작되었습니다. 종료하려면 "exit"을 입력하세요.');
//
//   while (true) {
//     const input = await prompt();
//     if (!input) continue;
//     if (input === 'exit') {
//       console.log('종료합니다.');
//       rl.close();
//       break;
//     }
//     const response = await agent.chat(input);
//     console.log('Agent:', response);
//   }
// }

async function main() {
  console.log('TODO 3, 4를 완성하세요!');
}

main().catch(console.error);
