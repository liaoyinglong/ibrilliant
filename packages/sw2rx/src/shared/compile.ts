import path from "path";
import * as fs from "fs-extra";
import { spawnWork } from "../helpers";
import { paths } from "./paths";

export async function compile(outputPath: string) {
  const tsconfigPath = path.resolve(paths.tempPath, "./tsconfig.json");
  const t = require(tsconfigPath);
  t.compilerOptions.outDir = outputPath;

  await fs.writeJSONSync(tsconfigPath, t);

  await spawnWork(`tsc -b ${tsconfigPath}`);
}
