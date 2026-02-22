import 'dotenv/config';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { readFileTool } from './tools/readFile';

async function main() {
  const response = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages: [{ role: 'user', content: 'package.json 파일 읽어줘' }],
    tools: {
      readFile: readFileTool,
    },
    toolChoice: "required"
  });

  console.log('toolCalls:', JSON.stringify(response.toolCalls, null, 2));
  console.log('text:', response.text);
}

main();
