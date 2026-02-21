/**
 * 21강: History Compression 적용하기 (스타터 코드)
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

  // TODO 6: chat() 메서드 수정
  // 1. compressHistory() 먼저 호출 (필요한 경우에만 실행됨)
  // 2. getHistory()와 getSummary() 둘 다 가져오기
  // 3. buildSystemPromptWithHistory()로 시스템 프롬프트 구성
  //
  // 힌트:
  // await this.conversationHistory.compressHistory();
  // const history = await this.conversationHistory.getHistory();
  // const summary = await this.conversationHistory.getSummary();
  // const systemPrompt = this.buildSystemPromptWithHistory(history, summary);

  async chat(userMessage: string): Promise<string> {
    // TODO 6: compressHistory 호출 추가
    // TODO 6: getSummary 호출 추가
    // TODO 6: buildSystemPromptWithHistory 사용

    const history = await this.conversationHistory.getHistory();

    const { text: assistantMessage } = await generateText({
      model: this.model,
      system: this.baseSystemPrompt, // ← TODO: buildSystemPromptWithHistory로 변경
      tools: this.tools,
      stopWhen: stepCountIs(10),
      prompt: userMessage,
    });

    await this.conversationHistory.addMessages(userMessage, assistantMessage);

    return assistantMessage;
  }

  // TODO 7: buildSystemPromptWithHistory() 구현
  // - summary가 있으면 "# Previous Conversation Summary" 섹션 추가
  // - history가 있으면 "# Recent Conversation" 섹션 추가
  // - 순서: 기본 프롬프트 → 요약 → 최근 대화 (LLM은 뒤쪽 정보에 더 집중)
  //
  // 힌트:
  // if (summary) {
  //   result += `\n\n# Previous Conversation Summary\n${summary}`;
  // }

  private buildSystemPromptWithHistory(
    history: ModelMessage[],
    summary: string | null
  ): string {
    // TODO 7 구현
    return this.baseSystemPrompt;
  }
}
