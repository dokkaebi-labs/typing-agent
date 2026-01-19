import { tool } from 'ai';
import { z } from 'zod';
// TODO 1: fs/promises에서 readFile, stat을 import하세요
// 힌트: import { readFile, stat } from 'fs/promises';

// TODO 2: readFileTool을 정의하세요
// - description: '주어진 경로의 파일 내용을 읽어서 반환합니다'
// - inputSchema: path (z.string().describe('읽을 파일의 경로'))
// - execute: 파일 내용을 읽어서 반환
//
// export const readFileTool = tool({
//   description: '...',
//   inputSchema: z.object({
//     path: z.string().describe('읽을 파일의 경로'),
//   }),
//   execute: async ({ path }) => {
//     // TODO 3: 에러 처리 추가
//     const content = await readFile(path, 'utf-8');
//     return content;
//   },
// });

// TODO 3: try-catch로 에러 처리를 추가하세요
// 힌트:
// execute: async ({ path }) => {
//   try {
//     const fileStat = await stat(path);
//     if (fileStat.isDirectory()) {
//       return `오류: ${path}는 디렉토리입니다`;
//     }
//     const content = await readFile(path, 'utf-8');
//     return content;
//   } catch (error) {
//     if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
//       return `오류: 파일을 찾을 수 없습니다: ${path}`;
//     }
//     return `오류: ${error instanceof Error ? error.message : String(error)}`;
//   }
// }

// 임시 export (TODO 완료 후 삭제)
export const readFileTool = {} as any;
