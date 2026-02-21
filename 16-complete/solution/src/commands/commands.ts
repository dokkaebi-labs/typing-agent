/**
 * 25강: 명령어 구현체 (완성 코드)
 */

import { Command, CommandResult, CommandRegistry } from './command';
import { colors, success, warning } from '../ui/colors';

export class HelpCommand implements Command {
  name = 'help';
  aliases = ['h', '?'];
  description = 'Show available commands';

  constructor(private registry: CommandRegistry) {}

  async execute(): Promise<CommandResult> {
    console.log();
    console.log(
      `${colors.bold}${colors.brightCyan}Available Commands:${colors.reset}`
    );
    console.log();

    for (const cmd of this.registry
      .getAllCommands()
      .sort((a, b) => a.name.localeCompare(b.name))) {
      const aliasText = cmd.aliases?.length
        ? ` ${colors.muted}(${cmd.aliases.map((a) => '/' + a).join(', ')})${colors.reset}`
        : '';
      console.log(
        `  ${colors.brightCyan}/${cmd.name}${colors.reset}${aliasText}`
      );
      console.log(`    ${colors.muted}${cmd.description}${colors.reset}`);
    }
    console.log();

    return { type: 'success' };
  }
}

export class ExitCommand implements Command {
  name = 'exit';
  aliases = ['quit', 'q'];
  description = 'Exit the application';

  async execute(): Promise<CommandResult> {
    return { type: 'exit' };
  }
}

export class ClearCommand implements Command {
  name = 'clear';
  aliases = ['reset'];
  description = 'Clear session and start fresh';

  async execute(): Promise<CommandResult> {
    console.log(success('Session cleared. Starting fresh!'));
    return { type: 'clear' };
  }
}

export interface AgentMemoryStorage {
  addMemory(content: string): Promise<void>;
  getMemory(): Promise<string | null>;
}

export class MemoryCommand implements Command {
  name = 'memory';
  aliases = ['mem'];
  description = 'Manage project memory';
  usage = '/memory add <content> | /memory show';

  constructor(private memory: AgentMemoryStorage) {}

  async execute(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      console.log(warning(`Usage: ${this.usage}`));
      return { type: 'success' };
    }

    const subcommand = args[0];

    if (subcommand === 'add') {
      const content = args.slice(1).join(' ');
      if (!content) {
        console.log(warning('Please provide content to remember'));
        return { type: 'success' };
      }
      await this.memory.addMemory(content);
      console.log(success(`Memory saved: ${content}`));
      return { type: 'success' };
    }

    if (subcommand === 'show') {
      const memory = await this.memory.getMemory();
      if (memory) {
        console.log(`${colors.bold}=== Project Memory ===${colors.reset}`);
        console.log(memory);
        console.log(`${colors.bold}======================${colors.reset}`);
      } else {
        console.log(warning('No memory saved yet'));
      }
      return { type: 'success' };
    }

    console.log(warning(`Unknown subcommand: ${subcommand}`));
    return { type: 'success' };
  }
}
