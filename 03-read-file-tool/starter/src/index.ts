// TODO 1: zod와 tool을 import하세요
// 힌트:
// import { z } from 'zod';
// import { tool } from 'ai';

// TODO 2: 파일 읽기 readFileTool을 정의하세요
// - description: '지정된 경로의 파일 내용을 읽어서 반환합니다'
// - inputSchema: z.object({ path: z.string() })
// - execute: `파일 내용: ${path}` 반환
//
// export const readFileTool = tool({
//   description: '...',
//   inputSchema: z.object({
//     path: z.string().describe('읽을 파일 경로'),
//   }),
//   execute: async ({ path }) => {
//     return `...`;
//   },
// });

// TODO 3: 여러 파라미터를 가진 editFileTool을 정의하세요
// - description: '파일의 특정 부분을 수정합니다'
// - inputSchema:
//   - path: z.string().describe('수정할 파일 경로')
//   - oldText: z.string().describe('찾을 텍스트')
//   - newText: z.string().describe('바꿀 텍스트')
// - execute: { success: true } 반환
//
// export const editFileTool = tool({
//   description: '...',
//   inputSchema: z.object({ ... }),
//   execute: async ({ path, oldText, newText }) => {
//     return { success: true };
//   },
// });

// TODO 4: 선택적 파라미터를 가진 listFilesTool을 정의하세요
// - description: '폴더의 파일 목록을 반환합니다'
// - inputSchema:
//   - path: z.string().describe('폴더 경로')
//   - recursive: z.boolean().optional().describe('하위 폴더 포함 여부')
// - execute: ['file1.ts', 'file2.ts'] 반환
//
// export const listFilesTool = tool({
//   description: '...',
//   inputSchema: z.object({
//     path: z.string().describe('...'),
//     recursive: z.boolean().optional().describe('...'),
//   }),
//   execute: async ({ path, recursive }) => {
//     return ['file1.ts', 'file2.ts'];
//   },
// });

// 테스트용 export (TODO 완료 후 주석 해제)
// export { readFileTool, editFileTool, listFilesTool };
