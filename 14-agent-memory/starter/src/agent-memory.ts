/**
 * 22강: AgentMemory - 프로젝트 컨텍스트 (실습 코드)
 *
 * Session과 별개로 동작하는 장기 기억을 구현합니다.
 * CODING_AGENT.md 파일에 프로젝트 정보를 저장합니다.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

export interface AgentMemoryStorage {
  addMemory(content: string): Promise<void>;
  getMemory(): Promise<string | null>;
}

export class AgentMemory implements AgentMemoryStorage {
  private memoryFile: string;

  constructor(projectRoot: string = '.') {
    // TODO 1: memoryFile 경로 설정
    // 프로젝트 루트에 'CODING_AGENT.md' 파일을 사용합니다.
    // 힌트: path.join(projectRoot, 'CODING_AGENT.md')
    this.memoryFile = ''; // 여기를 수정하세요
  }

  async addMemory(content: string): Promise<void> {
    // TODO 2: 메모리 추가 로직 구현
    // 1. 기존 메모리를 가져옵니다 (getMemory 사용)
    // 2. 기존 내용이 있으면 줄바꿈 후 추가, 없으면 새로 시작
    // 3. 각 항목은 '- ' 형식의 Markdown 리스트로 저장
    // 4. fs.writeFile로 파일에 저장
    //
    // 예시 결과:
    // - 이 프로젝트는 TypeScript 기반이야
    // - 테스트는 Jest를 써

    // 여기에 코드를 작성하세요
  }

  async getMemory(): Promise<string | null> {
    // TODO 3: 메모리 읽기 로직 구현
    // 1. fs.access로 파일 존재 여부 확인
    // 2. 파일이 없으면 null 반환
    // 3. 파일이 있으면 fs.readFile로 읽기
    // 4. 내용이 비어있으면 null 반환

    // 여기에 코드를 작성하세요
    return null;
  }
}
