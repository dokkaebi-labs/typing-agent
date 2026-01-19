#!/usr/bin/env node
/**
 * 25강: CLI 진입점 (완성 코드)
 *
 * 모든 기능이 통합된 Coding Agent CLI입니다.
 */

import * as readline from 'readline';
import { CodingAgent } from './coding-agent';
import { CommandRegistry } from './commands/command';
import {
  HelpCommand,
  ExitCommand,
  ClearCommand,
  MemoryCommand,
} from './commands/commands';
import { printWelcome, printGoodbye } from './ui/banner';
import {
  userPrompt,
  assistantPrompt,
  divider,
  errorBox,
} from './ui/formatter';
import { colors, error as errorColor } from './ui/colors';
import 'dotenv/config';

async function main() {
  // Agent 생성
  let agent = new CodingAgent();

  // 명령어 레지스트리 설정
  const registry = new CommandRegistry();
  registry.registerAll(
    new ExitCommand(),
    new ClearCommand(),
    new MemoryCommand(agent.getAgentMemory())
  );
  registry.register(new HelpCommand(registry));

  // readline 설정
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // 웰컴 배너 출력
  printWelcome();

  const prompt = () => {
    rl.question(userPrompt(), async (input) => {
      input = input.trim();

      if (!input) {
        prompt();
        return;
      }

      // 슬래시 명령어 처리
      if (input.startsWith('/')) {
        const result = await registry.execute(input);

        if (result === null) {
          console.log(
            errorColor(`Unknown command. Type /help for available commands.`)
          );
          prompt();
          return;
        }

        switch (result.type) {
          case 'exit':
            printGoodbye();
            rl.close();
            return;

          case 'clear':
            // 새 Agent 생성
            agent = new CodingAgent();
            // MemoryCommand도 새 Agent의 메모리를 사용하도록 다시 등록
            registry.registerAll(new MemoryCommand(agent.getAgentMemory()));
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
      try {
        console.log();
        console.log(`${colors.muted}Processing...${colors.reset}`);

        const response = await agent.chat(input);

        console.log();
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
