import { z } from 'zod';
import { tool } from 'ai';

// 파일 읽기 Tool
export const readFileTool = tool({
  description: '지정된 경로의 파일 내용을 읽어서 반환합니다',
  inputSchema: z.object({
    path: z.string().describe('읽을 파일 경로'),
  }),
  execute: async ({ path }) => {
    // 실행 로직 (다음 강의에서 실제 구현)
    return `파일 내용: ${path}`;
  },
});

// 파일 수정 Tool (여러 파라미터)
export const editFileTool = tool({
  description: '파일의 특정 부분을 수정합니다',
  inputSchema: z.object({
    path: z.string().describe('수정할 파일 경로'),
    oldText: z.string().describe('찾을 텍스트'),
    newText: z.string().describe('바꿀 텍스트'),
  }),
  execute: async ({ path, oldText, newText }) => {
    // 실행 로직 (다음 강의에서 실제 구현)
    return { success: true };
  },
});

// 파일 목록 Tool (선택적 파라미터)
export const listFilesTool = tool({
  description: '폴더의 파일 목록을 반환합니다',
  inputSchema: z.object({
    path: z.string().describe('폴더 경로'),
    recursive: z.boolean().optional().describe('하위 폴더 포함 여부'),
  }),
  execute: async ({ path, recursive }) => {
    // 실행 로직 (다음 강의에서 실제 구현)
    return ['file1.ts', 'file2.ts'];
  },
});
