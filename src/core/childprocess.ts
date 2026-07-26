import { spawn } from "child_process";
import * as FP from "./fp";
import OS from "os";

export const cmdAction = (command: any) => {
  try {
    spawn(
      "cmd.exe",
      [
        "/c",
        "start",
        "cmd.exe",
        "/k",
        `set /p = D2D Reminder :: Hit Enter to execute : [ ${command.replaceAll("^", "^^").replaceAll("&", "^&").replaceAll("|", "^|").replaceAll("<", "^<").replaceAll(">", "^>")} ] & ${command}`,
      ],
      {
        detached: true,
        stdio: "ignore",
        cwd: OS.homedir(),
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      FP.logger.error(`Child process Error: ${error?.message}`);
    } else {
      FP.logger.error(`Child process Error: ${error}`);
    }
  }
};
