import { describe, it, expect } from 'vitest';
import { bashTool } from '../solution/src/tools/bashTool';

describe('bashTool', () => {
  describe('기본 명령 실행', () => {
    it('ls 명령을 실행한다', async () => {
      const result = await bashTool.execute!({ command: 'ls' }, {} as any);
      expect(result).toContain('출력:');
    });

    it('echo 명령을 실행한다', async () => {
      const result = await bashTool.execute!(
        { command: 'echo "Hello World"' },
        {} as any
      );
      expect(result).toContain('Hello World');
    });

    it('pwd 명령을 실행한다', async () => {
      const result = await bashTool.execute!({ command: 'pwd' }, {} as any);
      expect(result).toContain('출력:');
      expect(result).toContain('/');
    });
  });

  describe('위험한 명령어 차단', () => {
    it('rm -rf 명령을 차단한다', async () => {
      const result = await bashTool.execute!(
        { command: 'rm -rf /' },
        {} as any
      );
      expect(result).toContain('오류');
      expect(result).toContain('위험한 명령어');
    });

    it('sudo 명령을 차단한다', async () => {
      const result = await bashTool.execute!(
        { command: 'sudo apt-get update' },
        {} as any
      );
      expect(result).toContain('오류');
      expect(result).toContain('위험한 명령어');
    });

    it('chmod 777 명령을 차단한다', async () => {
      const result = await bashTool.execute!(
        { command: 'chmod 777 /etc/passwd' },
        {} as any
      );
      expect(result).toContain('오류');
      expect(result).toContain('위험한 명령어');
    });
  });

  describe('에러 처리', () => {
    it('존재하지 않는 명령어는 에러를 반환한다', async () => {
      const result = await bashTool.execute!(
        { command: 'thiscommanddoesnotexist12345' },
        {} as any
      );
      expect(result).toContain('명령 실패');
      expect(result).toContain('exit code');
    });

    it('실패한 명령어의 stderr를 포함한다', async () => {
      const result = await bashTool.execute!(
        { command: 'ls /nonexistent/path/12345' },
        {} as any
      );
      expect(result).toContain('명령 실패');
    });
  });

  describe('출력 처리', () => {
    it('빈 출력은 "(출력 없음)"으로 표시한다', async () => {
      const result = await bashTool.execute!({ command: 'true' }, {} as any);
      expect(result).toContain('(출력 없음)');
    });

    it('stdout과 stderr를 함께 반환한다', async () => {
      const result = await bashTool.execute!(
        { command: 'echo "stdout"; echo "stderr" >&2' },
        {} as any
      );
      expect(result).toContain('stdout');
      expect(result).toContain('stderr');
    });
  });
});
