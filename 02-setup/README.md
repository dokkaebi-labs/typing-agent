# 02-setup: 환경 설정

이 강의는 환경 설정 가이드입니다. 별도 실습 코드 없이 강의 스크립트를 따라하세요.

## 설치할 패키지

```bash
npm install ai @ai-sdk/anthropic zod dotenv
npm install -D typescript ts-node @types/node
```

## 필요한 파일

1. `.env` - API Key 설정
2. `tsconfig.json` - TypeScript 설정
3. `src/index.ts` - 첫 번째 코드

## 확인 방법

```bash
npx ts-node src/index.ts
```

Claude의 응답이 출력되면 성공입니다.
