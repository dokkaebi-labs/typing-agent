import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { editFileTool } from '../solution/src/tools/editFileTool';
import * as fs from 'fs';
import * as path from 'path';

describe('editFileTool', () => {
  const testDir = path.join(__dirname, 'fixtures');
  const testFile = path.join(testDir, 'test.txt');

  beforeEach(() => {
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  describe('생성 모드', () => {
    it('새 파일을 생성한다', async () => {
      const newFile = path.join(testDir, 'new.txt');

      const result = await editFileTool.execute!(
        { path: newFile, oldText: '', newText: 'Hello World' },
        {} as any
      );

      expect(result).toContain('성공');
      expect(result).toContain('새 파일을 생성');
      expect(fs.readFileSync(newFile, 'utf-8')).toBe('Hello World');
    });

    it('중첩된 경로의 파일도 생성한다', async () => {
      const nestedFile = path.join(testDir, 'a', 'b', 'c', 'new.txt');

      const result = await editFileTool.execute!(
        { path: nestedFile, oldText: '', newText: 'Nested Content' },
        {} as any
      );

      expect(result).toContain('성공');
      expect(fs.readFileSync(nestedFile, 'utf-8')).toBe('Nested Content');
    });
  });

  describe('추가 모드', () => {
    it('파일 끝에 내용을 추가한다', async () => {
      fs.writeFileSync(testFile, 'First Line');

      const result = await editFileTool.execute!(
        { path: testFile, oldText: '', newText: '\nSecond Line' },
        {} as any
      );

      expect(result).toContain('성공');
      expect(result).toContain('추가');
      expect(fs.readFileSync(testFile, 'utf-8')).toBe('First Line\nSecond Line');
    });
  });

  describe('교체 모드', () => {
    it('텍스트를 교체한다', async () => {
      fs.writeFileSync(testFile, 'Hello World');

      const result = await editFileTool.execute!(
        { path: testFile, oldText: 'Hello', newText: '안녕' },
        {} as any
      );

      expect(result).toContain('성공');
      expect(result).toContain('교체');
      expect(fs.readFileSync(testFile, 'utf-8')).toBe('안녕 World');
    });

    it('oldText가 없으면 에러를 반환한다', async () => {
      fs.writeFileSync(testFile, 'Hello World');

      const result = await editFileTool.execute!(
        { path: testFile, oldText: 'Goodbye', newText: '안녕' },
        {} as any
      );

      expect(result).toContain('오류');
      expect(result).toContain('찾을 수 없습니다');
    });

    it('oldText가 여러 번 등장하면 거부한다', async () => {
      fs.writeFileSync(testFile, 'Hello Hello Hello');

      const result = await editFileTool.execute!(
        { path: testFile, oldText: 'Hello', newText: '안녕' },
        {} as any
      );

      expect(result).toContain('확인 필요');
      expect(result).toContain('3번');
      // 파일이 수정되지 않아야 함
      expect(fs.readFileSync(testFile, 'utf-8')).toBe('Hello Hello Hello');
    });
  });

  describe('에러 처리', () => {
    it('oldText와 newText가 같으면 에러를 반환한다', async () => {
      const result = await editFileTool.execute!(
        { path: testFile, oldText: 'same', newText: 'same' },
        {} as any
      );

      expect(result).toContain('오류');
      expect(result).toContain('동일');
    });

    it('존재하지 않는 파일에 교체 모드를 사용하면 에러를 반환한다', async () => {
      const result = await editFileTool.execute!(
        { path: '/not/exist.txt', oldText: 'something', newText: 'other' },
        {} as any
      );

      expect(result).toContain('오류');
      expect(result).toContain('찾을 수 없습니다');
    });
  });
});
