/**
 * 19강: Session 초기화 기능 만들기 (스타터 코드)
 *
 * /clear 명령어로 새 세션을 시작하는 기능을 구현합니다.
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
  // TODO 1: const를 let으로 변경
  // - /clear 시 agent를 새로 할당해야 하므로 let 필요
  // - const는 재할당 불가
  //
  // 힌트:
  // let agent = new CodingAgent();
  const agent = new CodingAgent(); // ← 수정 필요

  console.log('Coding Agent가 시작되었습니다.');
  // TODO 2: 명령어 안내 메시지 추가
  // 힌트: console.log('명령어: /clear (새 대화 시작), exit (종료)');
  console.log('종료하려면 "exit"을 입력하세요.');
  console.log();

  while (true) {
    const input = await prompt();

    if (!input) continue;

    if (input === 'exit') {
      console.log('종료합니다.');
      rl.close();
      break;
    }

    // TODO 3: /clear 명령어 처리 추가
    // - input이 '/clear'인지 확인
    // - 새 CodingAgent 생성하여 agent에 할당
    // - "새로운 대화가 시작되었습니다." 출력
    // - continue로 루프 계속
    //
    // 힌트:
    // if (input === '/clear') {
    //   agent = new CodingAgent();
    //   console.log('새로운 대화가 시작되었습니다.');
    //   console.log();
    //   continue;
    // }

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
