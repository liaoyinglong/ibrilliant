import { pathRelativeProject } from "../../helpers";
import * as fs from "fs-extra";
import { createLogger } from "@ibrilliant/utils";

const log = createLogger("sw2rx.更新jar文件");

export async function setJar() {
  const openApiCliPath = require.resolve(
    `@openapitools/openapi-generator-cli/package.json`
  );
  if (!openApiCliPath) {
    return;
  }
  const normalizedPath = openApiCliPath.replace("package.json", "versions");

  const jarPath = pathRelativeProject("./jar");

  await fs.copy(jarPath, normalizedPath);

  log("成功");
}
