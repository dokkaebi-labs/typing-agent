// TODO 1: 필요한 모듈들을 import하세요
// 힌트:
// - dotenv/config (환경변수 로드)
// - readline (터미널 입력)
// - generateText from 'ai'
// - anthropic from '@ai-sdk/anthropic'

// TODO 2: readline 인터페이스를 생성하세요
// 힌트: readline.createInterface({ input: process.stdin, output: process.stdout })

// TODO 3: Promise 기반 prompt 함수를 구현하세요
// 힌트: rl.question()을 Promise로 감싸세요
// function prompt(question: string): Promise<string> { ... }

async function main() {
  console.log('Coding Agent에 오신 것을 환영합니다!');
  console.log('종료하려면 "exit"를 입력하세요.\n');

  while (true) {
    // TODO 4: prompt 함수로 사용자 입력을 받으세요
    const userInput = ''; // await prompt('You: ')로 변경하세요

    if (userInput.toLowerCase() === 'exit') {
      console.log('Bye!');
      // TODO 5: rl.close() 호출
      break;
    }

    if (!userInput.trim()) {
      continue;
    }

    // TODO 6: generateText를 호출하세요
    // 힌트:
    // const response = await generateText({
    //   model: anthropic('claude-sonnet-4-20250514'),
    //   messages: [
    //     {
    //       role: 'user',
    //       content: userInput,
    //     },
    //   ],
    // });

    // TODO 7: 응답을 출력하세요
    // console.log(`Claude: ${response.text}\n`);
  }
}

main();
