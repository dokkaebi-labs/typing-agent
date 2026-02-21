# Typing Agent Lab

TypeScript + Vercel AI SDK로 나만의 Coding Agent를 만드는 실습 코드입니다.

> 이 실습의 상세한 설명은 [강의](강의링크)에서 확인하세요.

## 사전 요구사항

- Node.js 18+
- Anthropic API Key ([console.anthropic.com](https://console.anthropic.com)에서 발급)

## 실행 방법

```bash
# 1. 의존성 설치 (루트에서 한 번만)
npm install

# 2. 환경 변수 설정 (루트에서)
cp .env.example .env
# .env 파일에 ANTHROPIC_API_KEY 설정

# 3. 실행 (루트에서)
npx tsx 03-read-file-tool/starter/src/index.ts   # starter 코드 실행
npx tsx 03-read-file-tool/solution/src/index.ts  # solution 코드 실행

# 4. 테스트 (루트에서)
npm test                          # 전체 테스트
npm test -- 03-read-file-tool     # 특정 강의 테스트
```

## 폴더 구조

```
XX-폴더명/
├── starter/    # TODO 주석이 있는 시작 코드
├── solution/   # 완성된 정답 코드
└── tests/      # 테스트 코드
```

## 강의 목록

| 강의 | 폴더 | 설명 |
|-----|------|------|
| 2강 | 02-setup | 환경 설정 + 첫 번째 Chat |
| 3강 | 03-read-file-tool | Tool 이해 + readFileTool |
| 4강 | 04-tool-execution | JSON 파싱과 Tool 라우팅 |
| 5강 | 05-tool-result | Tool 결과의 흐름 |
| 6강 | 06-agent-loop | Agent Loop 구현 |
| 7강 | 07-vercel-sdk | Vercel AI SDK 고수준 전환 |
| 8강 | 08-file-tools | listFiles + editFile |
| 9강 | 09-system-tools | bash + codeSearch |
| 10강 | 10-coding-agent-class | CodingAgent 클래스 |
| 11강 | 11-session-management | Stateless 문제 + Session |
| 12강 | 12-session-clear | Session 초기화 |
| 13강 | 13-context-optimization | Sliding Window + Compression |
| 14강 | 14-agent-memory | AgentMemory |
| 15강 | 15-cli-tool-logging | CLI + Tool 로깅 |
| 16강 | 16-complete | 완성 |
