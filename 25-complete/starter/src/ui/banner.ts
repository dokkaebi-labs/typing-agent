/**
 * 23강: 웰컴 배너 (완성 코드)
 */

import { colors } from './colors';

const VERSION = '1.0.0';

const asciiArt = `
${colors.brightCyan}
   ██████╗ ██████╗ ██████╗ ██╗███╗   ██╗ ██████╗
  ██╔════╝██╔═══██╗██╔══██╗██║████╗  ██║██╔════╝
  ██║     ██║   ██║██║  ██║██║██╔██╗ ██║██║  ███╗
  ██║     ██║   ██║██║  ██║██║██║╚██╗██║██║   ██║
  ╚██████╗╚██████╔╝██████╔╝██║██║ ╚████║╚██████╔╝
   ╚═════╝ ╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝
   █████╗  ██████╗ ███████╗███╗   ██╗████████╗
  ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝
  ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║
  ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║
  ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║
  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝
${colors.reset}`;

export function printWelcome(): void {
  console.log(asciiArt);
  console.log();
  console.log(
    `${colors.bold}${colors.primary}  ╔═══════════════════════════════════════════════════════════╗${colors.reset}`
  );
  console.log(
    `${colors.bold}${colors.primary}  ║          AI-Powered Coding Assistant                      ║${colors.reset}`
  );
  console.log(
    `${colors.bold}${colors.primary}  ║                   Version ${VERSION}                          ║${colors.reset}`
  );
  console.log(
    `${colors.bold}${colors.primary}  ╚═══════════════════════════════════════════════════════════╝${colors.reset}`
  );
  console.log();
  console.log(
    `${colors.muted}  Type ${colors.brightCyan}/help${colors.muted} for commands or start coding!${colors.reset}`
  );
  console.log(
    `${colors.muted}  Type ${colors.brightCyan}/exit${colors.muted} to leave.${colors.reset}`
  );
  console.log();
}

export function printGoodbye(): void {
  console.log();
  console.log(
    `${colors.brightGreen}╔═══════════════════════════════════════╗${colors.reset}`
  );
  console.log(
    `${colors.brightGreen}║   ${colors.bold}Happy Coding! See you!${colors.reset}${colors.brightGreen}              ║${colors.reset}`
  );
  console.log(
    `${colors.brightGreen}╚═══════════════════════════════════════╝${colors.reset}`
  );
  console.log();
}
