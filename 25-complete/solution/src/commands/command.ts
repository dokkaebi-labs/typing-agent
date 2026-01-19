/**
 * 25강: 명령어 인터페이스 (완성 코드)
 */

export interface Command {
  name: string;
  aliases?: string[];
  description: string;
  usage?: string;
  execute(args: string[]): Promise<CommandResult>;
}

export type CommandResult =
  | { type: 'success'; message?: string }
  | { type: 'error'; message: string }
  | { type: 'exit' }
  | { type: 'clear' };

export class CommandRegistry {
  private commands: Command[] = [];

  register(command: Command): void {
    this.commands.push(command);
  }

  registerAll(...commands: Command[]): void {
    this.commands.push(...commands);
  }

  getAllCommands(): Command[] {
    return [...this.commands];
  }

  async execute(input: string): Promise<CommandResult | null> {
    const parts = input.slice(1).split(' ');
    const commandName = parts[0];
    const args = parts.slice(1);

    const command = this.commands.find(
      (cmd) => cmd.name === commandName || cmd.aliases?.includes(commandName)
    );

    if (!command) {
      return null;
    }

    return command.execute(args);
  }
}
