/**
 * 23강: AgentMemory - 프로젝트 컨텍스트
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
    this.memoryFile = path.join(projectRoot, 'CODING_AGENT.md');
  }

  async addMemory(content: string): Promise<void> {
    const existing = await this.getMemory();

    const updated = existing ? `${existing}\n- ${content}` : `- ${content}`;

    await fs.writeFile(this.memoryFile, updated);
  }

  async getMemory(): Promise<string | null> {
    try {
      await fs.access(this.memoryFile);
    } catch {
      return null;
    }

    const content = await fs.readFile(this.memoryFile, 'utf-8');
    return content.trim() || null;
  }
}
