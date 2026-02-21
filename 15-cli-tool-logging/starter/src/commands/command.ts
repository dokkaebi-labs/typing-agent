/**
 * 23강: 명령어 인터페이스 (실습 코드)
 *
 * 명령어 시스템의 기반이 되는 인터페이스와 레지스트리를 정의합니다.
 */

// TODO 1: Command 인터페이스 정의
// - name: 명령어 이름 (예: 'help')
// - aliases?: 별칭 배열 (예: ['h', '?'])
// - description: 설명
// - usage?: 사용법 (예: '/memory add <content>')
// - execute(args: string[]): Promise<CommandResult>
export interface Command {
  name: string;
  aliases?: string[];
  description: string;
  usage?: string;
  execute(args: string[]): Promise<CommandResult>;
}

// TODO 2: CommandResult 타입 정의
// 명령어 실행 결과를 나타냅니다.
// - success: 성공 (선택적 메시지)
// - error: 실패 (에러 메시지)
// - exit: 프로그램 종료
// - clear: 세션 초기화
export type CommandResult =
  | { type: 'success'; message?: string }
  | { type: 'error'; message: string }
  | { type: 'exit' }
  | { type: 'clear' };

// TODO 3: CommandRegistry 클래스 구현
// 명령어를 등록하고 실행하는 레지스트리입니다.
export class CommandRegistry {
  private commands: Command[] = [];

  // 명령어 등록
  register(command: Command): void {
    // 여기에 코드를 작성하세요
  }

  // 여러 명령어 한번에 등록
  registerAll(...commands: Command[]): void {
    // 여기에 코드를 작성하세요
  }

  // 등록된 모든 명령어 반환
  getAllCommands(): Command[] {
    // 여기에 코드를 작성하세요
    return [];
  }

  // TODO 4: 명령어 실행 메서드
  // 1. 입력에서 '/' 제거하고 명령어 이름과 인자 분리
  // 2. name 또는 aliases로 명령어 찾기
  // 3. 명령어가 없으면 null 반환
  // 4. 명령어가 있으면 execute 호출
  async execute(input: string): Promise<CommandResult | null> {
    // 여기에 코드를 작성하세요
    return null;
  }
}
