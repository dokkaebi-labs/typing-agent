/**
 * 25강: CodingAgent 클래스 (완성 코드)
 *
 * 모든 기능이 통합된 Coding Agent 클래스입니다.
 * - 5개 Tool (readFile, listFiles, editFile, bash, codeSearch)
 * - Session (ConversationHistory)
 * - Memory (AgentMemory)
 * - Tool Logging (ToolLogger)
 */

import { generateText, ModelMessage, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { v4 as uuidv4 } from 'uuid';
import { ConversationHistory } from './conversation-history';
import { AgentMemory, AgentMemoryStorage } from './agent-memory';
import { ToolLogger } from './ui/tool-logger';
import { readFileTool } from './tools/readFileTool';
import { listFilesTool } from './tools/listFilesTool';
import { editFileTool } from './tools/editFileTool';
import { bashTool } from './tools/bashTool';
import { codeSearchTool } from './tools/codeSearchTool';

export class CodingAgent {
  private model = anthropic('claude-sonnet-4-20250514');
  private baseSystemPrompt = '당신은 파일을 읽고 수정하는 코딩 에이전트입니다.';
  private conversationHistory: ConversationHistory;
  private agentMemory: AgentMemoryStorage;
  private toolLogger = new ToolLogger();

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

    // Memory Storage (장기 기억)
    this.agentMemory = new AgentMemory();
  }

  async chat(userMessage: string): Promise<string> {
    await this.conversationHistory.compressHistory();

    const history = await this.conversationHistory.getHistory();
    const summary = await this.conversationHistory.getSummary();
    const memory = await this.agentMemory.getMemory();

    const systemPrompt = this.buildSystemPromptWithHistory(
      history,
      summary,
      memory
    );

    const { text: assistantMessage } = await generateText({
      model: this.model,
      system: systemPrompt,
      tools: this.tools,
      stopWhen: stepCountIs(10),
      prompt: userMessage,

      // 24강: Tool 호출 로깅
      onStepFinish: ({ toolCalls, toolResults }) => {
        this.handleStepFinish(
          toolCalls.filter(
            (c): c is typeof c & { input: Record<string, unknown> } =>
              !('dynamic' in c && c.dynamic)
          ),
          toolResults
        );
      },
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

    if (memory) {
      result += '\n\n# Project Memory';
      result += '\n아래는 이 프로젝트에 대해 기억해야 할 정보입니다:';
      result += `\n${memory}`;
    }

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

  // 24강: Tool 호출 로깅 처리
  private handleStepFinish(
    toolCalls: Array<{ toolName: string; input: Record<string, unknown> }>,
    toolResults: Array<{ toolName: string; result: unknown }>
  ): void {
    for (const call of toolCalls) {
      this.toolLogger.logToolStart(call.toolName, call.input);
    }

    for (const result of toolResults) {
      const resultStr =
        typeof result.result === 'string'
          ? result.result
          : JSON.stringify(result.result);

      if (resultStr.startsWith('Error:')) {
        this.toolLogger.logToolError(result.toolName, resultStr);
      } else {
        this.toolLogger.logToolComplete(result.toolName, resultStr);
      }
    }
  }

  // CLI에서 AgentMemory에 접근하기 위한 접근자
  getAgentMemory(): AgentMemoryStorage {
    return this.agentMemory;
  }

  // 직접 Memory 조작용 메서드
  async addMemory(content: string): Promise<void> {
    await this.agentMemory.addMemory(content);
  }

  async getMemory(): Promise<string | null> {
    return this.agentMemory.getMemory();
  }
}
