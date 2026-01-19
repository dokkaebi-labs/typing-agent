/**
 * 23강: CLI 테스트
 */

import { describe, it, expect, vi } from 'vitest';
import { CommandRegistry } from '../solution/src/commands/command';
import {
  HelpCommand,
  ExitCommand,
  ClearCommand,
} from '../solution/src/commands/commands';
import { colors, success, error, warning } from '../solution/src/ui/colors';
import { Spinner } from '../solution/src/ui/spinner';

describe('colors', () => {
  it('ANSI 코드가 정의되어 있다', () => {
    expect(colors.reset).toBe('\x1b[0m');
    expect(colors.bold).toBe('\x1b[1m');
    expect(colors.brightCyan).toBe('\x1b[96m');
    expect(colors.brightRed).toBe('\x1b[91m');
    expect(colors.brightGreen).toBe('\x1b[92m');
  });

  it('success 함수가 초록색과 체크 아이콘을 추가한다', () => {
    const result = success('완료!');
    expect(result).toContain('✓');
    expect(result).toContain('완료!');
    expect(result).toContain(colors.success);
    expect(result).toContain(colors.reset);
  });

  it('error 함수가 빨간색과 X 아이콘을 추가한다', () => {
    const result = error('실패!');
    expect(result).toContain('✗');
    expect(result).toContain('실패!');
    expect(result).toContain(colors.error);
  });

  it('warning 함수가 노란색과 경고 아이콘을 추가한다', () => {
    const result = warning('주의!');
    expect(result).toContain('⚠');
    expect(result).toContain('주의!');
    expect(result).toContain(colors.warning);
  });
});

describe('CommandRegistry', () => {
  it('명령어를 등록할 수 있다', () => {
    const registry = new CommandRegistry();
    registry.register(new ExitCommand());

    expect(registry.getAllCommands()).toHaveLength(1);
  });

  it('여러 명령어를 한번에 등록할 수 있다', () => {
    const registry = new CommandRegistry();
    registry.registerAll(new ExitCommand(), new ClearCommand());

    expect(registry.getAllCommands()).toHaveLength(2);
  });

  it('명령어를 이름으로 실행할 수 있다', async () => {
    const registry = new CommandRegistry();
    registry.register(new ExitCommand());

    const result = await registry.execute('/exit');
    expect(result).toEqual({ type: 'exit' });
  });

  it('별칭으로도 실행할 수 있다', async () => {
    const registry = new CommandRegistry();
    registry.register(new ExitCommand());

    const result = await registry.execute('/q');
    expect(result).toEqual({ type: 'exit' });
  });

  it('알 수 없는 명령어는 null을 반환한다', async () => {
    const registry = new CommandRegistry();
    registry.register(new ExitCommand());

    const result = await registry.execute('/unknown');
    expect(result).toBeNull();
  });
});

describe('Commands', () => {
  it('ExitCommand가 exit 타입을 반환한다', async () => {
    const cmd = new ExitCommand();
    const result = await cmd.execute([]);
    expect(result).toEqual({ type: 'exit' });
  });

  it('ClearCommand가 clear 타입을 반환한다', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const cmd = new ClearCommand();
    const result = await cmd.execute([]);
    expect(result).toEqual({ type: 'clear' });
    consoleSpy.mockRestore();
  });

  it('HelpCommand가 success 타입을 반환한다', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const registry = new CommandRegistry();
    const cmd = new HelpCommand(registry);
    const result = await cmd.execute([]);
    expect(result).toEqual({ type: 'success' });
    consoleSpy.mockRestore();
  });
});

describe('Spinner', () => {
  it('인스턴스를 생성할 수 있다', () => {
    const spinner = new Spinner('Loading');
    expect(spinner).toBeInstanceOf(Spinner);
  });

  it('메시지를 업데이트할 수 있다', () => {
    const spinner = new Spinner('Loading');
    spinner.updateMessage('Processing');
    // 내부 상태 확인은 어렵지만 에러 없이 실행되면 성공
    expect(true).toBe(true);
  });

  it('start와 stop이 에러 없이 동작한다', () => {
    const spinner = new Spinner('Test');
    spinner.start();
    spinner.stop();
    // 에러 없이 실행되면 성공
    expect(true).toBe(true);
  });
});
