/**
 * 18강: Session으로 대화 이력 관리하기 (완성 코드)
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
  // 고정된 세션 ID 사용 (재시작해도 같은 세션 유지)
  const agent = new CodingAgent('demo-session');

  console.log('Coding Agent가 시작되었습니다. (Session 기능 활성화)');
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

export { CodingAgent } from './coding-agent';
export { ConversationHistory } from './conversation-history';
