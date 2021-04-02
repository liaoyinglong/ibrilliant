import * as fs from "fs-extra";
import { spawnWork } from "../helpers";

export async function compile(outputPath: string, tsconfigPath: string) {
  const t = require(tsconfigPath);
  t.compilerOptions.outDir = outputPath;

  await fs.writeJSON(tsconfigPath, t);

  await spawnWork(`tsc -b ${tsconfigPath}`);
}
