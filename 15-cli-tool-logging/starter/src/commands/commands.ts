/**
 * 23강: 명령어 구현체 (실습 코드)
 *
 * /help, /exit, /clear, /memory 명령어를 구현합니다.
 */

import { Command, CommandResult, CommandRegistry } from './command';
import { colors, success, warning } from '../ui/colors';

// TODO 1: HelpCommand 구현
// /help 또는 /h, /? 로 실행
// 등록된 모든 명령어 목록을 출력합니다.
export class HelpCommand implements Command {
  name = 'help';
  aliases = ['h', '?'];
  description = 'Show available commands';

  constructor(private registry: CommandRegistry) {}

  async execute(_args: string[]): Promise<CommandResult> {
    // 여기에 코드를 작성하세요
    // 1. 'Available Commands:' 헤더 출력
    // 2. 각 명령어의 name, aliases, description 출력
    // 3. { type: 'success' } 반환

    console.log('\nAvailable Commands:');
    console.log('  /help - Show this message');
    console.log('  /exit - Exit the application');
    console.log('  /clear - Clear session');

    return { type: 'success' };
  }
}

// TODO 2: ExitCommand 구현
// /exit 또는 /quit, /q 로 실행
// 프로그램을 종료합니다.
export class ExitCommand implements Command {
  name = 'exit';
  aliases = ['quit', 'q'];
  description = 'Exit the application';

  async execute(_args: string[]): Promise<CommandResult> {
    // 여기에 코드를 작성하세요
    return { type: 'exit' };
  }
}

// TODO 3: ClearCommand 구현
// /clear 또는 /reset 으로 실행
// 세션을 초기화합니다.
export class ClearCommand implements Command {
  name = 'clear';
  aliases = ['reset'];
  description = 'Clear session and start fresh';

  async execute(_args: string[]): Promise<CommandResult> {
    // 여기에 코드를 작성하세요
    // 1. 성공 메시지 출력
    // 2. { type: 'clear' } 반환

    console.log('Session cleared.');
    return { type: 'clear' };
  }
}

// TODO 4: MemoryCommand 구현 (선택)
// /memory add <content> - 메모리 추가
// /memory show - 메모리 조회
// AgentMemory 클래스를 주입받아 사용합니다.

// 참고: AgentMemory 인터페이스
// interface AgentMemoryStorage {
//   addMemory(content: string): Promise<void>;
//   getMemory(): Promise<string | null>;
// }

// export class MemoryCommand implements Command {
//   name = 'memory';
//   aliases = ['mem'];
//   description = 'Manage project memory';
//   usage = '/memory add <content> | /memory show';
//
//   constructor(private memory: AgentMemoryStorage) {}
//
//   async execute(args: string[]): Promise<CommandResult> {
//     // 여기에 코드를 작성하세요
//   }
// }
