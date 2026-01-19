#!/usr/bin/env node
/**
 * 25강: 완성! 나만의 Coding Agent (실습 코드)
 *
 * 이 파일은 최종 통합을 위한 진입점입니다.
 * 이전 강의에서 만든 모든 기능을 통합합니다.
 */

import * as readline from 'readline';
import 'dotenv/config';

// TODO 1: 이전 강의에서 만든 모듈들 import
// - CodingAgent 클래스 (16강)
// - CommandRegistry (23강)
// - Commands (23강)
// - UI 컴포넌트들 (23강)

// TODO 2: Agent 및 명령어 시스템 초기화

// TODO 3: readline 인터페이스 생성

// TODO 4: 웰컴 배너 출력

// TODO 5: REPL 루프 구현
// - /로 시작하는 입력은 명령어로 처리
// - 그 외는 Agent에 전달

async function main() {
  console.log('='.repeat(60));
  console.log('  CODING AGENT - 25강 실습');
  console.log('  이전 강의에서 만든 기능들을 통합해보세요!');
  console.log('='.repeat(60));
  console.log();
  console.log('실습 안내:');
  console.log('1. 16강의 CodingAgent 클래스를 가져오세요');
  console.log('2. 23강의 CLI 컴포넌트들을 가져오세요');
  console.log('3. 24강의 ToolLogger를 연결하세요');
  console.log();
  console.log('완성된 코드는 solution 폴더를 참고하세요.');
  console.log('npm run start:solution 으로 실행할 수 있습니다.');
  console.log();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = () => {
    rl.question('User > ', async (input) => {
      input = input.trim();

      if (!input) {
        prompt();
        return;
      }

      if (input === '/exit') {
        console.log('종료합니다.');
        rl.close();
        return;
      }

      // 임시 응답
      console.log();
      console.log('Assistant >');
      console.log(`[TODO] "${input}" 에 대한 처리를 구현하세요.`);
      console.log();

      prompt();
    });
  };

  prompt();
}

main().catch(console.error);
