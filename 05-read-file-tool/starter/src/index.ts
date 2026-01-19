import 'dotenv/config';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { readFileTool } from './tools/readFile';

async function main() {
  // TODO 4: generateText에 tools 객체로 연결하세요
  // 힌트:
  // const response = await generateText({
  //   model: anthropic('claude-sonnet-4-20250514'),
  //   messages: [
  //     { role: 'user', content: 'package.json 파일 읽어줘' }
  //   ],
  //   tools: {
  //     readFile: readFileTool,
  //   },
  // });

  console.log('TODO 4를 완성하세요');

  // 응답 확인
  // console.log('toolCalls:', response.toolCalls);
  // console.log('text:', response.text);
}

main();
