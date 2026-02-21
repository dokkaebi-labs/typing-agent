import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { codeSearchTool } from '../solution/src/tools/codeSearchTool';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

/**
 * codeSearchTool 테스트
 *
 * 사전 요구사항: ripgrep 설치 필요
 * - macOS: brew install ripgrep
 * - Windows: choco install ripgrep
 */

// ripgrep 설치 여부 확인
function isRipgrepInstalled(): boolean {
  try {
    execSync('rg --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const hasRipgrep = isRipgrepInstalled();

describe.skipIf(!hasRipgrep)('codeSearchTool', () => {
  const testDir = path.join(__dirname, 'fixtures');

  beforeEach(() => {
    // 테스트 파일 생성
    fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(
      path.join(testDir, 'test.ts'),
      `// TODO: implement this
export async function hello() {
  return "Hello World";
}

// TODO: add tests
export const greeting = "Hello";`
    );
    fs.writeFileSync(
      path.join(testDir, 'test.js'),
      `// JavaScript file
function goodbye() {
  return "Goodbye";
}`
    );
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  describe('기본 검색', () => {
    it('패턴을 검색한다', async () => {
      const result = await codeSearchTool.execute!(
        { pattern: 'TODO', path: testDir, caseSensitive: false },
        {} as any
      );
      expect(result).toContain('TODO');
      expect(result).toContain('결과 발견');
    });

    it('검색 결과 없으면 알려준다', async () => {
      const result = await codeSearchTool.execute!(
        { pattern: 'nonexistent12345', path: testDir, caseSensitive: false },
        {} as any
      );
      expect(result).toContain('검색 결과 없음');
    });
  });

  describe('파일 타입 필터', () => {
    it('TypeScript 파일만 검색한다', async () => {
      const result = await codeSearchTool.execute!(
        { pattern: 'function', path: testDir, fileType: 'ts', caseSensitive: false },
        {} as any
      );
      expect(result).toContain('async function');
      expect(result).not.toContain('JavaScript');
    });

    it('JavaScript 파일만 검색한다', async () => {
      const result = await codeSearchTool.execute!(
        { pattern: 'function', path: testDir, fileType: 'js', caseSensitive: false },
        {} as any
      );
      expect(result).toContain('goodbye');
      expect(result).not.toContain('async');
    });
  });

  describe('대소문자 구분', () => {
    it('기본값은 대소문자 무시', async () => {
      const result = await codeSearchTool.execute!(
        { pattern: 'hello', path: testDir, caseSensitive: false },
        {} as any
      );
      expect(result).toContain('Hello');
    });

    it('caseSensitive=true면 대소문자 구분', async () => {
      const result = await codeSearchTool.execute!(
        { pattern: 'HELLO', path: testDir, caseSensitive: true },
        {} as any
      );
      // "HELLO"는 파일에 없고 "Hello"만 있음 (함수명 hello와도 다름)
      expect(result).toContain('검색 결과 없음');
    });
  });

  describe('정규식 검색', () => {
    it('정규식 패턴을 지원한다', async () => {
      const result = await codeSearchTool.execute!(
        { pattern: 'export.*function', path: testDir, caseSensitive: false },
        {} as any
      );
      expect(result).toContain('export async function');
    });
  });

  describe('결과 포맷', () => {
    it('파일명과 라인 번호를 포함한다', async () => {
      const result = await codeSearchTool.execute!(
        { pattern: 'TODO', path: testDir, caseSensitive: false },
        {} as any
      );
      // ripgrep 형식: 파일명:라인번호:내용
      expect(result).toMatch(/test\.ts:\d+:/);
    });

    it('결과 개수를 표시한다', async () => {
      const result = await codeSearchTool.execute!(
        { pattern: 'TODO', path: testDir, caseSensitive: false },
        {} as any
      );
      expect(result).toContain('개 결과 발견');
    });
  });
});
