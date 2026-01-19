/**
 * 20강: Context Window와 Sliding Window
 *
 * CodingAgent 클래스에 ConversationHistory를 통합합니다.
 */

import { generateText, stepCountIs } from 'ai';
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
  private systemPrompt = '당신은 파일을 읽고 수정하는 코딩 에이전트입니다.';
  private history: ConversationHistory;
  private tools = {
    readFile: readFileTool,
    listFiles: listFilesTool,
    editFile: editFileTool,
    bash: bashTool,
    codeSearch: codeSearchTool,
  };

  constructor(sessionId: string = uuidv4()) {
    this.history = new ConversationHistory(sessionId);
  }

  async chat(userMessage: string): Promise<string> {
    // 1. 이전 대화 이력 불러오기
    const previousMessages = await this.history.getHistory();

    // 2. 현재 메시지 추가
    const messages = [
      ...previousMessages,
      { role: 'user' as const, content: userMessage },
    ];

    // 3. LLM 호출 (전체 이력과 함께)
    const response = await generateText({
      model: this.model,
      system: this.systemPrompt,
      messages: messages,
      tools: this.tools,
      stopWhen: stepCountIs(10),
    });

    // 4. 대화 이력 저장
    await this.history.addMessages(userMessage, response.text);

    return response.text;
  }
}
