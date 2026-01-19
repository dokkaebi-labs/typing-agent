/**
 * 22강: AgentMemory - 프로젝트 컨텍스트 (스타터 코드)
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
  // TODO 9: 명령어 안내에 /memory 추가
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
      agent = new CodingAgent();
      console.log('새로운 대화가 시작되었습니다.');
      console.log();
      continue;
    }

    // TODO 10: /memory add 명령어 처리
    // input.startsWith('/memory add ')로 확인
    // content = input.replace('/memory add ', '').trim()
    // await agent.addMemory(content)
    //
    // 힌트:
    // if (input.startsWith('/memory add ')) {
    //   const content = input.replace('/memory add ', '').trim();
    //   await agent.addMemory(content);
    //   console.log(`메모리에 저장했습니다: ${content}`);
    //   console.log();
    //   continue;
    // }

    // TODO 11: /memory show 명령어 처리
    // input === '/memory show'로 확인
    // await agent.getMemory()로 메모리 가져오기
    //
    // 힌트:
    // if (input === '/memory show') {
    //   const memory = await agent.getMemory();
    //   if (memory) {
    //     console.log('=== Project Memory ===');
    //     console.log(memory);
    //     console.log('====================');
    //   } else {
    //     console.log('저장된 메모리가 없습니다.');
    //   }
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
