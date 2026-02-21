import 'dotenv/config';
import * as readline from 'readline';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('Coding Agent에 오신 것을 환영합니다!');
  console.log('종료하려면 "exit"를 입력하세요.\n');

  while (true) {
    const userInput = await prompt('You: ');

    if (userInput.toLowerCase() === 'exit') {
      console.log('Bye!');
      rl.close();
      break;
    }

    if (!userInput.trim()) {
      continue;
    }

    const response = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      messages: [
        {
          role: 'user',
          content: userInput,
        },
      ],
    });

    console.log(`Claude: ${response.text}\n`);
  }
}

main();
