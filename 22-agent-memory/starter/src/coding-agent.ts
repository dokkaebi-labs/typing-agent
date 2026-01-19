/**
 * 22강: AgentMemory - 프로젝트 컨텍스트 (스타터 코드)
 *
 * CodingAgent에 AgentMemory를 추가하여 장기 기억을 구현합니다.
 */

import { generateText, ModelMessage, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { v4 as uuidv4 } from 'uuid';
import { ConversationHistory } from './conversation-history';
import { AgentMemory, AgentMemoryStorage } from './agent-memory';
import { readFileTool } from './tools/readFileTool';
import { listFilesTool } from './tools/listFilesTool';
import { editFileTool } from './tools/editFileTool';
import { bashTool } from './tools/bashTool';
import { codeSearchTool } from './tools/codeSearchTool';

export class CodingAgent {
  private model = anthropic('claude-sonnet-4-20250514');
  private baseSystemPrompt = '당신은 파일을 읽고 수정하는 코딩 에이전트입니다.';
  private conversationHistory: ConversationHistory;
  // TODO 4: agentMemory 필드 추가
  // 힌트: private agentMemory: AgentMemoryStorage;
  private tools = {
    readFile: readFileTool,
    listFiles: listFilesTool,
    editFile: editFileTool,
    bash: bashTool,
    codeSearch: codeSearchTool,
  };

  constructor(sessionId: string = uuidv4()) {
    // Session Storage (단기 기억)
    this.conversationHistory = new ConversationHistory(sessionId);

    // TODO 5: Memory Storage (장기 기억) 초기화
    // 힌트: this.agentMemory = new AgentMemory();
  }

  async chat(userMessage: string): Promise<string> {
    await this.conversationHistory.compressHistory();

    const history = await this.conversationHistory.getHistory();
    const summary = await this.conversationHistory.getSummary();
    // TODO 6: memory 가져오기
    // 힌트: const memory = await this.agentMemory.getMemory();

    const systemPrompt = this.buildSystemPromptWithHistory(
      history,
      summary,
      null // TODO 6: memory로 변경
    );

    const { text: assistantMessage } = await generateText({
      model: this.model,
      system: systemPrompt,
      tools: this.tools,
      stopWhen: stepCountIs(10),
      prompt: userMessage,
    });

    await this.conversationHistory.addMessages(userMessage, assistantMessage);

    return assistantMessage;
  }

  private buildSystemPromptWithHistory(
    history: ModelMessage[],
    summary: string | null,
    memory: string | null
  ): string {
    if (!summary && history.length === 0 && !memory) {
      return this.baseSystemPrompt;
    }

    let result = this.baseSystemPrompt;

    // TODO 7: Memory 섹션 추가
    // memory가 있으면 "# Project Memory" 헤더와 함께 추가
    // 힌트:
    // if (memory) {
    //   result += '\n\n# Project Memory';
    //   result += '\n아래는 이 프로젝트에 대해 기억해야 할 정보입니다:';
    //   result += `\n${memory}`;
    // }

    if (summary) {
      result += '\n\n# Previous Conversation Summary';
      result += `\n${summary}`;
    }

    if (history.length > 0) {
      result += '\n\n# Recent Conversation';
      for (const msg of history) {
        if (msg.role === 'user') {
          result += `\nUser: ${msg.content}`;
        } else if (msg.role === 'assistant') {
          result += `\nAssistant: ${msg.content}`;
        }
      }
    }

    return result;
  }

  // TODO 8: Memory 접근자 메서드 추가
  // addMemory()와 getMemory() 메서드를 추가하세요
  // 힌트:
  // async addMemory(content: string): Promise<void> {
  //   await this.agentMemory.addMemory(content);
  // }
  //
  // async getMemory(): Promise<string | null> {
  //   return this.agentMemory.getMemory();
  // }
}
