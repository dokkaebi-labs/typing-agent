/**
 * 21강: History Compression 적용하기 (완성 코드)
 *
 * CodingAgent에 History Compression을 적용합니다.
 */

import { generateText, stepCountIs, ModelMessage } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { v4 as uuidv4 } from 'uuid';
import { ConversationHistory } from './conversation-history';
import { readFileTool } from './tools/readFileTool';
import { listFilesTool } from './tools/listFilesTool';
import { editFileTool } from './tools/editFileTool';
import { bashTool } from './tools/bashTool';
import { codeSearchTool } from './tools/codeSearchTool';

export class CodingAgent {
  private model = anthropic('claude-sonnet-4-20250514');
  private baseSystemPrompt = '당신은 파일을 읽고 수정하는 코딩 에이전트입니다.';
  private conversationHistory: ConversationHistory;
  private tools = {
    readFile: readFileTool,
    listFiles: listFilesTool,
    editFile: editFileTool,
    bash: bashTool,
    codeSearch: codeSearchTool,
  };

  constructor(sessionId: string = uuidv4()) {
    this.conversationHistory = new ConversationHistory(sessionId);
  }

  async chat(userMessage: string): Promise<string> {
    // 압축 먼저 (필요한 경우에만 실행됨)
    await this.conversationHistory.compressHistory();

    const history = await this.conversationHistory.getHistory();
    const summary = await this.conversationHistory.getSummary();

    const systemPrompt = this.buildSystemPromptWithHistory(history, summary);

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
    summary: string | null
  ): string {
    if (!summary && history.length === 0) {
      return this.baseSystemPrompt;
    }

    let result = this.baseSystemPrompt;

    if (summary) {
      result += `\n\n# Previous Conversation Summary\n${summary}`;
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
}
