/**
 * 18강: Session으로 대화 이력 관리하기 (스타터 코드)
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

// TODO 1: CodingAgent 클래스에 history 속성 추가
// - private history: ConversationHistory
//
// 힌트:
// export class CodingAgent {
//   private model = anthropic('claude-sonnet-4-20250514');
//   private systemPrompt = '당신은 파일을 읽고 수정하는 코딩 에이전트입니다.';
//   private history: ConversationHistory;  // 추가
//   private tools = { ... };
// }

// TODO 2: 생성자에서 ConversationHistory 인스턴스 생성
// - sessionId 파라미터 받기 (기본값: uuidv4())
// - this.history = new ConversationHistory(sessionId)
//
// 힌트:
// constructor(sessionId: string = uuidv4()) {
//   this.history = new ConversationHistory(sessionId);
// }

// TODO 3: chat() 메서드에서 이전 대화 이력 불러오기
// - const previousMessages = await this.history.getHistory()
//
// 힌트: chat() 메서드 시작 부분에 추가

// TODO 4: 현재 메시지를 이전 이력과 합치기
// - messages 배열 생성
// - [...previousMessages, { role: 'user', content: userMessage }]
//
// 힌트:
// const messages = [
//   ...previousMessages,
//   { role: 'user' as const, content: userMessage },
// ];

// TODO 5: generateText() 호출 시 messages 배열 사용
// - prompt 대신 messages 사용
//
// 힌트:
// const response = await generateText({
//   model: this.model,
//   system: this.systemPrompt,
//   messages: messages,  // prompt 대신 messages
//   tools: this.tools,
//   stopWhen: stepCountIs(10),
// });

// TODO 6: 응답 후 대화 이력 저장
// - await this.history.addMessages(userMessage, response.text)
//
// 힌트: return 직전에 추가

export class CodingAgent {
  private model = anthropic('claude-sonnet-4-20250514');
  private systemPrompt = '당신은 파일을 읽고 수정하는 코딩 에이전트입니다.';
  // TODO 1 구현: history 속성 추가
  private tools = {
    readFile: readFileTool,
    listFiles: listFilesTool,
    editFile: editFileTool,
    bash: bashTool,
    codeSearch: codeSearchTool,
  };

  constructor(sessionId: string = uuidv4()) {
    // TODO 2 구현: ConversationHistory 인스턴스 생성
  }

  async chat(userMessage: string): Promise<string> {
    // TODO 3 구현: 이전 대화 이력 불러오기

    // TODO 4 구현: 현재 메시지를 이전 이력과 합치기

    // TODO 5 구현: generateText() 호출 시 messages 배열 사용
    const response = await generateText({
      model: this.model,
      system: this.systemPrompt,
      prompt: userMessage, // TODO: messages로 변경
      tools: this.tools,
      stopWhen: stepCountIs(10),
    });

    // TODO 6 구현: 대화 이력 저장

    return response.text;
  }
}
