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
npx tsx 05-read-file-tool/starter/src/index.ts   # starter 코드 실행
npx tsx 05-read-file-tool/solution/src/index.ts  # solution 코드 실행

# 4. 테스트 (루트에서)
npm test                          # 전체 테스트
npm test -- 05-read-file-tool     # 특정 강의 테스트
```

## 폴더 구조

```
XX-폴더명/
├── starter/    # TODO 주석이 있는 시작 코드
├── solution/   # 완성된 정답 코드
└── tests/      # 테스트 코드
```

## 강의 목록

| 강의 | 폴더 |
|-----|------|
| 2강 | 02-setup |
| 3강 | 03-first-chat |
| 4강 | 04-tool-definition |
| 5강 | 05-read-file-tool |
| 6강 | 06-tool-execution |
| 7강 | 07-tool-result |
| 8강 | 08-agent-loop-intro |
| 9강 | 09-agent-loop-impl |
| 10강 | 10-vercel-sdk-high-level |
| 11강 | 11-list-files-tool |
| 12강 | 12-edit-file-tool |
| 13강 | 13-checkpoint |
| 14강 | 14-bash-tool |
| 15강 | 15-code-search-tool |
| 16강 | 16-coding-agent-class |
| 17강 | 17-stateless-limit |
| 18강 | 18-session-management |
| 19강 | 19-session-clear |
| 20강 | 20-context-window |
| 21강 | 21-history-compression |
| 22강 | 22-agent-memory |
| 23강 | 23-cli-wrapper |
| 24강 | 24-tool-logging |
| 25강 | 25-complete |
