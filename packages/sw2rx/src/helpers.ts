import * as path from "path";
import { spawn } from "child_process";
import * as fs from "fs-extra";
import { createLogger } from "@ibrilliant/utils";

const log = createLogger("sw2rx.helpers");

export function pathRelativeCwd(str: string) {
  return path.resolve(process.cwd(), str);
}

export async function spawnWork(command: string) {
  return new Promise((resolve) => {
    const cmd = spawn(command, { stdio: "inherit", shell: true });
    cmd.on("exit", resolve);
  });
}

export async function delUnnecessaryFile(outputPath: string, name: string) {
  await fs.remove(`${outputPath}/${name}/runtime.ts`);
  log(`删除【${name}】文件夹不必要的一些文件 √`);
}
