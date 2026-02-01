#!/usr/bin/env node
/**
 * 23강: CLI 진입점 (실습 코드)
 *
 * 모든 UI 컴포넌트와 명령어를 통합하는 진입점입니다.
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

import * as readline from 'readline';
// TODO 1: CodingAgent import
// import { CodingAgent } from './coding-agent';

import { CommandRegistry } from './commands/command';
import {
  HelpCommand,
  ExitCommand,
  ClearCommand,
  // TODO 2: MemoryCommand import
  // MemoryCommand,
} from './commands/commands';
import { printWelcome, printGoodbye } from './ui/banner';
import { userPrompt, assistantPrompt, divider, errorBox } from './ui/formatter';
import { Spinner } from './ui/spinner';
import { colors, error as errorColor } from './ui/colors';

async function main() {
  // TODO 3: CodingAgent 인스턴스 생성
  // let agent = new CodingAgent();

  // 명령어 레지스트리 설정
  const registry = new CommandRegistry();

  // 명령어 등록
  // TODO 4: MemoryCommand 등록
  // registry.registerAll(
  //   new ExitCommand(),
  //   new ClearCommand(),
  //   new MemoryCommand(agent.getAgentMemory())
  // );
  registry.registerAll(new ExitCommand(), new ClearCommand());
  registry.register(new HelpCommand(registry));

  // readline 인터페이스 생성
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // 웰컴 배너 출력
  printWelcome();

  // REPL 루프 구현
  const prompt = () => {
    rl.question(userPrompt(), async (input) => {
      input = input.trim();

      // 빈 입력 처리
      if (!input) {
        prompt();
        return;
      }

      // 슬래시 명령어 처리
      if (input.startsWith('/')) {
        const result = await registry.execute(input);

        if (result === null) {
          console.log(errorColor(`Unknown command. Type /help for commands.`));
          prompt();
          return;
        }

        switch (result.type) {
          case 'exit':
            printGoodbye();
            rl.close();
            return;

          case 'clear':
            // TODO 5: 새 Agent 생성 및 MemoryCommand 재등록
            // agent = new CodingAgent();
            // registry.registerAll(new MemoryCommand(agent.getAgentMemory()));
            prompt();
            return;

          case 'error':
            console.log(errorBox(result.message));
            prompt();
            return;

          case 'success':
            prompt();
            return;
        }
      }

      // 일반 대화 처리
      // TODO 6: Agent 호출로 변경 (시뮬레이션 제거)
      try {
        const spinner = new Spinner('Thinking');
        spinner.start();

        // 현재: 시뮬레이션
        // 변경: const response = await agent.chat(input);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = `Echo: ${input}`;

        spinner.stop();

        console.log(assistantPrompt());
        console.log();
        console.log(response);
        console.log();
        console.log(divider());
        console.log();
      } catch (err) {
        console.log(
          errorBox(`Error: ${err instanceof Error ? err.message : String(err)}`)
        );
      }

      prompt();
    });
  };

  prompt();
}

main().catch(console.error);
