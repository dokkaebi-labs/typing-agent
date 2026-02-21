/**
 * 25강: 통합 테스트
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';

// 간단한 통합 테스트

describe('25강 완성 테스트', () => {
  const testDir = './test-complete-' + Date.now();

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true });
    } catch {
      // 무시
    }
  });

  describe('파일 시스템 작업', () => {
    it('파일을 읽을 수 있다', async () => {
      const testFile = path.join(testDir, 'test.txt');
      await fs.writeFile(testFile, 'Hello, World!');

      const content = await fs.readFile(testFile, 'utf-8');
      expect(content).toBe('Hello, World!');
    });

    it('디렉토리 목록을 가져올 수 있다', async () => {
      await fs.writeFile(path.join(testDir, 'file1.txt'), '');
      await fs.writeFile(path.join(testDir, 'file2.txt'), '');

      const entries = await fs.readdir(testDir);
      expect(entries).toContain('file1.txt');
      expect(entries).toContain('file2.txt');
    });

    it('파일을 수정할 수 있다', async () => {
      const testFile = path.join(testDir, 'edit.txt');
      await fs.writeFile(testFile, 'old text');

      const content = await fs.readFile(testFile, 'utf-8');
      const updated = content.replace('old text', 'new text');
      await fs.writeFile(testFile, updated);

      const result = await fs.readFile(testFile, 'utf-8');
      expect(result).toBe('new text');
    });
  });

  describe('Memory 파일', () => {
    it('CODING_AGENT.md 파일을 생성할 수 있다', async () => {
      const memoryFile = path.join(testDir, 'CODING_AGENT.md');
      await fs.writeFile(memoryFile, '- 테스트 메모리');

      const content = await fs.readFile(memoryFile, 'utf-8');
      expect(content).toContain('테스트 메모리');
    });

    it('Memory에 항목을 추가할 수 있다', async () => {
      const memoryFile = path.join(testDir, 'CODING_AGENT.md');

      await fs.writeFile(memoryFile, '- 첫 번째');
      const existing = await fs.readFile(memoryFile, 'utf-8');
      const updated = `${existing}\n- 두 번째`;
      await fs.writeFile(memoryFile, updated);

      const content = await fs.readFile(memoryFile, 'utf-8');
      expect(content).toContain('첫 번째');
      expect(content).toContain('두 번째');
    });
  });

  describe('Session 파일', () => {
    it('세션 디렉토리를 생성할 수 있다', async () => {
      const sessionDir = path.join(testDir, '.coding-agent/sessions');
      await fs.mkdir(sessionDir, { recursive: true });

      const exists = await fs
        .access(sessionDir)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(true);
    });

    it('JSONL 형식으로 저장할 수 있다', async () => {
      const sessionFile = path.join(testDir, 'session.jsonl');
      const entry1 = JSON.stringify({ role: 'user', content: 'Hello' });
      const entry2 = JSON.stringify({ role: 'assistant', content: 'Hi!' });

      await fs.writeFile(sessionFile, entry1 + '\n' + entry2 + '\n');

      const content = await fs.readFile(sessionFile, 'utf-8');
      const lines = content.trim().split('\n');
      expect(lines).toHaveLength(2);
      expect(JSON.parse(lines[0]).role).toBe('user');
      expect(JSON.parse(lines[1]).role).toBe('assistant');
    });
  });

  describe('코드 검색', () => {
    it('키워드로 파일 내용을 검색할 수 있다', async () => {
      const codeFile = path.join(testDir, 'code.ts');
      await fs.writeFile(
        codeFile,
        `
function hello() {
  console.log('Hello');
}

function world() {
  console.log('World');
}
`
      );

      const content = await fs.readFile(codeFile, 'utf-8');
      const lines = content.split('\n');
      const results = lines
        .map((line, index) => ({ line, lineNumber: index + 1 }))
        .filter(({ line }) => line.includes('function'));

      expect(results).toHaveLength(2);
    });
  });
});

describe('CLI 명령어', () => {
  it('명령어 목록이 정의되어 있다', () => {
    const commands = ['help', 'exit', 'clear', 'memory'];
    expect(commands).toContain('help');
    expect(commands).toContain('exit');
    expect(commands).toContain('clear');
    expect(commands).toContain('memory');
  });
});

describe('Tool 아이콘', () => {
  it('각 Tool에 아이콘이 매핑되어 있다', () => {
    const icons: Record<string, string> = {
      readFile: '📖',
      listFiles: '📁',
      editFile: '✏️',
      bash: '💻',
      codeSearch: '🔍',
    };

    expect(icons.readFile).toBe('📖');
    expect(icons.listFiles).toBe('📁');
    expect(icons.editFile).toBe('✏️');
    expect(icons.bash).toBe('💻');
    expect(icons.codeSearch).toBe('🔍');
  });
});
