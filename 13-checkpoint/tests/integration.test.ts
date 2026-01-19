import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileTool, listFilesTool, editFileTool } from '../solution/src/index';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 13강: 중간 점검 - 통합 테스트
 *
 * 3개 Tool이 각각 올바르게 동작하는지 확인합니다.
 */

describe('3개 Tool 통합 테스트', () => {
  const testDir = path.join(__dirname, 'fixtures');
  const testFile = path.join(testDir, 'test.txt');

  beforeEach(() => {
    // 테스트 디렉토리 구조 생성
    fs.mkdirSync(path.join(testDir, 'src'), { recursive: true });
    fs.writeFileSync(testFile, 'Hello World');
    fs.writeFileSync(path.join(testDir, 'src', 'index.ts'), 'export {}');
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  describe('readFileTool', () => {
    it('파일 내용을 읽는다', async () => {
      const result = await readFileTool.execute!({ path: testFile }, {} as any);
      expect(result).toBe('Hello World');
    });

    it('존재하지 않는 파일은 에러를 반환한다', async () => {
      const result = await readFileTool.execute!(
        { path: '/not/exist.txt' },
        {} as any
      );
      expect(result).toContain('오류');
    });
  });

  describe('listFilesTool', () => {
    it('디렉토리 목록을 반환한다', async () => {
      const result = await listFilesTool.execute!({ path: testDir }, {} as any);
      expect(result).toContain('test.txt');
      expect(result).toContain('src/');
    });

    it('존재하지 않는 경로는 에러를 반환한다', async () => {
      const result = await listFilesTool.execute!(
        { path: '/not/exist' },
        {} as any
      );
      expect(result).toContain('오류');
    });
  });

  describe('editFileTool', () => {
    it('파일 내용을 수정한다', async () => {
      const result = await editFileTool.execute!(
        { path: testFile, oldText: 'Hello', newText: '안녕' },
        {} as any
      );
      expect(result).toContain('성공');
      expect(fs.readFileSync(testFile, 'utf-8')).toBe('안녕 World');
    });

    it('새 파일을 생성한다', async () => {
      const newFile = path.join(testDir, 'new.txt');
      const result = await editFileTool.execute!(
        { path: newFile, oldText: '', newText: 'New Content' },
        {} as any
      );
      expect(result).toContain('성공');
      expect(fs.readFileSync(newFile, 'utf-8')).toBe('New Content');
    });
  });

  describe('Tool 조합 시나리오', () => {
    it('listFiles -> readFile 순서로 파일을 찾고 읽을 수 있다', async () => {
      // 1. 디렉토리 목록 조회
      const listResult = await listFilesTool.execute!(
        { path: testDir },
        {} as any
      );
      expect(listResult).toContain('test.txt');

      // 2. 파일 읽기
      const readResult = await readFileTool.execute!(
        { path: testFile },
        {} as any
      );
      expect(readResult).toBe('Hello World');
    });

    it('readFile -> editFile 순서로 파일을 읽고 수정할 수 있다', async () => {
      // 1. 파일 읽기
      const readResult = await readFileTool.execute!(
        { path: testFile },
        {} as any
      );
      expect(readResult).toBe('Hello World');

      // 2. 파일 수정
      const editResult = await editFileTool.execute!(
        { path: testFile, oldText: 'Hello World', newText: '안녕 세계' },
        {} as any
      );
      expect(editResult).toContain('성공');

      // 3. 수정 확인
      const verifyResult = await readFileTool.execute!(
        { path: testFile },
        {} as any
      );
      expect(verifyResult).toBe('안녕 세계');
    });

    it('listFiles -> readFile -> editFile 복합 작업이 가능하다', async () => {
      // 1. 디렉토리 탐색
      const listResult = await listFilesTool.execute!(
        { path: testDir },
        {} as any
      );
      expect(listResult).toContain('src/');
      expect(listResult).toContain('src/index.ts');

      // 2. 파일 읽기
      const readResult = await readFileTool.execute!(
        { path: path.join(testDir, 'src', 'index.ts') },
        {} as any
      );
      expect(readResult).toBe('export {}');

      // 3. 파일 수정 (주석 추가)
      const editResult = await editFileTool.execute!(
        {
          path: path.join(testDir, 'src', 'index.ts'),
          oldText: 'export {}',
          newText: '// Main entry point\nexport {}',
        },
        {} as any
      );
      expect(editResult).toContain('성공');

      // 4. 수정 확인
      const verifyResult = await readFileTool.execute!(
        { path: path.join(testDir, 'src', 'index.ts') },
        {} as any
      );
      expect(verifyResult).toBe('// Main entry point\nexport {}');
    });
  });
});
