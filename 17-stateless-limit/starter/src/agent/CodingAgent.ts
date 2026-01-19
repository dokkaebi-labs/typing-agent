/**
 * 16강: CodingAgent 클래스로 REPL 만들기 (완성 코드)
 *
 * 이 클래스는 Agent 로직을 캡슐화합니다.
 * - model: 사용할 LLM 모델
 * - systemPrompt: Agent의 역할 정의
 * - tools: 5개 Tool 모음
 * - chat(): 메시지를 받아서 응답 반환
 */

import { generateText, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { readFileTool } from '../tools/readFileTool';
import { listFilesTool } from '../tools/listFilesTool';
import { editFileTool } from '../tools/editFileTool';
import { bashTool } from '../tools/bashTool';
import { codeSearchTool } from '../tools/codeSearchTool';

export class CodingAgent {
  private model = anthropic('claude-sonnet-4-20250514');

  private systemPrompt = '당신은 파일을 읽고 수정하는 코딩 에이전트입니다.';

  private tools = {
    readFile: readFileTool,
    listFiles: listFilesTool,
    editFile: editFileTool,
    bash: bashTool,
    codeSearch: codeSearchTool,
  };

  async chat(userMessage: string): Promise<string> {
    const response = await generateText({
      model: this.model,
      system: this.systemPrompt,
      prompt: userMessage,
      tools: this.tools,
      stopWhen: stepCountIs(10),
    });

    return response.text;
  }
}
