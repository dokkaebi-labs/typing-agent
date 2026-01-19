/**
 * editFileTool - 파일 수정 (12강에서 만든 Tool 재사용)
 */

import { tool } from 'ai';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

export const editFileTool = tool({
  description: `텍스트 교체를 통해 파일을 생성하거나 수정합니다.
- 파일이 없고 oldText가 비어있으면: newText로 새 파일 생성
- 파일이 있고 oldText가 비어있으면: 파일 끝에 newText 추가
- oldText가 비어있지 않으면: oldText를 newText로 교체 (정확히 1회만 매칭되어야 함)`,
  inputSchema: z.object({
    path: z.string().describe('수정하거나 생성할 파일 경로'),
    oldText: z.string().describe('찾아서 교체할 문자열 (빈 문자열 = 생성/추가 모드)'),
    newText: z.string().describe('교체할 새 문자열'),
  }),
  execute: async ({ path: filePath, oldText, newText }) => {
    if (oldText === newText) {
      return '오류: oldText와 newText가 동일합니다.';
    }

    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      if (oldText === '') {
        try {
          const dir = path.dirname(absolutePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(absolutePath, newText, 'utf-8');
          return `성공: '${filePath}'에 새 파일을 생성했습니다.`;
        } catch (e) {
          return `오류: 파일 생성 실패 - ${e instanceof Error ? e.message : e}`;
        }
      } else {
        return '오류: 수정할 파일을 찾을 수 없습니다.';
      }
    }

    let content: string;
    try {
      content = fs.readFileSync(absolutePath, 'utf-8');
    } catch (e) {
      return `오류: 파일 읽기 실패 - ${e instanceof Error ? e.message : e}`;
    }

    if (oldText === '') {
      try {
        fs.appendFileSync(absolutePath, newText, 'utf-8');
        return `성공: '${filePath}' 파일 끝에 내용을 추가했습니다.`;
      } catch (e) {
        return `오류: 내용 추가 실패 - ${e instanceof Error ? e.message : e}`;
      }
    }

    const occurrences = content.split(oldText).length - 1;

    if (occurrences === 0) {
      return '오류: 수정할 문자열을 찾을 수 없습니다.';
    }

    if (occurrences > 1) {
      return `확인 필요: oldText가 ${occurrences}번 발견되었습니다. 더 구체적인 문자열을 지정해주세요.`;
    }

    const newContent = content.replace(oldText, newText);

    try {
      fs.writeFileSync(absolutePath, newContent, 'utf-8');
      return `성공: '${filePath}' 파일의 내용을 교체했습니다.`;
    } catch (e) {
      return `오류: 파일 쓰기 실패 - ${e instanceof Error ? e.message : e}`;
    }
  },
});
