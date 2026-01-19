import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { listFilesTool } from '../solution/src/tools/listFilesTool';
import * as fs from 'fs';
import * as path from 'path';

describe('listFilesTool', () => {
  const testDir = path.join(__dirname, 'fixtures');

  beforeEach(() => {
    // 테스트 디렉토리 구조 생성
    fs.mkdirSync(path.join(testDir, 'src'), { recursive: true });
    fs.mkdirSync(path.join(testDir, 'node_modules'), { recursive: true });
    fs.mkdirSync(path.join(testDir, '.git'), { recursive: true });

    fs.writeFileSync(path.join(testDir, 'README.md'), '# Test');
    fs.writeFileSync(path.join(testDir, 'src', 'index.ts'), 'export {}');
    fs.writeFileSync(path.join(testDir, 'src', 'utils.ts'), 'export {}');
    fs.writeFileSync(path.join(testDir, 'node_modules', 'package.json'), '{}');
    fs.writeFileSync(path.join(testDir, '.git', 'config'), '');
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('디렉토리 목록을 반환한다', async () => {
    const result = (await listFilesTool.execute!({ path: testDir }, {} as any)) as string;

    expect(result).toContain('README.md');
    expect(result).toContain('src/');
    expect(result).toContain('src/index.ts');
    expect(result).toContain('src/utils.ts');
  });

  it('node_modules와 .git 폴더를 제외한다', async () => {
    const result = (await listFilesTool.execute!({ path: testDir }, {} as any)) as string;

    expect(result).not.toContain('node_modules');
    expect(result).not.toContain('.git');
  });

  it('존재하지 않는 경로는 에러를 반환한다', async () => {
    const result = (await listFilesTool.execute!(
      { path: '/not/exist/path' },
      {} as any
    )) as string;

    expect(result).toContain('오류');
    expect(result).toContain('찾을 수 없습니다');
  });

  it('파일 경로를 디렉토리로 지정하면 에러를 반환한다', async () => {
    const result = (await listFilesTool.execute!(
      { path: path.join(testDir, 'README.md') },
      {} as any
    )) as string;

    expect(result).toContain('오류');
    expect(result).toContain('디렉토리가 아닙니다');
  });

  it('빈 디렉토리는 비어있다고 반환한다', async () => {
    const emptyDir = path.join(testDir, 'empty');
    fs.mkdirSync(emptyDir);

    const result = (await listFilesTool.execute!({ path: emptyDir }, {} as any)) as string;

    expect(result).toContain('비어있습니다');
  });

  it('폴더는 끝에 /가 붙는다', async () => {
    const result = (await listFilesTool.execute!({ path: testDir }, {} as any)) as string;

    expect(result).toContain('src/');
  });

  it('결과가 정렬되어 반환된다', async () => {
    const result = (await listFilesTool.execute!({ path: testDir }, {} as any)) as string;

    // README.md가 src/보다 먼저 와야 함 (알파벳 순)
    const readmeIndex = result.indexOf('README.md');
    const srcIndex = result.indexOf('src/');
    expect(readmeIndex).toBeLessThan(srcIndex);
  });
});
