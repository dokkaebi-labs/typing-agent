/**
 * 16강: CodingAgent 클래스로 REPL 만들기 (스타터 코드)
 *
 * 이 파일에서는 Agent 로직을 클래스로 캡슐화합니다.
 * 클래스로 분리하면 관심사가 분리되어 코드가 깔끔해집니다.
 */

import { generateText, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { readFileTool } from '../tools/readFileTool';
import { listFilesTool } from '../tools/listFilesTool';
import { editFileTool } from '../tools/editFileTool';
import { bashTool } from '../tools/bashTool';
import { codeSearchTool } from '../tools/codeSearchTool';

export class CodingAgent {
  // TODO 1: 클래스 속성 정의
  // - model: anthropic('claude-sonnet-4-20250514')
  // - systemPrompt: '당신은 파일을 읽고 수정하는 코딩 에이전트입니다.'
  // - tools: 5개 Tool 객체 (readFile, listFiles, editFile, bash, codeSearch)
  //
  // 힌트: private 키워드로 외부에서 접근하지 못하게 합니다
  // 예시:
  // private model = anthropic('claude-sonnet-4-20250514');

  // TODO 2: chat() 메서드 구현
  // - 파라미터: userMessage (string)
  // - 반환값: Promise<string>
  // - generateText() 호출하여 응답 받기
  // - response.text 반환
  //
  // 힌트:
  // async chat(userMessage: string): Promise<string> {
  //   const response = await generateText({
  //     model: this.model,
  //     system: this.systemPrompt,
  //     prompt: userMessage,
  //     tools: this.tools,
  //     stopWhen: stepCountIs(10),
  //   });
  //   return response.text;
  // }
}
